const apiBase = process.env.REACT_APP_API_URL;

export function fetchQuestions() {
  return fetch(`${apiBase}/api/questions`)
    .then(res => res.json());
}

export function fetchLeaderboard() {
  return fetch(`${apiBase}/api/leaderboard`)
    .then(res => res.json());
}