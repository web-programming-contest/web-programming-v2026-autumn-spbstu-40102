import {Event} from './model.js';

const STORAGE_KEY = 'events';
const DELAY_MS = 200;

const eventList = document.querySelector('[data-testid="entity-list"]');
const eventForm = document.querySelector('[data-testid="entity-form"]');
const participantForm = document.querySelector('.participant-form');
const removeButton = document.querySelector('.remove-participant');
const message = document.querySelector('.message');
const eventSelect = participantForm.elements.eventId;

let events = loadEvents();

function loadEvents() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(stored) ? stored.map((item) => new Event(item)) : [];
  } catch {
    return [];
  }
}

function saveEvents() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

// Любое изменение данных выполняется асинхронно: Promise + setTimeout.
function runAsync(action) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(action()), DELAY_MS);
  });
}

function showMessage(text) {
  message.textContent = text;
}

function formatDate(date) {
  const [year, month, day] = String(date).split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('ru-RU');
}

function createCard(event) {
  const card = document.createElement('li');
  card.className = 'event-card';
  card.dataset.testid = 'entity-card';
  card.dataset.id = event.id;

  const title = document.createElement('h3');
  title.className = 'event-card-title';
  title.textContent = event.title;

  const date = document.createElement('p');
  date.className = 'event-card-date';
  date.textContent = `Дата: ${formatDate(event.date)}`;

  const participants = document.createElement('ul');
  participants.className = 'participants';
  for (const name of event.participants) {
    const item = document.createElement('li');
    item.className = 'participants-item';
    item.textContent = name;
    participants.append(item);
  }

  const count = document.createElement('p');
  count.className = 'event-card-count';
  count.textContent = `Участников: ${event.participantCount}`;

  const deleteButton = document.createElement('button');
  deleteButton.className = 'button button-danger';
  deleteButton.type = 'button';
  deleteButton.dataset.testid = 'delete-entity';
  deleteButton.textContent = 'Удалить мероприятие';

  card.append(title, date, participants, count, deleteButton);
  return card;
}

function createOption(event) {
  const option = document.createElement('option');
  option.value = event.id;
  option.textContent = event.title;
  return option;
}

function render() {
  const selected = eventSelect.value;
  eventList.replaceChildren(...events.map(createCard));
  eventSelect.replaceChildren(...events.map(createOption));
  if (events.some((event) => String(event.id) === selected)) {
    eventSelect.value = selected;
  }
}

eventForm.addEventListener('submit', async (submitEvent) => {
  submitEvent.preventDefault();

  const data = new FormData(eventForm);
  const rawId = String(data.get('id')).trim();
  const id = Number(rawId);
  const title = String(data.get('title')).trim();
  const date = String(data.get('date'));

  if (rawId === '' || !Number.isInteger(id) || !title || !date) {
    showMessage('Заполните ID (число), название и дату.');
    return;
  }
  if (events.some((event) => event.id === id)) {
    showMessage('Мероприятие с таким ID уже существует.');
    return;
  }

  await runAsync(() => {
    events.push(new Event(id, title, [], date));
    saveEvents();
  });
  render();
  eventForm.reset();
  showMessage('');
});

async function changeParticipant(action) {
  const id = Number(eventSelect.value);
  const name = participantForm.elements.participant.value.trim();
  const target = events.find((event) => event.id === id);

  if (!target || !name) {
    showMessage('Выберите мероприятие и введите имя участника.');
    return;
  }

  const done = await runAsync(() => {
    const result = action(target, name);
    saveEvents();
    return result;
  });
  render();

  if (done) {
    participantForm.elements.participant.value = '';
    showMessage('');
  } else {
    showMessage('Операция не выполнена: участник уже есть или не найден.');
  }
}

participantForm.addEventListener('submit', (submitEvent) => {
  submitEvent.preventDefault();
  changeParticipant((target, name) => target.addParticipant(name));
});

removeButton.addEventListener('click', () => {
  changeParticipant((target, name) => target.removeParticipant(name));
});

eventList.addEventListener('click', async (clickEvent) => {
  const button = clickEvent.target.closest('[data-testid="delete-entity"]');
  if (!button) {
    return;
  }

  const id = Number(button.closest('[data-testid="entity-card"]').dataset.id);
  await runAsync(() => {
    events = events.filter((event) => event.id !== id);
    saveEvents();
  });
  render();
});

render();
