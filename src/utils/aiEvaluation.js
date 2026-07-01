// ============================================================
// AI 추리 심층 분석 서비스 (OpenRouter / google/gemini-3.5-flash)
// ------------------------------------------------------------
// 설계 원칙:
//   - 점수/등급은 scoring.js(evaluateReasoning)가 결정한다.
//     AI는 점수를 절대 바꾸지 않고, 계산된 등급에 맞는
//     "정성적(qualitative) 심층 피드백"만 생성한다.
//   - 사건 전체 맥락(정답/증거/용의자)과 플레이어의 실제 추리서를
//     함께 넘겨 사건에 특화된, 진짜 '수사반장'의 브리핑을 받는다.
//   - 실패(네트워크/키 없음/파싱 오류) 시에는 호출부에서
//     scoring.js의 결정론적 피드백으로 우아하게 폴백한다.
// ============================================================

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'
const MODEL = 'google/gemini-3.5-flash'

// Vite는 VITE_ 접두어 환경변수를 클라이언트 번들에 주입한다.
// (프로젝트 루트 .env 의 VITE_OPENROUTER_API_KEY 를 사용)
const getApiKey = () =>
  (import.meta.env.VITE_OPENROUTER_API_KEY || '').trim()

/** AI 분석 사용 가능 여부 (키가 설정되어 있는지) */
export const isAIConfigured = () => getApiKey().length > 0

// ------------------------------------------------------------
// 프롬프트 구성
// ------------------------------------------------------------

const SYSTEM_PROMPT = `당신은 30년 경력의 대한민국 강력계 베테랑 '수사반장'입니다.
신입 탐정(플레이어)이 제출한 최종 추리서를, 사건의 진실을 이미 알고 있는 상태에서 전문적으로 평가합니다.

[역할과 태도]
- 노련하고 진중하되 후배를 아끼는 선배 형사의 말투로, 격려 80% : 보완 20% 비율을 지킵니다.
- 반드시 플레이어가 "실제로 쓴 추리서 문장"에 근거해 구체적으로 짚어줍니다. 일반론/뻔한 칭찬 금지.
- 이미 산출된 '점수/등급'은 절대 언급하거나 재평가하지 않습니다. 등급의 톤(높으면 감탄, 낮으면 격려)에만 맞춥니다.

[스포일러 규칙 — 매우 중요]
- 플레이어가 '정답 범인'을 맞혔다면: 그 통찰을 확실히 인정하고 근거를 칭찬합니다.
- 플레이어가 '정답 범인'을 틀렸다면: 진범의 실명이나 정답 트릭을 절대 직접 공개하지 마세요.
  대신 플레이어가 놓친 단서의 '방향'만 제시하고, 반드시 '[사건 해설 보기]에서 진실을 직접 확인해보라'고 권유합니다.

[출력 형식 — 반드시 이 JSON 스키마로만 응답]
{
  "goodPoints": string[],       // 잘한 점 2~4개. 각 항목은 플레이어 문장에 근거한 구체적 칭찬.
  "badPoints": string[],        // 아쉬운 점 1~3개. 부드럽지만 실질적인 보완점.
  "detailedAnalysis": string,   // 수사반장 심층 브리핑 3~5문장. 사건 정황과 플레이어 논리를 엮은 서사형 총평.
  "oneLine": string             // 등급에 어울리는 임팩트 있는 한 문장 총평.
}
JSON 외의 어떤 텍스트, 마크다운, 코드펜스도 출력하지 마세요. 모든 내용은 자연스러운 한국어로 작성하세요.`

const truncate = (str, max = 600) => {
  const s = String(str || '')
  return s.length > max ? s.slice(0, max) + '…' : s
}

