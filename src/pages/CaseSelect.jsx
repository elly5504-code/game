import { Link, useNavigate } from 'react-router-dom'
import '../styles/page.css'
import '../styles/caseselect.css'
import { getCaseList } from '../data/cases.js'

const cases = getCaseList()

/* ===== 인라인 SVG 아이콘 (이모지 미사용) ===== */

const IconClock = (props) => (
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
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
)

const IconUser = (props) => (
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
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
  </svg>
)

const IconLock = (props) => (
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
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </svg>
)

const IconFolder = (props) => (
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
    <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
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

function CaseSelect() {
  const navigate = useNavigate()

  const handlePlay = (caseId) => {
    // 선택한 사건 번호를 state를 통해 전달
    navigate('/briefing', { state: { caseId } })
  }

  return (
    <div className="select-wrapper">
      <div className="desk-pad">
        {/* 상단 헤더 */}
        <header className="select-header">
          <div className="select-header-title">
            <h1>CASE FILES</h1>
            <span className="select-header-sub">미해결 사건 목록</span>
          </div>
          <Link
            to="/start"
            state={{ skipIntro: true }}
            className="select-header-back"
            aria-label="메인으로 돌아가기"
          >
            <IconArrowLeft style={{ width: '1rem', height: '1rem' }} />
            뒤로
          </Link>
        </header>

        <p className="select-guide">
          <IconFolder className="select-guide-icon" />
          <span>담당할 사건을 선택하세요.</span>
        </p>

        {/* 사건 목록 - 책상 위에 겹쳐 놓은 사건 파일철 */}
        <div className="select-list" role="list">
          {cases.map((caseItem) => (
            <article
              key={caseItem.id}
              role="listitem"
              className={`case-file ${!caseItem.available ? 'disabled' : ''}`}
              data-tab={caseItem.available ? caseItem.number : 'LOCKED'}
              aria-label={`${caseItem.number} ${caseItem.title}${caseItem.available ? '' : ' (잠긴 사건)'}`}
            >
              {/* 장식 요소: 접근성 처리 */}
              <span className="deco-clip" aria-hidden="true" />

              {caseItem.available ? (
                <div className="case-file-body">
                  <div className="case-file-header">
                    <span className="case-file-number">{caseItem.number}</span>
                    <span className="case-file-difficulty">
                      난이도 {caseItem.difficulty}
                    </span>
                  </div>

                  <h2 className="case-file-title">{caseItem.title}</h2>

                  <div className="case-file-meta">
                    <div className="case-file-meta-row">
                      <IconClock className="case-file-meta-icon" />
                      <span>예상 시간 : {caseItem.playTime}</span>
                    </div>
                    <div className="case-file-meta-row">
                      <IconUser className="case-file-meta-icon" />
                      <span>피해자 : {caseItem.victim || '미정'}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="case-file-btn"
                    onClick={() => handlePlay(caseItem.id)}
                    aria-label={`${caseItem.title} 조사 시작`}
                  >
                    조사 시작
                  </button>
                </div>
              ) : (
                <div className="case-file-locked">
                  <IconLock className="case-file-locked-icon" />
                  <div className="case-file-locked-title">
                    {caseItem.number}
                  </div>
                  <div className="case-file-locked-status">COMING SOON</div>
                  <div className="case-file-locked-desc">
                    새로운 사건 준비 중
                  </div>
                </div>
              )}
            </article>
          ))}
          <div className="select-memos-decor" aria-hidden="true">
            <div className="select-memo memo-1">
              <span className="ds-pushpin" style={{ top: '-10px', left: '50%', transform: 'translateX(-50%)' }}></span>
              <p className="memo-text">• 모든 선입견을 배제할 것.</p>
              <p className="memo-text">• 현장 단서를 교차 확인해라.</p>
            </div>
            <div className="select-memo memo-2">
              <span className="ds-tape-strip" style={{ top: '-10px', left: '25px', width: '60px', height: '18px', opacity: 0.8 }}></span>
              <p className="memo-text">"사소한 의문점 하나가 사건 해결의 열쇠가 된다."</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CaseSelect
