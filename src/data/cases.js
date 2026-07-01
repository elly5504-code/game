// 사건 데이터 중앙 인덱스
// 모든 페이지는 이 파일을 import하여 caseId로 사건 데이터를 가져옵니다.

import case001 from './case001.js'
import case002 from './case002.js'
import case003 from './case003.js'

const cases = {
  '001': case001,
  '002': case002,
  '003': case003,
}

// 사건 메타데이터 (CaseSelect 화면용)
const caseList = [
    {
      id: '001',
      number: 'CASE 001',
      title: case001.title,
      difficulty: case001.difficulty,
      playTime: case001.playTime,
      victim: case001.briefing.victim.split('(')[0].trim(),
      description: case001.briefing.summary,
      available: true,
    },
    {
      id: '002',
      number: 'CASE 002',
      title: case002.title,
      difficulty: case002.difficulty,
      playTime: case002.playTime,
      victim: case002.briefing.victim.split('(')[0].trim(),
      description: case002.briefing.summary || '준비 중인 사건입니다.',
      available: true,
    },
    {
      id: '003',
      number: 'CASE 003',
      title: case003.title,
      difficulty: case003.difficulty,
      playTime: case003.playTime,
      victim: '',
      description: case003.briefing.summary || '준비 중인 사건입니다.',
      available: false,
    },
]

// caseId로 사건 데이터 가져오기
export const getCaseData = (caseId) => cases[caseId] || cases['001']

// 사건 목록 가져오기
export const getCaseList = () => caseList

export default cases