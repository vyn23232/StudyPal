const HISTORY_KEY = 'studypal_history'
const MAX_HISTORY = 50

function getHistory() {
  try {
    const data = localStorage.getItem(HISTORY_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function addToHistory(entry) {
  const history = getHistory()
  const item = {
    id: Date.now(),
    ...entry,
    created_at: new Date().toISOString()
  }
  history.unshift(item)
  if (history.length > MAX_HISTORY) {
    history.length = MAX_HISTORY
  }
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
  return item
}

function clearHistory() {
  localStorage.removeItem(HISTORY_KEY)
}

export { getHistory, addToHistory, clearHistory }
