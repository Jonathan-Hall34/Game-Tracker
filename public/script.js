const API_URL = '/api/games';

// --- ADD / CREATE ---
async function defaultSubmitHandler(e) {
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
  } else {
    alert('Error adding game');
  }
}

// --- READ / LOAD ---
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
        <button class="btn btn-sm btn-info" onclick="showNotes('${game._id}')">Notes</button>
        <button class="btn btn-sm btn-warning" onclick="editGame('${game._id}')">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteGame('${game._id}')">Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

async function showNotes(id) {
  const res = await fetch(API_URL);
  const games = await res.json();
  const game = games.find(g => g._id === id);

  if (!game) return alert('Game not found.');

  const notesBody = document.getElementById('notesModalBody');
  notesBody.textContent = game.notes && game.notes.trim() !== ''
    ? game.notes
    : 'No notes available for this game.';

  const modalTitle = document.getElementById('notesModalLabel');
  modalTitle.textContent = `${game.title} — Notes`;

  const modal = new bootstrap.Modal(document.getElementById('notesModal'));
  modal.show();
}


// --- UPDATE ---
async function editGame(id) {
  const res = await fetch(API_URL);
  const games = await res.json();
  const game = games.find(g => g._id === id);
  if (!game) return alert('Game not found.');

  document.getElementById('title').value = game.title;
  document.getElementById('platform').value = game.platform || '';
  document.getElementById('genre').value = game.genre || '';
  document.getElementById('status').value = game.status || 'Backlog';
  document.getElementById('rating').value = game.rating || '';
  document.getElementById('notes').value = game.notes || '';

  const submitButton = document.querySelector('#game-form button[type="submit"]');
  submitButton.textContent = 'Update Game';
  submitButton.classList.remove('btn-primary');
  submitButton.classList.add('btn-warning');

  const form = document.getElementById('game-form');
  form.removeEventListener('submit', defaultSubmitHandler);
  form.onsubmit = async (e) => {
    e.preventDefault();
    const updatedGame = {
      title: document.getElementById('title').value,
      platform: document.getElementById('platform').value,
      genre: document.getElementById('genre').value,
      status: document.getElementById('status').value,
      rating: parseFloat(document.getElementById('rating').value) || null,
      notes: document.getElementById('notes').value
    };

    const updateRes = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedGame)
    });

    if (updateRes.ok) {
      alert('Game updated!');
      form.reset();
      submitButton.textContent = 'Add Game';
      submitButton.classList.remove('btn-warning');
      submitButton.classList.add('btn-primary');
      form.onsubmit = defaultSubmitHandler;
      loadGames();
    } else {
      alert('Error updating game');
    }
  };
}

// --- DELETE ---
async function deleteGame(id) {
  if (confirm('Delete this game?')) {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (res.ok) loadGames();
  }
}

// --- INITIALIZE ---
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('game-form');
  form.addEventListener('submit', defaultSubmitHandler);
  loadGames();
});
