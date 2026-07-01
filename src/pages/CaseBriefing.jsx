import { useLocation, useNavigate } from 'react-router-dom'
import '../styles/page.css'
import '../styles/briefing.css'
import { getCaseData } from '../data/cases.js'

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

function CaseBriefing() {
  const location = useLocation()
  const navigate = useNavigate()

  // CaseSelect에서 전달받은 caseId
  const caseId = location.state?.caseId || '001'
  const caseData = getCaseData(caseId)

  const handleStart = () => {
    navigate('/investigation', { state: { caseId } })
  }

  // 사건 현장 이미지 (현재는 기존 데이터 사용)
  const sceneImage = caseData.overviewImage || caseData.evidence?.[0]?.image || ''

  // 피해자 정보 파싱: "김채영 (IT 기업 대표, 여성 · 42세)"
  const victimRaw = caseData.briefing.victim || ''
  const victimName = victimRaw.split('(')[0].trim()
  const victimDetail = victimRaw.match(/\(([^)]+)\)/)?.[1] || ''
  // victimDetail: "IT 기업 대표, 여성 · 42세"
  const victimParts = victimDetail.split(',').map((s) => s.trim())
  const victimJob = victimParts[0] || ''
  const victimGenderAge = victimParts[1] || ''

  // 조사 목표 (있는 경우)
  const objectives = caseData.briefing.objectives || []

  return (
    <div className="brief-wrapper">
      <div className="desk-pad">
        {/* 상단 헤더 */}
        <header className="brief-header">
          <div className="brief-header-top">
            <div className="brief-header-title">
              <div className="brief-header-label">
                CASE FILE {caseData.caseNumber}
              </div>
              <span className="brief-header-confidential" aria-label="기밀 사건">
                CONFIDENTIAL
              </span>
            </div>
            <button
              type="button"
              onClick={() => navigate('/select')}
              className="brief-header-back"
              aria-label="사건 선택으로 돌아가기"
            >
              <IconArrowLeft style={{ width: '1rem', height: '1rem' }} />
              뒤로
            </button>
          </div>
        </header>

        {/* 사건 기록철: 여러 장의 문서가 겹친 구조 */}
        <div className="brief-record-stack">
          {/* 뒤쪽 배경 문서 (장식) */}
          <div className="brief-bg-doc" aria-hidden="true" />

          {/* 메인 수사 보고서 */}
          <article className="brief-file">
            {/* 장식 요소: 접근성 처리 */}
            <span className="ds-metal-clip" aria-hidden="true" />
            <span className="ds-coffee-stain deco-coffee" aria-hidden="true" />
            <span className="ds-tape-strip deco-tape-1" aria-hidden="true" />
            <span className="ds-tape-strip deco-tape-2 angle-right" aria-hidden="true" />

            {/* 파일 상단: CASE 번호 + CONFIDENTIAL 도장 */}
            <div className="brief-file-top">
              <div className="brief-file-case-block">
                <span className="brief-file-case-label">CASE NO.</span>
                <h1 className="brief-file-case-title">{caseData.title}</h1>
              </div>
              <span className="brief-file-stamp" aria-label="기밀 도장">
                CONFIDENTIAL
              </span>
            </div>

            {/* 본문: 폴라로이드 + 정보 테이블 */}
            <div className="brief-body">
              {/* 폴라로이드 증거 사진 */}
              <figure className="brief-polaroid">
                <div className="photo-area">
                  {sceneImage ? (
                    <img src={sceneImage} alt="사건 현장 증거 사진" />
                  ) : (
                    <span className="photo-placeholder">
                      <IconPhoto style={{ width: '1.5rem', height: '1.5rem', marginBottom: '0.4rem' }} />
                      현장 사진
                    </span>
                  )}
                </div>
                <figcaption className="photo-caption">
                  SCENE PHOTO · EVIDENCE 01
                </figcaption>
              </figure>

              {/* 사건 정보 테이블 */}
              <dl className="brief-info-table">
                <div className="brief-info-item">
                  <dt className="brief-info-key">피해자</dt>
                  <dd className="brief-info-val">{victimName || '미정'}</dd>
                </div>
                <div className="brief-info-item">
                  <dt className="brief-info-key">직업</dt>
                  <dd className="brief-info-val">{victimJob || '미정'}</dd>
                </div>
                <div className="brief-info-item">
                  <dt className="brief-info-key">성별 · 나이</dt>
                  <dd className="brief-info-val">{victimGenderAge || '미정'}</dd>
                </div>
                <div className="brief-info-item">
                  <dt className="brief-info-key">발생 시간</dt>
                  <dd className="brief-info-val">{caseData.briefing.date || '미정'}</dd>
                </div>
                <div className="brief-info-item">
                  <dt className="brief-info-key">사건 장소</dt>
                  <dd className="brief-info-val">{caseData.briefing.location || '미정'}</dd>
                </div>
                <div className="brief-info-item">
                  <dt className="brief-info-key">난이도</dt>
                  <dd className="brief-info-val">{caseData.difficulty || '미정'}</dd>
                </div>
              </dl>
            </div>

            {/* 사건 개요 */}
            <section className="brief-summary-section">
              <h2 className="brief-summary-title">사건 개요</h2>
              <p className="brief-summary-text">{caseData.briefing.summary}</p>
            </section>

            {/* 조사 목표 (있는 경우) */}
            {objectives.length > 0 && (
              <section className="brief-objectives">
                <h2 className="brief-objectives-title">조사 목표</h2>
                <ul className="brief-objectives-list">
                  {objectives.map((obj, i) => (
                    <li key={i}>{obj}</li>
                  ))}
                </ul>
              </section>
            )}

            {/* 조사 시작 버튼 */}
            <div className="brief-footer">
              <button
                type="button"
                className="brief-start-btn"
                onClick={handleStart}
                aria-label="조사 시작"
              >
                조사 시작
              </button>
            </div>
          </article>
        </div>
      </div>
    </div>
  )
}

export default CaseBriefing