const API_URL = process.env.REACT_APP_API_URL;

export const nodes = fetch(`${API_URL}/nodes`).then((response) => {
  response.json();
});