const buildUserPrompt = (caseData, playerReport, evaluation) => {
  const solution = caseData?.solution || {}
  const details = evaluation?.details || {}
  const grade = evaluation?.grade || {}

  const suspectLines = (caseData?.suspects || [])
    .map(
      (s) =>
        `- ${s.name}${s.job ? ` (${s.job})` : ''}: ${
          Array.isArray(s.description) ? s.description.join(', ') : s.description || ''
        }`
    )
    .join('\n')

  const evidenceLines = (caseData?.evidence || [])
    .map((e) => {
      const desc = Array.isArray(e.description)
        ? e.description.join(' / ')
        : e.description || ''
      return `- ${e.title}: ${desc}`
    })
    .join('\n')

  const isCorrect = !!details.culprit?.correct

  return `# 사건 파일
- 사건명: ${caseData?.title || '미상'}
- 피해자: ${caseData?.briefing?.victim || '미상'}
- 사건 개요: ${truncate(caseData?.briefing?.summary, 500)}

# 용의자
${suspectLines || '(정보 없음)'}

# 수집된 증거
${evidenceLines || '(정보 없음)'}

# 사건의 진실 (정답 — 평가 기준으로만 사용, 규칙에 따라 스포일러 주의)
- 진범: ${solution.culprit || '미상'}
- 범행 방법: ${solution.method || '미상'}
- 범행 동기: ${truncate(solution.motive, 500)}

# 플레이어가 제출한 최종 추리서 (← 평가 대상)
- 지목한 범인: ${playerReport?.selectedSuspect || '(미선택)'}
- 정답 여부: ${isCorrect ? '정답 (진범을 정확히 지목함)' : '오답 (진범이 아님)'}
- 추리서 원문:
"""
${truncate(playerReport?.reasoning, 1500) || '(작성된 추리 내용 없음)'}
"""

# 채점 시스템이 감지한 요소 (참고용 — 점수는 언급 금지)
- 범행 방법 단서 포착: ${details.method?.matched > 0 ? `있음 (${(details.method.matchedKeywords || []).join(', ')})` : '없음'}
- 범행 동기 단서 포착: ${details.motive?.matched > 0 ? `있음 (${(details.motive.matchedKeywords || []).join(', ')})` : '없음'}
- 증거 활용 포착: ${details.evidence?.matched > 0 ? `있음 (${(details.evidence.matchedKeywords || []).join(', ')})` : '없음'}
- 부여된 등급 톤(내부 참고): ${grade.name || ''}${grade.rank ? ` (${grade.rank})` : ''}

위 추리서를 규칙에 따라 심층 평가하여 지정된 JSON 스키마로만 응답하세요.`
}

// ------------------------------------------------------------
// 응답 파싱 / 정규화
// ------------------------------------------------------------

const stripFences = (text) => {
  let t = String(text || '').trim()
  // ```json ... ``` 코드펜스 방어적 제거
  const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/i)
  if (fence) t = fence[1].trim()
  return t
}

const safeParseJSON = (text) => {
  const cleaned = stripFences(text)
  try {
    return JSON.parse(cleaned)
  } catch {
    // 본문 안에서 첫 번째 { ... } 블록만 추출 재시도
    const start = cleaned.indexOf('{')
    const end = cleaned.lastIndexOf('}')
    if (start !== -1 && end !== -1 && end > start) {
      try {
        return JSON.parse(cleaned.slice(start, end + 1))
      } catch {
        return null
      }
    }
    return null
  }
}

const toStringArray = (val, max) => {
  if (!Array.isArray(val)) return []
  const out = val
    .map((v) => (typeof v === 'string' ? v.trim() : String(v || '').trim()))
    .filter(Boolean)
  return typeof max === 'number' ? out.slice(0, max) : out
}

const normalize = (parsed) => {
  if (!parsed || typeof parsed !== 'object') return null
  const goodPoints = toStringArray(parsed.goodPoints, 4)
  const badPoints = toStringArray(parsed.badPoints, 3)
  const detailedAnalysis =
    typeof parsed.detailedAnalysis === 'string'
      ? parsed.detailedAnalysis.trim()
      : ''
  const oneLine =
    typeof parsed.oneLine === 'string' ? parsed.oneLine.trim() : ''

  // 최소 유효성: UI가 항상 렌더링하는 '잘한 점(goodPoints)'과 '종합 평가(oneLine)'가
  // 둘 다 있어야 유효한 AI 결과로 인정한다. 하나라도 비면 null을 반환해
  // 호출부가 결정론적 폴백(scoring.js)으로 우아하게 넘어가도록 한다.
  // (detailedAnalysis는 선택 항목이며 UI에서 개별적으로 가드된다.)
  if (goodPoints.length === 0 || !oneLine) return null

  return { goodPoints, badPoints, detailedAnalysis, oneLine }
}

