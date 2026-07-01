import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import '../styles/main.css'
import { clearDetectiveMemo } from '../hooks/useDetectiveMemo'

const introLines = [
  'Loading Case Files',
  'Accessing Investigation Database',
  'Preparing Investigation',
]

function Main() {
  const location = useLocation()
  // 게임 내에서 '뒤로'로 돌아온 경우(skipIntro)엔 인트로 연출을 건너뛴다.
  const skipIntro = !!location.state?.skipIntro
  const [phase, setPhase] = useState(skipIntro ? 'main' : 'intro') // intro -> logo -> main
  const [currentLine, setCurrentLine] = useState(0)

  // Main 화면 진입 시 탐정 메모 초기화 (새 게임 시작 / 처음으로 돌아올 때)
  useEffect(() => {
    clearDetectiveMemo()
  }, [])

  // 인트로 로딩 라인 전환
  useEffect(() => {
    if (phase !== 'intro') return

    if (currentLine >= introLines.length) {
      // 모든 라인 완료 → logo 단계로
      const timer = setTimeout(() => setPhase('logo'), 500)
      return () => clearTimeout(timer)
    }

    // 각 라인을 1.4초간 표시
    const timer = setTimeout(() => {
      setCurrentLine((prev) => prev + 1)
    }, 1400)

    return () => clearTimeout(timer)
  }, [phase, currentLine])

  // logo → main 전환
  useEffect(() => {
    if (phase === 'logo') {
      const timer = setTimeout(() => setPhase('main'), 2400)
      return () => clearTimeout(timer)
    }
  }, [phase])

  return (
    <>
      {/* 인트로 로딩 화면 */}
      {phase === 'intro' && (
        <div className="intro-screen">
          <div className="intro-loading-box">
            <div className="intro-loading-label">CONFIDENTIAL</div>
            <span className="intro-text">
              {currentLine < introLines.length
                ? introLines[currentLine]
                : introLines[introLines.length - 1]}
              <span className="intro-dots">
                <span className="intro-dot" />
                <span className="intro-dot" />
                <span className="intro-dot" />
              </span>
            </span>
          </div>
        </div>
      )}

      {/* 로고 화면 */}
      {phase === 'logo' && (
        <div className="intro-screen">
          <div className="logo-screen">
            <h1 className="logo-title">MYSTERY FILE</h1>
            <p className="logo-subtitle">AI DETECTIVE GAME</p>
            <div className="logo-divider" />
            <div className="logo-confidential">TOP SECRET</div>
          </div>
        </div>
      )}

      {/* 메인 화면 */}
      {phase === 'main' && (
        <div className="main-screen">
          <div className="main-content">
            <div className="ds-metal-clip"></div>
            <div className="ds-coffee-stain deco-coffee"></div>
            <div className="ds-tape-strip deco-tape"></div>
            <div className="ds-grease-stain" style={{ bottom: '40px', left: '30px' }}></div>
            <div className="main-label">TOP SECRET</div>
            <h1 className="main-title">MYSTERY FILE</h1>
            <p className="main-tagline">
              당신은 사건의 진실을 밝혀낼 준비가 되었습니까?
            </p>
            <Link to="/select">
              <button className="main-start-btn">수사 시작</button>
            </Link>
            <p className="main-footer">
              혼자 플레이 또는 함께 추리할 수 있는 사건 추리 게임
            </p>
          </div>
        </div>
      )}
    </>
  )
}

export default Main