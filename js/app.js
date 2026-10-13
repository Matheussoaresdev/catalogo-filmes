const API_URL = 'https://ghibliapi.vercel.app/films';

const sortSelect = document.getElementById('sort-select');
const statusEl = document.getElementById('status');
const listEl = document.getElementById('film-list');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const clearButton = document.getElementById('clear-button');
const dialogEl = document.getElementById('film-dialog');
const detailsEl = document.getElementById('film-details');
const closeDialogButton = document.getElementById('close-dialog');

let allFilms = [];

function setStatus(message) {
  statusEl.textContent = message;
}


function valueOrDefault(value, fallback = 'Não informado') {
  const text = String(value ?? '').trim();
  const invalid = ['', 'undefined', 'null', 'nan'];
  return invalid.includes(text.toLowerCase()) ? fallback : text;
}
      



async function loadFilms() {
  setStatus('Carregando filmes...');
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`Erro HTTP ${response.status}`);
    }
    allFilms = await response.json();
    updateList();
  } catch (error) {
    console.error(error);
    listEl.innerHTML = '';
    setStatus('Não foi possível carregar os filmes. Verifique sua conexão e tente novamente.');
  }
}

function createFilmCard(film) {
  const li = document.createElement('li');
  li.className = 'film-card';

  let media;
  if (film.image) {
    media = document.createElement('img');
    media.src = film.image;
    media.alt = `Pôster do filme ${valueOrDefault(film.title, 'sem título')}`;
    media.loading = 'lazy';
    media.addEventListener('error', () => media.replaceWith(createImagePlaceholder()));
  } else {
    media = createImagePlaceholder();
  }

  const title = document.createElement('h3');
  title.textContent = valueOrDefault(film.title, 'Título não informado');

  const info = document.createElement('p');
  info.textContent = `${valueOrDefault(film.release_date, 'Ano não informado')} · ${valueOrDefault(film.director, 'Diretor não informado')}`;

  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = 'Ver detalhes';
  button.dataset.id = film.id;

  li.append(media, title, info, button);
  return li;
}

function createImagePlaceholder() {
  const div = document.createElement('div');
  div.className = 'image-placeholder';
  div.textContent = 'Imagem indisponível';
  return div;
}

function formatRuntime(value) {
  const minutes = Number(value);
  if (!value || Number.isNaN(minutes) || minutes <= 0) {
    return 'Não informada';
  }
  return `${minutes} minutos`;
}

function formatScore(value) {
  const score = Number(value);
  if (!value || Number.isNaN(score)) {
    return 'Não disponível';
  }
  return `${score} / 100`;
}

function sortFilms(films, criterion) {
  const sorted = [...films];

  switch (criterion) {
   
    case 'title-asc':
        sorted.sort((a, b) => (a.title || '').localeCompare(b.title || '', 'pt-BR'));
        break;
    case 'title-desc':
        sorted.sort((a, b) => (b.title || '').localeCompare(a.title || '', 'pt-BR'));
        break;
    case 'year-asc':
        sorted.sort((a, b) => Number(a.release_date) - Number(b.release_date));
        break;
    case 'year-desc':
        sorted.sort((a, b) => Number(b.release_date) - Number(a.release_date));
        break;
    case 'score-desc':
        sorted.sort((a, b) => Number(b.rt_score) - Number(a.rt_score));
        break;
  }
  return sorted;
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

function updateList() {
  const rawTerm = searchInput.value.trim();
  const term = normalizeText(rawTerm);

  let films = allFilms;
  if (term !== '') {
    films = allFilms.filter(film => normalizeText(film.title || '').includes(term));
  }

  films = sortFilms(films, sortSelect.value);

  if (films.length === 0) {
    listEl.innerHTML = '';
    setStatus(`Nenhum filme encontrado para "${rawTerm}".`);
    return;
  }

  renderFilms(films);
  if (term !== '') {
    setStatus(`${films.length} filme(s) encontrado(s) para "${rawTerm}".`);
  }
}

searchForm.addEventListener('submit', event => {
  event.preventDefault();
  updateList();
});

sortSelect.addEventListener('change', updateList);

clearButton.addEventListener('click', () => {
  searchInput.value = '';
  updateList();
  searchInput.focus();
});

function createDetailRow(label, value) {
  const wrapper = document.createElement('div');
  const dt = document.createElement('dt');
  const dd = document.createElement('dd');
  dt.textContent = label;
  dd.textContent = value;
  wrapper.append(dt, dd);
  return wrapper;
}

function showDetails(film) {
  detailsEl.innerHTML = '';


  const title = document.createElement('h2');
  title.id = 'dialog-title';
  title.textContent = valueOrDefault(film.title);
  detailsEl.appendChild(title);


  if (film.original_title && film.original_title !== film.title) {
    const original = document.createElement('p');
    original.className = 'original-title';
    original.textContent = film.original_title;
    detailsEl.appendChild(original);
  }

  if (film.image) {
    const img = document.createElement('img');
    img.src = film.image;
    img.alt = `Pôster do filme ${valueOrDefault(film.title, 'sem título')}`;
    img.className = 'details-image';
    img.addEventListener('error', () => img.replaceWith(createImagePlaceholder()));
    detailsEl.appendChild(img);
  } else {
    detailsEl.appendChild(createImagePlaceholder());
  }


  const description = document.createElement('p');
  description.className = 'description';
  description.textContent = valueOrDefault(film.description, 'Descrição não disponível.');
  detailsEl.appendChild(description);


  const list = document.createElement('dl');
  list.append(
    createDetailRow('Diretor', valueOrDefault(film.director)),
    createDetailRow('Produtor', valueOrDefault(film.producer)),
    createDetailRow('Ano de lançamento', valueOrDefault(film.release_date)),
    createDetailRow('Duração', formatRuntime(film.running_time)),
    createDetailRow('Avaliação', formatScore(film.rt_score))
  );
  detailsEl.appendChild(list);

  dialogEl.showModal();
}

listEl.addEventListener('click', event => {
  const button = event.target.closest('button[data-id]');
  if (!button) return;

  const film = allFilms.find(item => item.id === button.dataset.id);
  if (film) showDetails(film);
});

closeDialogButton.addEventListener('click', () => dialogEl.close());

loadFilms();