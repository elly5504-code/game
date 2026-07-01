import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import '../styles/page.css'
import '../styles/finalreport.css'
import { useDetectiveMemo } from '../hooks/useDetectiveMemo'
import { getCaseData } from '../data/cases.js'

/* ===== 인라인 SVG 아이콘 (이모지 미사용) ===== */

const IconNote = (props) => (
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
    <path d="M14 3v4a1 1 0 0 0 1 1h4" />
    <path d="M5 3h9l5 5v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
    <path d="M9 13h6M9 17h4" />
  </svg>
)

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

const IconClose = (props) => (
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
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
)

function FinalReport() {
  const location = useLocation()
  const navigate = useNavigate()

  // Investigation에서 전달받은 caseId
  const caseId = location.state?.caseId || '001'
  const caseData = getCaseData(caseId)

  const suspects = caseData.suspects || []

  const [selectedSuspect, setSelectedSuspect] = useState('')
  const [reasoning, setReasoning] = useState('')
  const [memoOpen, setMemoOpen] = useState(false)
  const [memoText, setMemoText] = useDetectiveMemo()

  const handleSubmit = () => {
    // AIEvaluation으로 데이터 전달 (react-router state)
    navigate('/evaluation', {
      state: {
        caseId,
        selectedSuspect,
        reasoning,
      },
    })
  }

  return (
    <div className="report-wrapper">
      <div className="desk-pad">
        {/* 상단 헤더 */}
        <header className="report-header">
          <div className="report-header-left">
            <span className="report-header-label">CASE FILE</span>
            <span className="report-header-number">#{caseData.caseNumber}</span>
          </div>
          <div className="report-header-right">
            <button
              type="button"
              className="report-memo-btn"
              onClick={() => setMemoOpen(!memoOpen)}
              aria-label="탐정 메모 열기"
              aria-expanded={memoOpen}
            >
              <IconNote className="report-memo-btn-icon" />
              탐정 메모
            </button>
            <Link to="/investigation" className="report-header-back">
              <IconArrowLeft style={{ width: '0.9rem', height: '0.9rem' }} />
              뒤로
            </Link>
          </div>
        </header>

        {/* 보고서 문서 */}
        <article className="report-document">
          {/* 문서 상단 */}
          <div className="report-doc-top">
            <div className="report-doc-title-block">
              <span className="report-doc-title-label">FINAL REPORT</span>
              <h1 className="report-doc-title">최종 추리서</h1>
            </div>
            <span className="report-doc-confidential" aria-label="기밀 도장">
              CONFIDENTIAL
            </span>
          </div>

          {/* ① 범인 선택 */}
          <section className="report-section">
            <label className="report-section-label" htmlFor="report-suspect-select">
              ① 범인 선택
            </label>
            <select
              id="report-suspect-select"
              className="report-select"
              value={selectedSuspect}
              onChange={(e) => setSelectedSuspect(e.target.value)}
            >
              <option value="">-- 용의자를 선택하세요 --</option>
              {suspects.map((suspect) => (
                <option key={suspect.name} value={suspect.name}>
                  {suspect.name}{suspect.job ? ` — ${suspect.job}` : ''}
                </option>
              ))}
            </select>
          </section>

          {/* ② 추리 내용 작성 */}
          <section className="report-section">
            <label className="report-section-label" htmlFor="report-reasoning-textarea">
              ② 추리 내용 작성
            </label>
            <textarea
              id="report-reasoning-textarea"
              className="report-textarea"
              value={reasoning}
              onChange={(e) => setReasoning(e.target.value)}
              placeholder="왜 이 사람이 범인이라고 생각하는지 작성해주세요."
            />
            <div className="report-guide">
              <div className="report-guide-title">작성 시 참고하세요</div>
              <ul className="report-guide-list">
                <li>범행 동기</li>
                <li>결정적 증거</li>
                <li>범행 시간</li>
                <li>추리 과정</li>
              </ul>
            </div>
          </section>

          {/* 제출 전 검토 요약 */}
          {selectedSuspect && (
            <section className="report-section" aria-live="polite">
              <div className="report-guide">
                <div className="report-guide-title">제출 전 확인</div>
                <ul className="report-guide-list">
                  <li>선택한 범인: {selectedSuspect}</li>
                  <li>추리 분량: {reasoning.trim().length}자</li>
                </ul>
              </div>
            </section>
          )}

          {/* 하단 제출 버튼 */}
          <div className="report-footer">
            <button
              type="button"
              className="report-submit-btn"
              onClick={handleSubmit}
              aria-label="추리서 제출"
            >
              추리서 제출
            </button>
          </div>
        </article>

        {/* 탐정 메모 드로어 */}
        <aside
          className={`report-memo-drawer ${memoOpen ? '' : 'closed'}`}
          aria-label="탐정 메모"
          aria-hidden={!memoOpen}
        >
          <div className="report-memo-drawer-header">
            <h2>
              <IconNote className="report-memo-drawer-header-icon" />
              탐정 메모
            </h2>
            <button
              type="button"
              className="report-memo-close-btn"
              onClick={() => setMemoOpen(false)}
              aria-label="탐정 메모 닫기"
            >
              <IconClose style={{ width: '100%', height: '100%' }} />
            </button>
          </div>
          <textarea
            value={memoText}
            onChange={(e) => setMemoText(e.target.value)}
            placeholder="수사 중 발견한 단서를 기록하세요..."
            aria-label="탐정 메모 입력"
          />
        </aside>
      </div>
    </div>
  )
}

export default FinalReport
