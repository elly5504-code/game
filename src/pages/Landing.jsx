import { Link } from 'react-router-dom'
import '../styles/page.css'
import '../styles/landing.css'
import case001 from '../data/case001.js'
import { getCaseList } from '../data/cases.js'
import magnifier from '../assets/magnifying-glass.png'
import badgeS from '../assets/badges/badge_S.png'
import badgeA from '../assets/badges/badge_A.png'
import badgeB from '../assets/badges/badge_B.png'
import badgeC from '../assets/badges/badge_C.png'
import badgeD from '../assets/badges/badge_D.png'

/* ===== 인라인 SVG 아이콘 ===== */
const Icon = ({ path, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" {...props}>
    {path}
  </svg>
)

const IconFolder = (p) => <Icon {...p} path={<><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></>} />
const IconSearch = (p) => <Icon {...p} path={<><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></>} />
const IconNote = (p) => <Icon {...p} path={<><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M5 3h9l5 5v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" /><path d="M9 13h6M9 17h4" /></>} />
const IconDoc = (p) => <Icon {...p} path={<><path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" /><path d="M14 3v5h5M9 13h6M9 17h6" /></>} />
const IconScan = (p) => <Icon {...p} path={<><path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2" /><path d="M12 7a5 5 0 0 0-5 5M12 7a5 5 0 0 1 5 5M9.5 12a2.5 2.5 0 0 1 5 0v2M12 14v2" /></>} />
const IconBadge = (p) => <Icon {...p} path={<><circle cx="12" cy="9" r="5" /><path d="M9 13.5L8 21l4-2 4 2-1-7.5" /></>} />
const IconChevron = (p) => <Icon {...p} path={<><path d="M6 9l6 6 6-6" /></>} />
const IconUsers = (p) => <Icon {...p} path={<><circle cx="9" cy="8" r="3.5" /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" /><path d="M16 5.5a3.5 3.5 0 0 1 0 6.9M21 20c0-2.6-1.6-4.8-4-5.6" /></>} />
const IconClock = (p) => <Icon {...p} path={<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>} />
const IconLock = (p) => <Icon {...p} path={<><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></>} />

/* ===== 수사 흐름 데이터 ===== */
const FLOW_STEPS = [
  { n: '01', title: '사건 선택', desc: '미해결 사건 파일을 열고 담당 수사를 배정받습니다.', Icon: IconFolder },
  { n: '02', title: '현장 조사', desc: '현장 사진·CCTV·통화기록·목격자 진술을 직접 수집합니다.', Icon: IconSearch },
  { n: '03', title: '단서 분석', desc: '탐정 메모에 단서를 기록하며 알리바이와 동기를 추적합니다.', Icon: IconNote },
  { n: '04', title: '최종 추리서', desc: '용의자를 지목하고 당신만의 논리로 사건을 재구성합니다.', Icon: IconDoc },
  { n: '05', title: 'AI 심층 평가', desc: 'AI 수사반장이 당신의 추리서를 읽고 전문적으로 분석합니다.', Icon: IconScan, highlight: true },
  { n: '06', title: '해설 & 등급', desc: '사건의 진실이 공개되고, 당신의 탐정 등급이 부여됩니다.', Icon: IconBadge },
]

/* ===== 탐정 등급 데이터 ===== */
const RANKS = [
  { img: badgeS, rank: 'S', name: '전설의 탐정', desc: '모든 단서를 완벽히 꿰뚫은 불세출의 명탐정' },
  { img: badgeA, rank: 'A', name: '명탐정', desc: '진범과 인과관계를 확실히 밝혀낸 일류 탐정' },
  { img: badgeB, rank: 'B', name: '전문탐정', desc: '범죄의 주요 흐름과 동기를 짚어낸 노련한 탐정' },
  { img: badgeC, rank: 'C', name: '초보탐정', desc: '실마리를 포착하며 추리력을 연마하는 유망주' },
  { img: badgeD, rank: 'D', name: '수습탐정', desc: '단서 수집 능력을 키워가는 열정의 수습' },
]

/* 증거 쇼케이스용 큐레이션 (case001 자산 재사용) */
const EVIDENCE_SHOWCASE = [
  case001.evidence[0], // 사건 현장 사진
  case001.evidence[1], // CCTV
  case001.evidence[3], // 피해자 휴대폰
  case001.evidence[7], // 금고
  case001.evidence[6], // 명패
  case001.evidence[4], // 목격자 진술
].filter(Boolean)

function Landing() {
  const cases = getCaseList()

  return (
    <div className="lp-root">
      {/* ===== 상단 고정 바 ===== */}
      <header className="lp-topbar">
        <div className="lp-topbar-inner">
          <div className="lp-brand">
            <span className="lp-brand-mark">M/F</span>
            <span className="lp-brand-name">MYSTERY FILE</span>
          </div>
          <Link to="/start" className="lp-topbar-cta">수사 시작</Link>
        </div>
      </header>

      {/* ===== 히어로 ===== */}
      <section className="lp-hero">
        <div className="lp-hero-bg" aria-hidden="true">
          <span className="ds-red-thread lp-thread lp-thread-1" />
          <span className="ds-red-thread lp-thread lp-thread-2" />
        </div>

        <div className="lp-hero-inner">
          {/* 좌: 카피 */}
          <div className="lp-hero-copy">
            <div className="lp-hero-stamp">CONFIDENTIAL</div>
            <div className="lp-hero-eyebrow">AI DETECTIVE GAME · CASE FILE</div>
            <h1 className="lp-hero-title">MYSTERY<br />FILE</h1>
            <p className="lp-hero-tagline">
              흩어진 단서를 잇고, 진범을 지목하라.<br />
              그리고 <strong>AI 수사반장</strong>에게 당신의 추리를 심판받아라.
            </p>
            <div className="lp-hero-actions">
              <Link to="/start" className="lp-btn lp-btn-primary" aria-label="수사 시작하기 — 메인으로 이동">
                <span>수사 시작하기</span>
                <IconChevron className="lp-btn-arrow" style={{ width: '1.1rem', height: '1.1rem', transform: 'rotate(-90deg)' }} />
              </Link>
              <a href="#how" className="lp-btn lp-btn-ghost">플레이 방법 보기</a>
            </div>
            <div className="lp-hero-meta">
              <span><IconUsers style={{ width: '0.95rem', height: '0.95rem' }} /> 혼자 또는 함께</span>
              <span className="lp-hero-meta-dot" />
              <span><IconClock style={{ width: '0.95rem', height: '0.95rem' }} /> 한 사건 약 10분</span>
              <span className="lp-hero-meta-dot" />
              <span><IconScan style={{ width: '0.95rem', height: '0.95rem' }} /> 실시간 AI 분석</span>
            </div>
          </div>

          {/* 우: 증거 콜라주 */}
          <div className="lp-hero-visual" aria-hidden="true">
            <figure className="lp-hero-photo lp-hero-photo-1">
              <img src={case001.suspects[1].image} alt="" loading="eager" />
              <figcaption>SUSPECT</figcaption>
            </figure>
            <figure className="lp-hero-photo lp-hero-photo-2">
              <img src={case001.evidence[1].image} alt="" loading="eager" />
              <figcaption>CCTV · 19:45</figcaption>
            </figure>
            <figure className="lp-hero-photo lp-hero-photo-3">
              <img src={case001.evidence[0].image} alt="" loading="eager" />
              <figcaption>SCENE 01</figcaption>
            </figure>
            <img src={magnifier} alt="" className="lp-hero-magnifier" />
            <span className="ds-pushpin lp-pin lp-pin-1" />
            <span className="ds-pushpin dark lp-pin lp-pin-2" />
          </div>
        </div>

        <a href="#pitch" className="lp-scroll-hint" aria-label="아래로 스크롤">
          <span>SCROLL</span>
          <IconChevron style={{ width: '1.2rem', height: '1.2rem' }} />
        </a>
      </section>

      {/* ===== 피치 ===== */}
      <section className="lp-section lp-pitch" id="pitch">
        <div className="lp-pitch-inner">
          <span className="lp-kicker">CASE BRIEFING</span>
          <h2 className="lp-pitch-title">
            읽는 추리가 아니라, <span className="lp-hl">직접 푸는</span> 추리.
          </h2>
          <p className="lp-pitch-text">
            MYSTERY FILE은 실제 사건 파일을 수사하듯 진행하는 몰입형 추리 게임입니다.
            현장 사진, CCTV 타임라인, 통화 기록, 목격자 진술까지 — 흩어진 단서를 교차
            검증해 진범을 좁혀 나가세요. 당신이 작성한 최종 추리서는
            <strong> 실제 LLM AI 수사반장</strong>이 한 문장 한 문장 읽고 전문적으로 평가합니다.
          </p>
          <div className="lp-stats">
            <div className="lp-stat"><span className="lp-stat-num">8+</span><span className="lp-stat-label">현장 증거</span></div>
            <div className="lp-stat"><span className="lp-stat-num">4</span><span className="lp-stat-label">용의자</span></div>
            <div className="lp-stat"><span className="lp-stat-num">S~D</span><span className="lp-stat-label">탐정 등급</span></div>
            <div className="lp-stat"><span className="lp-stat-num">AI</span><span className="lp-stat-label">심층 평가</span></div>
          </div>
        </div>
      </section>

      {/* ===== 수사 흐름 ===== */}
      <section className="lp-section lp-flow" id="how">
        <div className="lp-section-head">
          <span className="lp-kicker">HOW IT WORKS</span>
          <h2 className="lp-section-title">사건 해결까지, 6단계 수사 흐름</h2>
          <p className="lp-section-sub">한 편의 형사물처럼 이어지는 수사의 흐름을 따라가 보세요.</p>
        </div>
        <ol className="lp-flow-grid">
          {FLOW_STEPS.map((s) => (
            <li key={s.n} className={`lp-flow-step ${s.highlight ? 'is-highlight' : ''}`}>
              <div className="lp-flow-num">{s.n}</div>
              <div className="lp-flow-icon"><s.Icon style={{ width: '1.6rem', height: '1.6rem' }} /></div>
              <h3 className="lp-flow-step-title">
                {s.title}
                {s.highlight && <span className="lp-flow-tag">NEW</span>}
              </h3>
              <p className="lp-flow-step-desc">{s.desc}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ===== 증거 쇼케이스 (코르크 보드) ===== */}
      <section className="lp-section lp-evidence">
        <div className="lp-section-head">
          <span className="lp-kicker">EVIDENCE BOARD</span>
          <h2 className="lp-section-title">진짜 증거로 추리한다</h2>
          <p className="lp-section-sub">현장에서 수집한 물증 하나하나가 진실로 향하는 열쇠입니다.</p>
        </div>
        <div className="cork-board lp-cork">
          <div className="lp-evidence-grid">
            {EVIDENCE_SHOWCASE.map((ev, i) => (
              <figure key={ev.title} className={`lp-polaroid lp-polaroid-r${i % 3}`}>
                <span className={`ds-pushpin ${i % 2 ? 'dark' : ''} lp-polaroid-pin`} />
                <div className="lp-polaroid-photo">
                  <img src={ev.image} alt={ev.title} loading="lazy" />
                </div>
                <figcaption className="lp-polaroid-cap">{ev.title}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 용의자 라인업 ===== */}
      <section className="lp-section lp-suspects">
        <div className="lp-section-head">
          <span className="lp-kicker">SUSPECT LINE-UP</span>
          <h2 className="lp-section-title">이 중 한 명이, 범인입니다</h2>
          <p className="lp-section-sub">저마다의 알리바이와 감춰진 동기. 거짓을 꿰뚫는 건 당신의 몫입니다.</p>
        </div>
        <div className="lp-suspect-grid">
          {case001.suspects.map((s) => (
            <article key={s.name} className="lp-mugshot">
              <div className="lp-mugshot-photo">
                <img src={s.image} alt={`용의자 ${s.name}`} loading="lazy" />
                <span className="lp-mugshot-scale" aria-hidden="true" />
              </div>
              <div className="lp-mugshot-plate">
                <span className="lp-mugshot-name">{s.name}</span>
                <span className="lp-mugshot-job">{s.job}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ===== AI 스포트라이트 ===== */}
      <section className="lp-section lp-ai">
        <div className="lp-ai-inner">
          <div className="lp-ai-copy">
            <span className="lp-kicker lp-kicker-gold">POWERED BY AI</span>
            <h2 className="lp-section-title lp-ai-title">
              AI 수사반장이<br />당신의 추리를 심판한다
            </h2>
            <p className="lp-ai-text">
              더 이상 정답만 맞히는 추리가 아닙니다. 30년 경력의 AI 수사반장이 당신이 쓴
              추리서를 직접 읽고, <strong>무엇을 꿰뚫어 봤는지</strong>와
              <strong> 무엇을 놓쳤는지</strong>를 사건 맥락에 맞춰 심층 브리핑합니다.
            </p>
            <ul className="lp-ai-features">
              <li><IconScan style={{ width: '1.1rem', height: '1.1rem' }} /> 추리서 원문 기반 개인화 피드백</li>
              <li><IconNote style={{ width: '1.1rem', height: '1.1rem' }} /> 잘한 점 · 아쉬운 점 · 심층 총평</li>
              <li><IconBadge style={{ width: '1.1rem', height: '1.1rem' }} /> 실력에 맞춘 S~D 탐정 등급</li>
            </ul>
            <div className="lp-ai-badge-line">
              <span className="lp-ai-chip">OpenRouter</span>
              <span className="lp-ai-chip lp-ai-chip-accent">google · gemini-3.5-flash</span>
            </div>
          </div>

          {/* 미니 평가 카드 목업 */}
          <div className="lp-ai-card" aria-hidden="true">
            <div className="lp-ai-card-top">
              <span className="lp-ai-card-label">EVALUATION REPORT</span>
              <span className="lp-ai-card-stamp">CASE SOLVED</span>
            </div>
            <div className="lp-ai-card-grade">
              <img src={badgeA} alt="" className="lp-ai-card-badge" />
              <div>
                <div className="lp-ai-card-grade-name">명탐정</div>
                <div className="lp-ai-card-grade-label">탐정 등급 · A</div>
              </div>
            </div>
            <div className="lp-ai-card-line">
              <span className="lp-ai-card-check">✓</span>
              <p>CCTV 시간과 계약서 봉투를 정확히 연결해 범인을 지목했습니다.</p>
            </div>
            <div className="lp-ai-card-line">
              <span className="lp-ai-card-dot">•</span>
              <p>범행 동기의 인과관계를 조금만 더 짚었다면 완벽했습니다.</p>
            </div>
            <div className="lp-ai-card-brief">
              “현장 감식과 알리바이를 영리하게 엮어낸 훌륭한 수사 보고서입니다…”
              <span className="lp-ai-card-sign">— 강력계 수사반장</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 탐정 등급 ===== */}
      <section className="lp-section lp-ranks">
        <div className="lp-section-head">
          <span className="lp-kicker">DETECTIVE RANKS</span>
          <h2 className="lp-section-title">당신의 등급은 어디까지 오를까</h2>
          <p className="lp-section-sub">추리의 완성도에 따라 5개의 탐정 등급이 부여됩니다.</p>
        </div>
        <div className="lp-rank-grid">
          {RANKS.map((r) => (
            <div key={r.rank} className={`lp-rank-card rank-tone-${r.rank.toLowerCase()}`}>
              <img src={r.img} alt={`${r.name} 배지`} className="lp-rank-badge" loading="lazy" />
              <div className="lp-rank-rank">{r.rank}</div>
              <div className="lp-rank-name">{r.name}</div>
              <p className="lp-rank-desc">{r.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== 수록 사건 ===== */}
      <section className="lp-section lp-cases">
        <div className="lp-section-head">
          <span className="lp-kicker">CASE FILES</span>
          <h2 className="lp-section-title">지금 수사할 수 있는 사건들</h2>
        </div>
        <div className="lp-case-strip">
          {cases.map((c) => (
            <article key={c.id} className={`lp-case-tab ${c.available ? '' : 'is-locked'}`}>
              <div className="lp-case-tab-top">
                <span className="lp-case-num">{c.number}</span>
                {c.available
                  ? <span className="lp-case-diff">{c.difficulty}</span>
                  : <IconLock style={{ width: '1rem', height: '1rem' }} />}
              </div>
              <h3 className="lp-case-title">{c.available ? c.title : '기밀 해제 예정'}</h3>
              <p className="lp-case-desc">
                {c.available ? c.description : '새로운 사건 파일을 준비 중입니다.'}
              </p>
              <div className="lp-case-foot">
                {c.available
                  ? <span><IconClock style={{ width: '0.85rem', height: '0.85rem' }} /> {c.playTime}</span>
                  : <span className="lp-case-soon">COMING SOON</span>}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ===== 최종 CTA ===== */}
      <section className="lp-section lp-final">
        <div className="lp-final-card">
          <div className="lp-final-stamp">TOP SECRET</div>
          <h2 className="lp-final-title">사건 파일이 당신을 기다립니다</h2>
          <p className="lp-final-sub">진실은 언제나 단서 속에 있습니다. 지금, 첫 사건을 열어보세요.</p>
          <Link to="/start" className="lp-btn lp-btn-primary lp-btn-lg" aria-label="수사 시작하기 — 메인으로 이동">
            <span>수사 시작하기</span>
            <IconChevron className="lp-btn-arrow" style={{ width: '1.2rem', height: '1.2rem', transform: 'rotate(-90deg)' }} />
          </Link>
        </div>
      </section>

      {/* ===== 푸터 ===== */}
      <footer className="lp-footer">
        <div className="lp-footer-brand">MYSTERY FILE</div>
        <div className="lp-footer-sub">AI DETECTIVE GAME · 혼자 또는 함께 추리하는 사건 추리 게임</div>
        <div className="lp-footer-fine">AI 심층 평가 · OpenRouter · google/gemini-3.5-flash</div>
      </footer>
    </div>
  )
}

export default Landing
