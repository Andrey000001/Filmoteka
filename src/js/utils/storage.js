export function saveToStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function getFromStorage(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}



//  QUERY
export function setCurrentQuert(query) {
  localStorage.setItem('currentQuery', query.trim().toLowerCase());
}

export function getCurrentQuery() {
  return localStorage.getItem('currentQuery') || '';
}
