import { useState, useEffect } from 'react'

/**
 * 탐정 메모 공유 hook
 * sessionStorage를 사용하여 Investigation 화면과 FinalReport 화면에서
 * 동일한 메모 내용을 유지합니다.
 * 현재 플레이 세션에서만 유지되며, 탭 종료/새로고침 후 새 게임 시작 시 초기화됩니다.
 */
const STORAGE_KEY = 'caseFile_detectiveMemo'

export function clearDetectiveMemo() {
  try {
    sessionStorage.removeItem(STORAGE_KEY)
  } catch (e) {
    // sessionStorage 접근 실패 시 무시
  }
}

export function useDetectiveMemo() {
  const [memoText, setMemoText] = useState(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY) || ''
    } catch (e) {
      return ''
    }
  })

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, memoText)
    } catch (e) {
      // sessionStorage 접근 실패 시 무시
    }
  }, [memoText])

  return [memoText, setMemoText]
}