// ------------------------------------------------------------
// 메인 호출 함수
// ------------------------------------------------------------

/**
 * 플레이어 추리서를 AI(수사반장)로 심층 분석한다.
 * @returns {Promise<{goodPoints:string[], badPoints:string[], detailedAnalysis:string, oneLine:string}>}
 * @throws {Error} 키 없음('NO_API_KEY') / API 오류 / 파싱 실패
 */
export async function analyzeReasoning({ caseData, playerReport, evaluation, signal }) {
  const apiKey = getApiKey()
  if (!apiKey) {
    const err = new Error('NO_API_KEY')
    err.code = 'NO_API_KEY'
    throw err
  }

  // 내부 컨트롤러: 외부 signal(언마운트 취소)과 타임아웃을 함께 묶는다.
  //  - 외부 취소 → AbortError 그대로 전파 (호출부에서 조용히 무시)
  //  - 타임아웃 → TIMEOUT 에러 (호출부에서 '오류' 상태 + 다시 시도)
  const controller = new AbortController()
  const relayAbort = () => controller.abort()
  if (signal) {
    if (signal.aborted) controller.abort()
    else signal.addEventListener('abort', relayAbort, { once: true })
  }
  // 타임아웃은 응답 본문(res.json / res.text) 수신까지 '전체 작업'을 감싼다.
  //  - fetch()는 응답 헤더가 오면 resolve되지만 본문이 스트리밍 도중 멈출 수 있으므로
  //    본문 파싱이 끝날 때까지 타임아웃/abort가 유효해야 무한 로딩을 막는다.
  const timeoutId = setTimeout(() => controller.abort(), 30000)

  try {
    const res = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        // 선택: OpenRouter 리더보드용 앱 식별 헤더
        'HTTP-Referer':
          typeof window !== 'undefined' ? window.location.origin : '',
        'X-Title': 'MYSTERY FILE - AI Detective Game',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: buildUserPrompt(caseData, playerReport, evaluation) },
        ],
        response_format: { type: 'json_object' },
        max_tokens: 2048,
        temperature: 0.75,
      }),
      signal: controller.signal,
    })

    if (!res.ok) {
      let body = ''
      try {
        body = await res.text()
      } catch {
        /* ignore */
      }
      const err = new Error(`API_ERROR_${res.status}`)
      err.code = 'API_ERROR'
      err.status = res.status
      err.body = body
      throw err
    }

    const data = await res.json()
    const content = data?.choices?.[0]?.message?.content || ''
    const parsed = safeParseJSON(content)
    const result = normalize(parsed)

    if (!result) {
      const err = new Error('PARSE_ERROR')
      err.code = 'PARSE_ERROR'
      err.raw = content
      throw err
    }

    return result
  } catch (e) {
    // 외부 signal에 의한 취소면 그대로 전파(AbortError) → 호출부가 조용히 무시
    if (signal && signal.aborted) throw e
    // 그 외 abort(=우리 타임아웃, fetch/본문 어느 단계든)는 재시도 가능한 에러로 변환
    if (e?.name === 'AbortError') {
      const err = new Error('TIMEOUT')
      err.code = 'TIMEOUT'
      throw err
    }
    // 우리가 의도적으로 던진 에러(API_ERROR/PARSE_ERROR/NO_API_KEY)는 그대로,
    // 그 외(네트워크 TypeError 등)는 NETWORK_ERROR로 표시
    if (!e.code) e.code = 'NETWORK_ERROR'
    throw e
  } finally {
    clearTimeout(timeoutId)
    if (signal) signal.removeEventListener('abort', relayAbort)
  }
}

export default { analyzeReasoning, isAIConfigured }
