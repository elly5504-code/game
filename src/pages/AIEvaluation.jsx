import { useState, useEffect, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import '../styles/page.css'
import '../styles/aieval.css'
import { getCaseData } from '../data/cases.js'
import { evaluateReasoning } from '../utils/scoring.js'
import { analyzeReasoning, isAIConfigured } from '../utils/aiEvaluation.js'
import badgeS from '../assets/badges/badge_S.png'
import badgeA from '../assets/badges/badge_A.png'
import badgeB from '../assets/badges/badge_B.png'
import badgeC from '../assets/badges/badge_C.png'
import badgeD from '../assets/badges/badge_D.png'

/* ===== 인라인 SVG 아이콘 (이모지 미사용) ===== */

const IconArrowLeft = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
    {...props}
  >
    <path d="M19 12H5" />
    <path d="M12 19l-7-7 7-7" />
  </svg>
)

const IconCheck = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
    {...props}
  >
    <path d="M20 6L9 17l-5-5" />
  </svg>
)

const IconDot = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
    {...props}
  >
    <circle cx="12" cy="12" r="4" />
  </svg>
)

/* AI 분석 아이콘 (지문 스캔 느낌) */
const IconScan = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
    {...props}
  >
    <path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2" />
    <path d="M12 7a5 5 0 0 0-5 5M12 7a5 5 0 0 1 5 5M9.5 12a2.5 2.5 0 0 1 5 0v2M12 14v2" />
  </svg>
)

const BADGE_IMAGES = {
  legend: badgeS,  // S: 전설의 탐정
  master: badgeA,  // A: 명탐정
  veteran: badgeB, // B: 전문탐정
  rookie: badgeC,  // C: 초보탐정
  trainee: badgeD, // D: 수습탐정
}

/* ===== AI 심층 분석 로딩 패널 ===== */
const AI_LOADING_STEPS = [
  '추리서 원문 정밀 판독 중',
  '현장 증거와 진술 교차 대조 중',
  '논리 흐름 및 인과관계 분석 중',
  '수사반장 브리핑 작성 중',
]

function AILoadingPanel() {
  const [step, setStep] = useState(0)
  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % AI_LOADING_STEPS.length)
    }, 1500)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="eval-ai-loading" aria-live="polite" aria-busy="true">
      <div className="eval-ai-loading-scanner" aria-hidden="true">
        <div className="eval-ai-loading-scanline" />
        <IconScan className="eval-ai-loading-icon" />
      </div>
      <div className="eval-ai-loading-body">
        <div className="eval-ai-loading-title">AI 수사반장 정밀 분석 중</div>
        <div className="eval-ai-loading-step">
          {AI_LOADING_STEPS[step]}
          <span className="eval-ai-loading-dots">
            <span /><span /><span />
          </span>
        </div>
        <div className="eval-ai-loading-bar" aria-hidden="true">
          <div className="eval-ai-loading-bar-fill" />
        </div>
      </div>
    </section>
  )
}

