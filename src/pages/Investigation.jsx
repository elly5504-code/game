import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import '../styles/page.css'
import '../styles/investigation.css'
import { useDetectiveMemo } from '../hooks/useDetectiveMemo'
import { getCaseData } from '../data/cases.js'

/* ===== 인라인 SVG 아이콘 (이모지 미사용) ===== */

const IconClip = (props) => (
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
    <path d="M13.234 20.661c-.264.264-.552.52-.78.705a1 1 0 0 1-1.085.049 10.5 10.5 0 1 1 5.522-9.332a1 1 0 0 1-.384.782l-.594.593a1 1 0 0 1-1.414 0L13 12.586V7a1 1 0 0 1 2 0v3.586l1.293-1.293a1 1 0 0 1 1.414 0l.594.593a1 1 0 0 1 .384.782 10.5 10.5 0 0 1-5.521 9.332" />
  </svg>
)

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

const IconFile = (props) => (
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
  </svg>
)

const IconPhoto = (props) => (
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
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="9" cy="9" r="2" />
    <path d="M21 15l-5-5L5 21" />
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

function Investigation() {
  const location = useLocation()
  const navigate = useNavigate()
  const [evidencePage, setEvidencePage] = useState(1)

  // CaseBriefing에서 전달받은 caseId
  const caseId = location.state?.caseId || '001'
  const caseData = getCaseData(caseId)

  const [activeTab, setActiveTab] = useState('overview')
  const [memoOpen, setMemoOpen] = useState(false)
  const [memoText, setMemoText] = useDetectiveMemo()
  const [checkedEvidence, setCheckedEvidence] = useState({})
  const [selectedEvidence, setSelectedEvidence] = useState(null)
  const [selectedStatementName, setSelectedStatementName] = useState('')
  const [unlockNotice, setUnlockNotice] = useState(null)
  const [showsGuide, setShowsGuide] = useState(true)

  // 증거 데이터에 id 부여 (체크 추적용)
  const evidences = (caseData.evidence || []).map((ev, idx) => ({
    id: `evidence-${idx}`,
    ...ev,
  }))

  const itemsPerPage = 8
  const isCase2 = false
  const totalPages = isCase2 ? Math.ceil(evidences.length / itemsPerPage) : 1
  const displayedEvidences = isCase2 
    ? evidences.slice((evidencePage - 1) * itemsPerPage, evidencePage * itemsPerPage)
    : evidences

  // 용의자 데이터에 id 부여
  const suspects = (caseData.suspects || []).map((s, idx) => ({
    id: `suspect-${idx}`,
    ...s,
  }))

  // 확인한 증거 개수
  const checkedCount = Object.values(checkedEvidence).filter(Boolean).length
  const totalEvidence = evidences.length

  const handleEvidenceClick = (evidence) => {
    setSelectedStatementName('')
    // 잠긴 증거 처리
    if (evidence.locked) {
      const threshold = evidence.unlockThreshold || 0
      if (checkedCount < threshold) {
        setSelectedEvidence({
          ...evidence,
          isLocked: true,
          title: evidence.title,
          description: evidence.unlockHint || '증거를 조금 더 조사해보세요.',
        })
        return
      }
    }

    // 새로 확인하는 증거인 경우
    const isNewCheck = !checkedEvidence[evidence.id]

    setSelectedEvidence(evidence)

    if (isNewCheck) {
      const newCheckedCount = checkedCount + 1

      setCheckedEvidence((prev) => ({ ...prev, [evidence.id]: true }))

      // 이번 확인으로 잠긴 증거가 해금되는지 확인
      const unlockedEvidence = evidences.find(
        (ev) =>
          ev.locked &&
          ev.id !== evidence.id &&
          !checkedEvidence[ev.id] &&
          newCheckedCount >= (ev.unlockThreshold || 0) &&
          checkedCount < (ev.unlockThreshold || 0)
      )

      if (unlockedEvidence) {
        setTimeout(() => {
          setUnlockNotice(`새로운 증거 해금 - ${unlockedEvidence.title}`)
          setTimeout(() => setUnlockNotice(null), 3500)
        }, 500)
      }
    }
  }

  // 사건 현장 이미지 (기존 데이터 사용)
  const sceneImage = caseData.overviewImage || caseData.evidence?.[0]?.image || ''

  // 피해자 정보 파싱
  const victimRaw = caseData.briefing.victim || ''
  const victimName = victimRaw.split('(')[0].trim()
  const isStatementSummary =
    caseData.id === 'case002' && selectedEvidence?.title === '용의자 진술 요약'
  const suspectStatements = isStatementSummary
    ? selectedEvidence.description.map((description) => {
        const [, name = '', statement = description] =
          description.match(/^(.+?)\s*-\s*(.+)$/) || []
        const suspect = suspects.find((item) => item.name === name.trim())
        return {
          name: name.trim(),
          job: suspect?.job || '',
          statement: statement.trim(),
        }
      })
    : []
  const selectedStatement = suspectStatements.find(
    (item) => item.name === selectedStatementName,
  )

  return (
    <div className="inv-wrapper">
      {showsGuide && (
        <div className="guide-modal-overlay" onClick={() => setShowsGuide(false)}>
          <div className="guide-modal-content" onClick={(e) => e.stopPropagation()}>
            {/* 메탈 장식 느낌 클립 */}
            <span className="ds-metal-clip" aria-hidden="true" style={{ top: '-4px', left: '50%', transform: 'translateX(-50%)' }}></span>
            
            <header className="guide-modal-header">
              <h2>🕵️‍♂️ 사건 조사 지침 안내</h2>
            </header>
            
            <div className="guide-modal-body">
              <p className="guide-intro">원활한 수사 진행을 위해 다음 수사 요령을 숙지한 뒤 보드를 검토하십시오.</p>
              
              <div className="guide-steps">
                <div className="guide-step">
                  <div className="guide-step-num">1</div>
                  <div className="guide-step-text">
                    <strong>세 가지 수사 영역 확인</strong>
                    <p>본문 상단의 <strong>사건개요</strong>, <strong>용의자</strong>, <strong>증거</strong> 세 개의 탭 필드를 모두 클릭하여 꼼꼼하게 단서들을 확인하고 교차 검증해 보세요.</p>
                  </div>
                </div>
                
                <div className="guide-step">
                  <div className="guide-step-num">2</div>
                  <div className="guide-step-text">
                    <strong>탐정 메모장 활용</strong>
                    <p>조사 도중 발견한 모순점이나 획득한 단서는 우상단의 <strong>'탐정 메모'</strong> 버튼을 클릭하여 언제든지 기록을 축적하고 논리 추리에 사용해 보세요.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="guide-modal-footer">
              <button 
                type="button" 
                className="guide-close-btn" 
                onClick={() => setShowsGuide(false)}
              >
                지침 숙지 (수사 시작)
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="desk-pad">
        {/* 상단 헤더 */}
        <header className="inv-header">
          <div className="inv-header-left">
            <span className="inv-header-label">CASE FILE</span>
            <span className="inv-header-number">#{caseData.caseNumber}</span>
          </div>
          <div className="inv-header-right">
            <span className="inv-evidence-count" aria-live="polite">
              <IconClip className="inv-evidence-count-icon" />
              증거 확인 {checkedCount} / {totalEvidence}
            </span>
            <button
              type="button"
              className="memo-btn"
              onClick={() => setShowsGuide(true)}
              style={{ marginRight: '0.4rem' }}
              aria-label="수사 지침 가이드 보기"
            >
              수사 지침
            </button>
            <button
              type="button"
              className="memo-btn memo-btn-highlight"
              onClick={() => setMemoOpen(!memoOpen)}
              aria-label="탐정 메모 열기"
              aria-expanded={memoOpen}
            >
              <IconNote className="memo-btn-icon" />
              탐정 메모
            </button>
          </div>
        </header>

        {/* 탭 네비게이션 */}
        <nav className="inv-tabs" role="tablist" aria-label="수사 탭">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'overview'}
            className={`inv-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            사건 개요
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'suspects'}
            className={`inv-tab ${activeTab === 'suspects' ? 'active' : ''}`}
            onClick={() => setActiveTab('suspects')}
          >
            용의자
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'evidence'}
            className={`inv-tab ${activeTab === 'evidence' ? 'active' : ''}`}
            onClick={() => setActiveTab('evidence')}
          >
            증거
          </button>
        </nav>

        {/* 탭 내용 */}
        <div className="inv-content">
          {activeTab === 'overview' && (
            <div className="inv-panel" role="tabpanel" aria-label="사건 개요">
              <div className="overview-layout">
                {/* 왼쪽: 사건 현장 사진 (폴라로이드) */}
                <div className="case-photo-panel">
                  <figure className="case-photo">
                    <div className="photo-area">
                      {sceneImage ? (
                        <img src={sceneImage} alt="사건 현장 사진" />
                      ) : (
                        <span className="case-photo-placeholder">
                          <IconPhoto style={{ width: '1.5rem', height: '1.5rem' }} />
                          현장 사진
                        </span>
                      )}
                    </div>
                    <figcaption className="case-photo-caption">SCENE PHOTO</figcaption>
                  </figure>
                </div>

                {/* 오른쪽: 사건 정보 */}
                <div className="case-info-panel">
                  <dl className="case-info-list">
                    <div className="case-info-row">
                      <dt className="case-info-key">발생 시간</dt>
                      <dd className="case-info-val">{caseData.briefing.date || '미정'}</dd>
                    </div>
                    <div className="case-info-row">
                      <dt className="case-info-key">사건 장소</dt>
                      <dd className="case-info-val">{caseData.briefing.location || '미정'}</dd>
                    </div>
                    <div className="case-info-row">
                      <dt className="case-info-key">피해자</dt>
                      <dd className="case-info-val">{victimName || '미정'}</dd>
                    </div>
                  </dl>

                  <div className="case-overview-text">
                    <h3>사건 개요</h3>
                    <p>{caseData.briefing.summary}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'suspects' && (
            <div className="inv-panel" role="tabpanel" aria-label="용의자 목록">
              <div className="suspect-list">
                {suspects.map((suspect, idx) => (
                  <article className="suspect-profile" key={suspect.id}>
                    <div className="suspect-top">
                      <div className="suspect-silhouette">
                        {suspect.image ? (
                          <img src={suspect.image} alt={suspect.name} />
                        ) : (
                          <IconUser className="silhouette-icon" />
                        )}
                      </div>
                      <div className="suspect-info">
                        <div className="suspect-info-header">
                          <h3 className="suspect-name">{suspect.name}</h3>
                          <span className="suspect-no">No. {idx + 1}</span>
                        </div>
                        <div className="suspect-meta">
                          <span className="suspect-meta-item">나이: {suspect.age || '-'}</span>
                          <span className="suspect-meta-item">직업: {suspect.job || '-'}</span>
                          <span className="suspect-meta-item">{suspect.gender || ''}</span>
                        </div>
                      </div>
                    </div>
                    <div className="suspect-traits-label">특징</div>
                    <ul className="suspect-desc-list">
                      {Array.isArray(suspect.description)
                        ? suspect.description.map((desc, i) => (
                            <li key={i}>{desc}</li>
                          ))
                        : <li>{suspect.description}</li>}
                    </ul>
                  </article>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'evidence' && (
            <div className="inv-panel" role="tabpanel" aria-label="증거 목록">
              <div className="evidence-grid">
                {displayedEvidences.map((ev) => {
                  const isLocked =
                    ev.locked && checkedCount < (ev.unlockThreshold || 0)
                  const isChecked = checkedEvidence[ev.id]
                  return (
                    <button
                      type="button"
                      className={`evidence-card ${isChecked ? 'checked' : ''} ${isLocked ? 'locked' : ''}`}
                      key={ev.id}
                      onClick={() => handleEvidenceClick(ev)}
                      aria-label={`${isLocked ? '잠긴 증거' : isChecked ? '확인 완료된 증거' : '새 증거'}: ${ev.title}`}
                    >
                      <span className="evidence-card-img" aria-hidden="true">
                        {ev.image ? (
                          <img src={ev.image} alt={ev.title} />
                        ) : (
                          <span className="evidence-card-img-placeholder">
                            {isLocked ? (
                              <IconLock style={{ width: '1.8rem', height: '1.8rem' }} />
                            ) : isChecked ? (
                              <IconCheck style={{ width: '1.8rem', height: '1.8rem' }} />
                            ) : (
                              <IconPhoto style={{ width: '1.8rem', height: '1.8rem' }} />
                            )}
                          </span>
                        )}
                        {isLocked ? (
                          <span className="evidence-card-badge locked" aria-hidden="true">잠김</span>
                        ) : isChecked ? (
                          <span className="evidence-card-badge checked" aria-hidden="true">확인</span>
                        ) : (
                          <span className="evidence-card-badge new" aria-hidden="true">NEW</span>
                        )}
                      </span>
                      <span className="evidence-card-name">
                        {ev.title}
                      </span>
                    </button>
                  )
                })}
              </div>

              {isCase2 && totalPages > 1 && (
                <div className="evidence-pagination">
                  <button
                    type="button"
                    className="pager-btn prev-btn"
                    disabled={evidencePage === 1}
                    onClick={() => setEvidencePage((p) => Math.max(p - 1, 1))}
                    aria-label="이전 증거 페이지"
                  >
                    이전
                  </button>
                  <span className="pager-info">
                    {evidencePage} / {totalPages}
                  </span>
                  <button
                    type="button"
                    className="pager-btn next-btn"
                    disabled={evidencePage === totalPages}
                    onClick={() => setEvidencePage((p) => Math.min(p + 1, totalPages))}
                    aria-label="다음 증거 페이지"
                  >
                    다음
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 증거 상세 모달 */}
        {selectedEvidence && (
          <div
            className="evidence-detail-overlay"
            onClick={() => setSelectedEvidence(null)}
            role="dialog"
            aria-modal="true"
            aria-label={`${selectedEvidence.title} 상세 정보`}
          >
            <div
              className={`evidence-detail ${selectedEvidence.isLocked ? 'locked-detail' : ''}`}
              onClick={(e) => e.stopPropagation()}
            >
              {selectedEvidence.isLocked && (
                <span className="evidence-locked-stamp" aria-hidden="true">
                  LOCKED
                </span>
              )}
              {!isStatementSummary && (
                <div className="evidence-detail-img">
                  {selectedEvidence.image ? (
                    <img src={selectedEvidence.image} alt={selectedEvidence.title} />
                  ) : (
                    <span className="evidence-detail-img-placeholder">
                      <IconFile className="evidence-detail-img-placeholder-icon" />
                      증거 이미지 없음
                    </span>
                  )}
                </div>
              )}
              <h3>{selectedEvidence.title}</h3>
              {isStatementSummary ? (
                <div className="suspect-statements">
                  <p className="suspect-statements-guide">
                    인물을 선택해 진술 내용을 확인하세요.
                  </p>
                  <div className="suspect-statement-grid">
                    {suspectStatements.map((item) => (
                      <button
                        type="button"
                        key={item.name}
                        className={`suspect-statement-card ${
                          selectedStatementName === item.name ? 'active' : ''
                        }`}
                        onClick={() => setSelectedStatementName(item.name)}
                        aria-pressed={selectedStatementName === item.name}
                      >
                        <strong>{item.name}</strong>
                        <span>{item.job}</span>
                      </button>
                    ))}
                  </div>
                  <div className="suspect-statement-content" aria-live="polite">
                    {selectedStatement ? (
                      <>
                        <strong>{selectedStatement.name}의 진술</strong>
                        <p>{selectedStatement.statement}</p>
                      </>
                    ) : (
                      <p className="suspect-statement-empty">
                        위 용의자 중 한 명을 클릭하세요.
                      </p>
                    )}
                  </div>
                </div>
              ) : Array.isArray(selectedEvidence.description) ? (
                <ul className="evidence-detail-list">
                  {selectedEvidence.description.map((desc, i) => (
                    <li key={i}>{desc}</li>
                  ))}
                </ul>
              ) : (
                <p>{selectedEvidence.description}</p>
              )}
              <button
                type="button"
                className="evidence-detail-close"
                onClick={() => setSelectedEvidence(null)}
              >
                닫기
              </button>
            </div>
          </div>
        )}

        {/* 하단 버튼 */}
        <div className="inv-footer">
          <button
            type="button"
            className="inv-final-btn"
            onClick={() => navigate('/report', { state: { caseId } })}
          >
            최종 추리 시작
          </button>
          <div className="inv-back">
            <Link to="/briefing">
              <IconArrowLeft style={{ width: '0.9rem', height: '0.9rem' }} />
              뒤로
            </Link>
          </div>
        </div>

        {/* 증거 해금 알림 */}
        {unlockNotice && (
          <div className="unlock-notice" role="status" aria-live="polite">
            {unlockNotice}
          </div>
        )}

        {/* 탐정 메모 드로어 */}
        <aside
          className={`memo-drawer ${memoOpen ? '' : 'closed'}`}
          aria-label="탐정 메모"
          aria-hidden={!memoOpen}
        >
          <div className="memo-drawer-header">
            <h2>
              <IconNote className="memo-drawer-header-icon" />
              탐정 메모
            </h2>
            <button
              type="button"
              className="memo-close-btn"
              onClick={() => setMemoOpen(false)}
              aria-label="탐정 메모 닫기"
            >
              <IconClose style={{ width: '100%', height: '100%' }} />
            </button>
          </div>
          <textarea
            value={memoText}
            onChange={(e) => setMemoText(e.target.value)}
            placeholder={'수사 중 발견한 단서를 기록하세요...\n탐정 메모는 최종 추리에서도 확인 가능합니다...'}
            aria-label="탐정 메모 입력"
          />
        </aside>
      </div>
    </div>
  )
}

export default Investigation
