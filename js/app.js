const API_URL = 'https://ghibliapi.vercel.app/films';

const statusEl = document.getElementById('status');
const listEl = document.getElementById('film-list');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const clearButton = document.getElementById('clear-button');

let allFilms = [];

function setStatus(message) {
  statusEl.textContent = message;
}

function valueOrDefault(value, fallback = 'Não informado') {
  return value === undefined || value === null || String(value).trim() === ''
    ? fallback
    : value;
}

async function loadFilms() {
  setStatus('Carregando filmes...');
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`Erro HTTP ${response.status}`);
    }
    allFilms = await response.json();
    renderFilms(allFilms);
  } catch (error) {
    console.error(error);
    listEl.innerHTML = '';
    setStatus('Não foi possível carregar os filmes. Verifique sua conexão e tente novamente.');
  }
}

function createFilmCard(film) {
  const li = document.createElement('li');
  li.className = 'film-card';

  const img = document.createElement('img');
  img.alt = `Pôster do filme ${film.title}`;
  img.loading = 'lazy';
  img.src = film.image || '';
  img.addEventListener('error', () => img.replaceWith(createImagePlaceholder()));
  if (!film.image) img.replaceWith(createImagePlaceholder());

  const title = document.createElement('h3');
  title.textContent = valueOrDefault(film.title);

  const info = document.createElement('p');
  info.textContent = `${valueOrDefault(film.release_date, 'Ano não informado')} · ${valueOrDefault(film.director)}`;

  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = 'Ver detalhes';
  button.dataset.id = film.id;

  li.append(img, title, info, button);
  return li;
}

function createImagePlaceholder() {
  const div = document.createElement('div');
  div.className = 'image-placeholder';
  div.textContent = 'Imagem indisponível';
  return div;
}

function renderFilms(films) {
  listEl.innerHTML = '';
  if (films.length === 0) {
    setStatus('Nenhum filme encontrado.');
    return;
  }
  setStatus(`${films.length} filme(s) exibido(s).`);
  films.forEach(film => listEl.appendChild(createFilmCard(film)));
}


function normalizeText(text) {
  return String(text)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function searchFilms() {
  const term = normalizeText(searchInput.value.trim());

  if (term === '') {
    renderFilms(allFilms);
    return;
  }

  const results = allFilms.filter(film =>
    normalizeText(film.title).includes(term)
  );

  if (results.length === 0) {
    listEl.innerHTML = '';
    setStatus(`Nenhum filme encontrado para "${searchInput.value.trim()}".`);
    return;
  }

  renderFilms(results);
  setStatus(`${results.length} filme(s) encontrado(s) para "${searchInput.value.trim()}".`);
}

searchForm.addEventListener('submit', event => {
  event.preventDefault();   
  searchFilms();
});

clearButton.addEventListener('click', () => {
  searchInput.value = '';
  renderFilms(allFilms);
  searchInput.focus();
});


loadFilms();