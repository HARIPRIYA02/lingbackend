const apiBase = process.env.REACT_APP_API_URL;

export function fetchQuestions() {
  return fetch(`${apiBase}/questions`)
    .then(res => res.json());
}

export function fetchLeaderboard() {
  return fetch(`${apiBase}/leaderboard`)
    .then(res => res.json());
}