function AIEvaluation() {
  const location = useLocation()
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false)
      }
    }
    if (isModalOpen) {
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isModalOpen])

  // FinalReport에서 전달받은 데이터 (react-router state)
  const { caseId, selectedSuspect, reasoning } = location.state || {}
  const caseData = getCaseData(caseId || '001')

  // 플레이어 제출 데이터
  const playerReport = useMemo(
    () => ({
      caseId: caseId || '001',
      selectedSuspect: selectedSuspect || '',
      reasoning: reasoning || '',
    }),
    [caseId, selectedSuspect, reasoning]
  )

  // 1단계: 프로그램에서 채점 (점수/등급은 AI가 바꾸지 않음)
  const evaluation = useMemo(
    () =>
      evaluateReasoning(
        caseData,
        playerReport.selectedSuspect,
        playerReport.reasoning
      ),
    [caseData, playerReport]
  )

  const { grade } = evaluation
  const badgeImg = BADGE_IMAGES[grade.id] || BADGE_IMAGES.trainee

  // 2단계: AI(수사반장)의 정성적 심층 분석
  //  aiState: 'loading' | 'done' | 'error' | 'disabled'
  const [aiState, setAiState] = useState(() =>
    isAIConfigured() ? 'loading' : 'disabled'
  )
  const [aiResult, setAiResult] = useState(null)
  const [retryTick, setRetryTick] = useState(0)

  useEffect(() => {
    if (!isAIConfigured()) {
      setAiState('disabled')
      return
    }
    const controller = new AbortController()
    setAiState('loading')
    setAiResult(null)

    analyzeReasoning({
      caseData,
      playerReport,
      evaluation,
      signal: controller.signal,
    })
      .then((result) => {
        setAiResult(result)
        setAiState('done')
      })
      .catch((err) => {
        if (err?.name === 'AbortError') return
        // eslint-disable-next-line no-console
        console.error('[AI 심층 분석 실패]', err?.code || err?.message, err)
        setAiState('error')
      })

    return () => controller.abort()
  }, [caseData, playerReport, evaluation, retryTick])

  // AI 결과가 있으면 AI 피드백을, 없으면 결정론적 피드백으로 폴백
  const usingAI = aiState === 'done' && !!aiResult
  const feedback = usingAI
    ? aiResult
    : {
        goodPoints: evaluation.goodPoints,
        badPoints: evaluation.badPoints,
        detailedAnalysis: '',
        oneLine: evaluation.oneLine,
      }

  return (
    <div className="eval-wrapper">
      <div className="desk-pad">
        {/* 상단 헤더 */}
        <header className="eval-header">
          <div className="eval-header-left">
            <span className="eval-header-label">CASE FILE</span>
            <span className="eval-header-number">#{caseData.caseNumber}</span>
          </div>
          <Link to="/report" className="eval-header-back" state={{ caseId }}>
            <IconArrowLeft style={{ width: '0.9rem', height: '0.9rem' }} />
            뒤로
          </Link>
        </header>

        {/* 평가 문서 */}
        <article className="eval-document">
          {/* 문서 상단 */}
          <div className="eval-doc-top">
            <div className="eval-doc-title-block">
              <span className="eval-doc-title-label">EVALUATION REPORT</span>
              <h1 className="eval-doc-title">추리 평가 보고서</h1>
            </div>
            <span className="eval-doc-solved-stamp" aria-label="사건 해결 도장">
              CASE SOLVED
            </span>
          </div>

          {/* 1. 탐정 등급 배지 (핵심 피드백) */}
          <section className="eval-grade-card" aria-label="탐정 등급">
            <div
              className="eval-grade-badge-container eval-clickable"
              onClick={() => setIsModalOpen(true)}
              title="탐정 등급 안내 보기"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setIsModalOpen(true)
                }
              }}
            >
              <img src={badgeImg} alt={`${grade.name} 배지`} className="eval-badge-img" />
            </div>
            <div
              className="eval-grade-name eval-clickable"
              onClick={() => setIsModalOpen(true)}
              title="탐정 등급 안내 보기"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setIsModalOpen(true)
                }
              }}
            >
              {grade.name}
            </div>
            <div
              className="eval-grade-label-container eval-clickable"
              onClick={() => setIsModalOpen(true)}
              title="탐정 등급 안내 보기"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setIsModalOpen(true)
                }
              }}
            >
              <span className="eval-grade-label">탐정 등급</span>
              <span className="eval-grade-info-icon" aria-hidden="true">ⓘ</span>
            </div>
          </section>

          {/* 2. 플레이어 추리 요약 */}
          <section className="eval-section eval-player-section">
            <h2 className="eval-section-title">당신의 추리</h2>
            <div className="eval-player-row">
              <span className="eval-player-key">선택한 범인</span>
              <span className="eval-player-val">
                {playerReport.selectedSuspect || '미선택'}
              </span>
            </div>
            <div className="eval-player-row">
              <span className="eval-player-key">추리 내용</span>
            </div>
            <div className="eval-player-reasoning">
              {playerReport.reasoning || '작성된 추리 내용이 없습니다.'}
            </div>
          </section>

          {/* AI 분석 상태 배너 */}
          <div className={`eval-ai-banner eval-ai-banner-${aiState}`} role="status">
            <IconScan className="eval-ai-banner-icon" />
            {aiState === 'loading' && (
              <span className="eval-ai-banner-text">
                AI 수사반장이 당신의 추리서를 분석하고 있습니다
              </span>
            )}
            {aiState === 'done' && (
              <span className="eval-ai-banner-text">
                AI 수사반장 정밀 분석 완료
                <span className="eval-ai-banner-model">google · gemini-3.5-flash</span>
              </span>
            )}
            {aiState === 'error' && (
              <span className="eval-ai-banner-text">
                AI 연결이 원활하지 않아 기본 평가를 표시합니다.
                <button
                  type="button"
                  className="eval-ai-retry-btn"
                  onClick={() => setRetryTick((n) => n + 1)}
                >
                  다시 시도
                </button>
              </span>
            )}
            {aiState === 'disabled' && (
              <span className="eval-ai-banner-text">
                기본 평가 모드 · AI 심층 분석을 켜려면 API 키를 설정하세요
              </span>
            )}
          </div>

          {aiState === 'loading' ? (
            /* AI 분석 진행 중 — 피드백 영역을 로딩 패널로 대체 */
            <AILoadingPanel />
          ) : (
            <>
              {/* 3. 잘한 점 */}
              <section className="eval-section eval-good-section">
                <h2 className="eval-section-title">
                  <IconCheck className="eval-section-icon" style={{ color: '#4a7a2a' }} />
                  잘한 점
                </h2>
                <ul className="eval-good-list">
                  {feedback.goodPoints.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
              </section>

              {/* 4. 아쉬운 점 */}
              {feedback.badPoints.length > 0 && (
                <section className="eval-section eval-bad-section">
                  <h2 className="eval-section-title">
                    <IconDot className="eval-section-icon" style={{ color: 'var(--color-accent)' }} />
                    아쉬운 점
                  </h2>
                  <ul className="eval-bad-list">
                    {feedback.badPoints.map((point, idx) => (
                      <li key={idx}>{point}</li>
                    ))}
                  </ul>
                </section>
              )}

              {/* 5. 수사반장 심층 브리핑 (AI 전용) */}
              {usingAI && feedback.detailedAnalysis && (
                <section className="eval-section eval-brief-section">
                  <h2 className="eval-section-title">
                    <IconScan className="eval-section-icon" style={{ color: 'var(--color-gold)' }} />
                    수사반장 심층 브리핑
                  </h2>
                  <p className="eval-brief-text">{feedback.detailedAnalysis}</p>
                  <div className="eval-brief-sign">— 강력계 수사반장</div>
                </section>
              )}

              {/* 6. 종합 평가 (최종 결재) */}
              <section className="eval-section eval-summary-section">
                <h2 className="eval-section-title">종합 평가</h2>
                <p className="eval-summary-text">{feedback.oneLine}</p>
              </section>
            </>
          )}

          {/* 하단 버튼 */}
          <div className="eval-footer">
            <Link to="/explanation" state={{ caseId: caseId || '001' }} className="eval-btn-link">
              <button type="button" className="eval-btn-primary">사건 해설 보기</button>
            </Link>
            <Link
              to="/report"
              className="eval-btn-link"
              state={{ caseId }}
            >
              <button type="button" className="eval-btn-secondary">다시 추리하기</button>
            </Link>
          </div>
        </article>
      </div>

      {/* 탐정 등급 안내 모달 */}
      {isModalOpen && (
        <div className="eval-modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="eval-modal-content" onClick={(e) => e.stopPropagation()}>
            <header className="eval-modal-header">
              <h2>탐정 등급 안내</h2>
              <button
                type="button"
                className="eval-modal-close-btn"
                onClick={() => setIsModalOpen(false)}
                aria-label="닫기"
              >
                &times;
              </button>
            </header>
            <div className="eval-modal-body">
              <p className="eval-modal-desc">
                정답 범인을 맞췄는지 여부와 사건 단서(현장 증거, 동기, 범행 수법 등)의 추리 충실도를 종합 평가하여 단서 매칭 점수를 산출한 후, 아래와 같이 5개의 탐정 등급이 부여됩니다.
              </p>

              <div className="eval-grade-list">
                <div className="eval-grade-item">
                  <div className="eval-grade-item-left">
                    <img src={BADGE_IMAGES.legend} alt="전설의 탐정" className="eval-grade-item-img" />
                    <div>
                      <span className="eval-rank-badge rank-s">S</span>
                      <strong className="eval-rank-title">전설의 탐정</strong>
                    </div>
                  </div>
                  <p className="eval-grade-item-desc">
                    완벽하게 사건의 정황을 꿰뚫어 보고 모든 단서를 완벽하게 해석해 낸 불세출의 명탐정입니다. (85점 이상)
                  </p>
                </div>

                <div className="eval-grade-item">
                  <div className="eval-grade-item-left">
                    <img src={BADGE_IMAGES.master} alt="명탐정" className="eval-grade-item-img" />
                    <div>
                      <span className="eval-rank-badge rank-a">A</span>
                      <strong className="eval-rank-title">명탐정</strong>
                    </div>
                  </div>
                  <p className="eval-grade-item-desc">
                    사건의 인과관계를 조목조목 짚고 진범의 정체를 확실하게 밝혀낸 검증된 실력의 일류 탐정입니다. (65점 이상)
                  </p>
                </div>

                <div className="eval-grade-item">
                  <div className="eval-grade-item-left">
                    <img src={BADGE_IMAGES.veteran} alt="전문탐정" className="eval-grade-item-img" />
                    <div>
                      <span className="eval-rank-badge rank-b">B</span>
                      <strong className="eval-rank-title">전문탐정</strong>
                    </div>
                  </div>
                  <p className="eval-grade-item-desc">
                    현장에 남겨진 범죄의 주요 흐름을 파악하고 동기와 단서의 맥락을 올바르게 찾아낸 노련한 탐정입니다. (40점 이상)
                  </p>
                </div>

                <div className="eval-grade-item">
                  <div className="eval-grade-item-left">
                    <img src={BADGE_IMAGES.rookie} alt="초보탐정" className="eval-grade-item-img" />
                    <div>
                      <span className="eval-rank-badge rank-c">C</span>
                      <strong className="eval-rank-title">초보탐정</strong>
                    </div>
                  </div>
                  <p className="eval-grade-item-desc">
                    사건의 실마리를 포착하기 시작했으며, 점차 시야를 넓혀 추리력을 연마해가고 있는 유망한 탐정입니다. (20점 이상)
                  </p>
                </div>

                <div className="eval-grade-item">
                  <div className="eval-grade-item-left">
                    <img src={BADGE_IMAGES.trainee} alt="수습탐정" className="eval-grade-item-img" />
                    <div>
                      <span className="eval-rank-badge rank-d">D</span>
                      <strong className="eval-rank-title">수습탐정</strong>
                    </div>
                  </div>
                  <p className="eval-grade-item-desc">
                    사건 현장에서 수사를 공식적으로 시작하여, 단서 수집 능력을 키워나가고 있는 열정적인 수습 탐정입니다. (20점 미만)
                  </p>
                </div>
              </div>
            </div>
            <footer className="eval-modal-footer">
              <button
                type="button"
                className="eval-modal-confirm-btn"
                onClick={() => setIsModalOpen(false)}
              >
                닫기
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  )
}

export default AIEvaluation
