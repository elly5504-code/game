// 추리 채점 유틸리티
// 사건 정답 데이터와 플레이어 추리서를 비교하여 점수/등급을 계산합니다.
// AI는 점수를 변경하지 않고, 계산된 등급에 맞는 피드백만 작성합니다.
// 평가 철학: 감점이 아닌 칭찬 중심, 사건 해결 성취감 부여

const countMatchedKeywords = (text, keywords) => {
  if (!text || !keywords || keywords.length === 0) return 0
  const lower = text.toLowerCase()
  return keywords.filter((kw) =>
    lower.includes(String(kw).toLowerCase())
  ).length
}

const getMatchedKeywords = (text, keywords) => {
  if (!text || !keywords || keywords.length === 0) return []
  const lower = text.toLowerCase()
  return keywords.filter((kw) =>
    lower.includes(String(kw).toLowerCase())
  )
}

const calcPartialScore = (matched, total, maxScore) => {
  if (total === 0) return 0
  const ratio = Math.min(matched / total, 1)
  return Math.round(ratio * maxScore)
}

// 등급 정의 (관대한 기준) - 이모지 대신 텍스트 등급 라벨 사용
const GRADES = [
  { id: 'legend', rank: 'S', name: '전설의 탐정', minScore: 70 },
  { id: 'master', rank: 'A', name: '명탐정', minScore: 60 },
  { id: 'veteran', rank: 'B', name: '전문탐정', minScore: 40 },
  { id: 'rookie', rank: 'C', name: '초보탐정', minScore: 20 },
  { id: 'trainee', rank: 'D', name: '수습탐정', minScore: 0 },
]

const getGrade = (score) => {
  return GRADES.find((g) => score >= g.minScore) || GRADES[GRADES.length - 1]
}

