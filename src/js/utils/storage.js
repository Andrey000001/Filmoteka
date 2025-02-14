export function saveToStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function getFromStorage(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}
