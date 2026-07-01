import { useLocation, useNavigate } from 'react-router-dom'
import '../styles/page.css'
import '../styles/caseexplanation.css'
import { getCaseData } from '../data/cases.js'
import { clearDetectiveMemo } from '../hooks/useDetectiveMemo'

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

function CaseExplanation() {
  const location = useLocation()
  const navigate = useNavigate()

  // 전달받은 caseId
  const caseId = location.state?.caseId || '001'
  const caseData = getCaseData(caseId)
  const solution = caseData.solution || {}

  return (
    <div className="expl-wrapper">
      <div className="desk-pad">
        {/* 상단 헤더 */}
        <header className="expl-header">
          <div className="expl-header-left">
            <span className="expl-header-label">CASE FILE</span>
            <span className="expl-header-number">#{caseData.caseNumber}</span>
          </div>
          <button
            type="button"
            className="expl-header-back"
            onClick={() => navigate('/evaluation', { state: { caseId } })}
            aria-label="평가 화면으로 돌아가기"
          >
            <IconArrowLeft style={{ width: '0.9rem', height: '0.9rem' }} />
            뒤로
          </button>
        </header>

        {/* 해설 문서 */}
        <article className="expl-document">
          {/* 문서 상단 */}
          <div className="expl-doc-top">
            <div className="expl-doc-title-block">
              <span className="expl-doc-title-label">CASE EXPLANATION</span>
              <h1 className="expl-doc-title">사건 해설</h1>
            </div>
            <span className="expl-doc-solved-stamp" aria-label="사건 해결 도장">
              CASE SOLVED
            </span>
          </div>

          {/* 1. 사건 해결 결과 (범인) - 강조 */}
          <section className="expl-culprit-card" aria-label="범인">
            <div className="expl-culprit-label">범인</div>
            <div className="expl-culprit-name">{solution.culprit || '-'}</div>
            <div className="expl-culprit-case">{caseData.title}</div>
          </section>

          {/* 2. 사건 타임라인 */}
          <section className="expl-section">
            <h2 className="expl-section-title">사건 타임라인</h2>
            <div className="expl-timeline">
              {(solution.timeline || []).map((step, idx) => (
                <div className="expl-timeline-item" key={idx}>
                  <div className="expl-timeline-dot" aria-hidden="true" />
                  <div className="expl-timeline-content">{step}</div>
                  {idx < (solution.timeline || []).length - 1 && (
                    <div className="expl-timeline-line" aria-hidden="true" />
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* 3. 범행 동기 */}
          <section className="expl-section">
            <h2 className="expl-section-title">범행 동기</h2>
            <p className="expl-section-text">{solution.motive || '-'}</p>
          </section>

          {/* 4. 범행 방법 */}
          <section className="expl-section">
            <h2 className="expl-section-title">범행 방법</h2>
            <p className="expl-section-text">{solution.method || '-'}</p>
          </section>

          {/* 5. 사건의 진실 (최종 결재 문서) */}
          <section className="expl-section expl-truth-section">
            <h2 className="expl-section-title">사건의 진실</h2>
            <p className="expl-truth-text">{solution.explanation || '-'}</p>
          </section>

          {/* 하단 버튼 */}
          <div className="expl-footer">
            <button
              type="button"
              className="expl-home-btn"
              onClick={() => {
                clearDetectiveMemo()
              navigate('/select')
              }}
              aria-label="처음으로 돌아가기"
            >
              처음으로
            </button>
          </div>
        </article>
      </div>
    </div>
  )
}

export default CaseExplanation