export const evaluateReasoning = (caseData, selectedSuspect, reasoning) => {
  const solution = caseData?.solution || {}
  const keywords = solution.scoringKeywords || {}
  const text = reasoning || ''

  const details = {}
  let score = 0

  // ① 범인 선택 (가장 높은 비중, 50점)
  const isCorrectCulprit =
    !!selectedSuspect &&
    !!solution.culprit &&
    selectedSuspect === solution.culprit
  details.culprit = {
    correct: isCorrectCulprit,
    selected: selectedSuspect,
    answer: solution.culprit,
    score: isCorrectCulprit ? 50 : 0,
  }
  score += details.culprit.score

  // ② 범행 방법 (20점)
  const methodKeywords = keywords.method || []
  const methodMatched = countMatchedKeywords(text, methodKeywords)
  const methodScore = calcPartialScore(
    methodMatched,
    methodKeywords.length,
    20
  )
  details.method = {
    matched: methodMatched,
    total: methodKeywords.length,
    matchedKeywords: getMatchedKeywords(text, methodKeywords),
    score: methodScore,
  }
  score += methodScore

  // ③ 범행 동기 (15점)
  const motiveKeywords = keywords.motive || []
  const motiveMatched = countMatchedKeywords(text, motiveKeywords)
  const motiveScore = calcPartialScore(
    motiveMatched,
    motiveKeywords.length,
    15
  )
  details.motive = {
    matched: motiveMatched,
    total: motiveKeywords.length,
    matchedKeywords: getMatchedKeywords(text, motiveKeywords),
    score: motiveScore,
  }
  score += motiveScore

  // ④ 증거 활용 (15점)
  const evidenceKeywords = keywords.evidence || []
  const evidenceMatched = countMatchedKeywords(text, evidenceKeywords)
  const evidenceScore = calcPartialScore(
    evidenceMatched,
    evidenceKeywords.length,
    15
  )
  details.evidence = {
    matched: evidenceMatched,
    total: evidenceKeywords.length,
    matchedKeywords: getMatchedKeywords(text, evidenceKeywords),
    score: evidenceScore,
  }
  score += evidenceScore

  const isMethodMatched = methodMatched >= 1
  const isMotiveMatched = motiveMatched >= 1
  const isEvidenceMatched = evidenceMatched >= 1

  // --- 등급 및 점수 오버라이드 정밀 규정 ---
  if (isCorrectCulprit) {
    if (!isMethodMatched) {
      // 1. 용의자만(범인만) 맞추고 살해도구 틀릴 때 -> '전문탐정' (45점) 보장 및 고정
      score = 45
    } else {
      // 용의자도 맞추고 살해도구도 맞춤 -> 최소 '명탐정'(65점) 보장
      if (score < 65) {
        score = 65
      }
    }
  } else {
    // 플레이어가 범인을 틀린 경우
    if (isMethodMatched) {
      if (isMotiveMatched && isEvidenceMatched) {
        // 2. 용의자는 틀렸고, 살해도구와 나머지 요소(동기 및 증거) 전부 맞춘 경우 -> '전문탐정' (45점)
        score = 45
      } else {
        // 3. 용의자는 틀렸고, 살해도구만 맞춘 경우 -> '초보탐정' (25점)
        score = 25
      }
    } else {
      // 용의자도 틀리고 살해도구도 틀림 -> '수습탐정' (15점)
      if (score >= 20) {
        score = 15
      }
    }
  }

  const grade = getGrade(score)

  // 격려 중심 피드백 (칭찬 80% : 보완 20%)
  const goodPoints = []
  const badPoints = []

  // --- 칭찬 영역 (80%) ---
  if (isCorrectCulprit) {
    goodPoints.push('범인을 정확하게 특정하셨습니다! 사건의 핵심을 꿰뚫어 보는 탁월한 통찰력입니다.')
    goodPoints.push('사건의 흐름을 종합적으로 파악하여 진범을 찾아내는 데 성공하셨습니다.')
  }

  if (methodScore >= 15) {
    goodPoints.push('범행 방법을 핵심에 가깝게 재구성하셨습니다. 물증의 의미를 정확히 읽어낸 훌륭한 추리입니다.')
  } else if (methodScore > 0) {
    goodPoints.push('범행 방법의 단서를 포착하셨습니다. 현장의 물증에 주목한 점이 좋습니다.')
  }

  if (motiveScore >= 11) {
    goodPoints.push('범행 동기를 명확히 이해하고 계십니다. 인물 관계와 배경을 깊이 있게 분석하셨습니다.')
  } else if (motiveScore > 0) {
    goodPoints.push('동기의 실마리를 잡으셨습니다. 인물 간의 관계에 주목한 점이 인상적입니다.')
  }

  if (evidenceScore >= 11) {
    goodPoints.push('핵심 증거를 적절히 활용하여 논리를 전개하셨습니다. 증거 기반 추리가 매우 훌륭합니다.')
  } else if (evidenceScore > 0) {
    goodPoints.push('현장 증거를 추리에 활용하셨습니다. 단서를 연결하려는 노력이 돋보입니다.')
  }

  if (text && text.trim().length >= 30) {
    goodPoints.push('추리 과정을 성실하게 작성해주셨습니다. 논리적 사고력이 잘 드러납니다.')
  }

  // --- 보완 영역 (20%) ---
  if (!isCorrectCulprit) {
    badPoints.push('지목하신 인물은 이번 사건의 진범이 아닙니다. 아래의 [사건 해설 보기]를 통해 사건의 진짜 범인이 누구였는지, 그리고 현장의 단서가 숨기고 있던 알리바이 트릭과 비밀 동기를 직접 밝혀보세요!')
  }

  if (methodScore === 0 && isCorrectCulprit) {
    badPoints.push('범행 방법을 조금 더 구체적으로 설명하셨다면 완벽한 추리가 되었을 것입니다.')
  }

  if (motiveScore === 0 && isCorrectCulprit) {
    badPoints.push('범행 동기에 대한 설명을 보완하시면 더욱 설득력 있는 추리가 될 것입니다.')
  }

  if (evidenceScore === 0 && isCorrectCulprit) {
    badPoints.push('구체적인 증거를 더 활용하시면 추리의 깊이가 한층 더해질 것입니다.')
  }

  if (!text || text.trim().length < 10) {
    badPoints.push('추리 내용을 조금 더 풀어서 작성해주시면 훨씬 더 좋은 평가를 받으실 수 있을 것입니다.')
  }

  // 보완점이 없으면 칭찬으로 채우기
  if (badPoints.length === 0) {
    goodPoints.push('전반적으로 균형 잡힌 추리였습니다. 사건 해결을 축하드립니다!')
  }

  // 한 줄 총평 (등급별, 격려 중심)
  let oneLine = ''
  if (grade.id === 'legend') {
    oneLine = '완벽한 추리였습니다. 모든 단서가 정확히 맞물려 돌아갔습니다. 진정한 탐정입니다!'
  } else if (grade.id === 'master') {
    oneLine = '훌륭한 추리입니다! 범인을 정확히 맞추며 사건을 해결하셨습니다. 핵심을 정확히 짚어냈습니다.'
  } else if (grade.id === 'veteran') {
    oneLine = '좋은 추리였습니다! 추리의 방향성이 매우 훌륭했습니다. 다음 사건에서는 더 완벽할 것입니다.'
  } else if (grade.id === 'rookie') {
    oneLine = '추리의 일부를 잘 파악하셨습니다. 다음 사건에서는 분명 더 좋은 결과가 있을 것입니다.'
  } else {
    oneLine = '이번 사건은 어려웠을 수 있습니다. 사건 해설을 통해 더 많은 것을 얻어가시길 바랍니다.'
  }

  return {
    score,
    maxScore: 100,
    grade,
    details,
    goodPoints,
    badPoints,
    oneLine,
  }
}

export default { evaluateReasoning }