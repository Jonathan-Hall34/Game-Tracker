const API_URL = '/api/games';

document.addEventListener('DOMContentLoaded', () => {
  loadGames();

  document.getElementById('game-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const newGame = {
      title: document.getElementById('title').value,
      platform: document.getElementById('platform').value,
      genre: document.getElementById('genre').value,
      status: document.getElementById('status').value,
      rating: parseFloat(document.getElementById('rating').value) || null,
      notes: document.getElementById('notes').value
    };

    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newGame)
    });

    if (res.ok) {
      e.target.reset();
      loadGames();
    }
  });
});

async function loadGames() {
  const res = await fetch(API_URL);
  const games = await res.json();

  const tbody = document.getElementById('games-table-body');
  tbody.innerHTML = '';

  games.forEach(game => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${game.title}</td>
      <td>${game.platform}</td>
      <td>${game.status}</td>
      <td>${game.rating ?? '-'}</td>
      <td>
        <button class="btn btn-sm btn-danger" onclick="deleteGame('${game._id}')">Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

async function deleteGame(id) {
  if (confirm('Delete this game?')) {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (res.ok) {
      loadGames();
    }
  }
}
