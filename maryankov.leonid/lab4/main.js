import {Game} from './model.js';

const STORAGE_KEY = 'games';
const DELAY = 300;

const list = document.querySelector('[data-testid="entity-list"]');
const form = document.querySelector('form[data-testid="entity-form"]');

const gameByCard = new WeakMap();
let games = loadGames();

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function loadGames() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!Array.isArray(data)) {
      return [];
    }
    return data.map(
      (item) => new Game(item.title, item.platforms || [], item.releaseYear),
    );
  } catch {
    return [];
  }
}

function saveGames() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
}

async function addGame(title, releaseYear) {
  await delay(DELAY);
  games.push(new Game(title, [], releaseYear));
  update();
}

async function removeGame(game) {
  await delay(DELAY);
  games = games.filter((item) => item !== game);
  update();
}

async function addPlatform(game, platform) {
  await delay(DELAY);
  game.addPlatform(platform);
  update();
}

async function removePlatform(game, platform) {
  await delay(DELAY);
  game.removePlatform(platform);
  update();
}

function update() {
  saveGames();
  render();
}

function createButton(text, testId, className = 'button') {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = className;
  button.dataset.testid = testId;
  button.textContent = text;
  return button;
}

function createCard(game) {
  const card = document.createElement('article');
  card.className = 'game-card';
  card.dataset.testid = 'entity-card';
  gameByCard.set(card, game);

  const title = document.createElement('h2');
  title.className = 'game-title';
  title.textContent = game.title;

  const year = document.createElement('p');
  year.className = 'game-year';
  year.textContent = `Год выпуска: ${game.releaseYear}`;

  const platforms = document.createElement('ul');
  platforms.className = 'platform-list';
  for (const platform of game.platforms) {
    const item = document.createElement('li');
    item.className = 'platform-item';
    item.textContent = platform;
    platforms.append(item);
  }

  const input = document.createElement('input');
  input.type = 'text';
  input.name = 'platform';
  input.className = 'platform-input';
  input.placeholder = 'Платформа';

  const actions = document.createElement('div');
  actions.className = 'card-actions';
  actions.append(
    createButton('Добавить платформу', 'add-platform'),
    createButton('Удалить платформу', 'remove-platform'),
    createButton('Удалить игру', 'delete-entity', 'button button-danger'),
  );

  card.append(title, year, platforms, input, actions);
  return card;
}

function render() {
  list.replaceChildren(...games.map(createCard));
}

list.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) {
    return;
  }
  const card = button.closest('[data-testid="entity-card"]');
  const game = gameByCard.get(card);
  const platform = card.querySelector('input[name="platform"]').value.trim();

  switch (button.dataset.testid) {
    case 'add-platform':
      if (platform) {
        addPlatform(game, platform);
      }
      break;
    case 'remove-platform':
      if (platform) {
        removePlatform(game, platform);
      }
      break;
    case 'delete-entity':
      removeGame(game);
      break;
    default:
      break;
  }
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const title = form.elements.title.value.trim();
  const releaseYear = Number(form.elements.releaseYear.value);
  if (!title || !Number.isInteger(releaseYear)) {
    return;
  }
  addGame(title, releaseYear);
  form.reset();
});

window.addEventListener('beforeunload', saveGames);

render();
