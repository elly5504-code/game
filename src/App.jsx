import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Main from './pages/Main'
import CaseSelect from './pages/CaseSelect'
import CaseBriefing from './pages/CaseBriefing'
import Investigation from './pages/Investigation'
import FinalReport from './pages/FinalReport'
import AIEvaluation from './pages/AIEvaluation'
import CaseExplanation from './pages/CaseExplanation'

function App() {
  return (
    <Routes>
      {/* 랜딩(홍보) 페이지가 메인 진입점 */}
      <Route path="/" element={<Landing />} />
      {/* 실제 게임 시작 화면 (기존 메인) */}
      <Route path="/start" element={<Main />} />
      <Route path="/select" element={<CaseSelect />} />
      <Route path="/briefing" element={<CaseBriefing />} />
      <Route path="/investigation" element={<Investigation />} />
      <Route path="/report" element={<FinalReport />} />
      <Route path="/evaluation" element={<AIEvaluation />} />
      <Route path="/explanation" element={<CaseExplanation />} />
    </Routes>
  )
}

export default App
