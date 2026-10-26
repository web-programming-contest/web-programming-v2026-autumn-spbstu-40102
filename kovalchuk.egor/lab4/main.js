import {
  Travel,
  groupTravelsByCountryCount,
  getUniqueCountries,
  findTravelsByCountry,
  groupTravelersByCountry,
  findTravelsAboveCountryCount,
} from './model.js';

const storageKey = 'kovalchuk.egor.lab4.travels';
const entityForm = document.querySelector('[data-testid="entity-form"]');
const entityList = document.querySelector('[data-testid="entity-list"]');
const status = document.querySelector('#status');
const countryFilter = document.querySelector('#country-filter');
const countFilter = document.querySelector('#count-filter');
let busy = false;

function showStatus(message, isError = false) {
  status.textContent = message;
  status.classList.toggle('status-error', isError);
}

function loadTravels() {
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved === null) {
      return [];
    }
    const data = JSON.parse(saved);
    if (!Array.isArray(data)) {
      throw new Error('Ожидался массив путешествий.');
    }
    const restored = data.map(
      (item) => new Travel(item.id, item.travelerName, item.visitedCountries),
    );
    if (new Set(restored.map((travel) => travel.id)).size !== restored.length) {
      throw new Error('В сохранённых данных повторяются ID.');
    }
    return restored;
  } catch {
    showStatus(
      'Не удалось прочитать сохранённые данные. Список открыт пустым.',
      true,
    );
    return [];
  }
}

let travels = loadTravels();

function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) {
    node.textContent = text;
  }
  if (className) {
    node.className = className;
  }
  return node;
}

function setBusy(value) {
  busy = value;
  entityList.setAttribute('aria-busy', String(value));
  document.querySelectorAll('button').forEach((button) => {
    button.disabled = value;
  });
}

/** Все четыре вида изменений проходят через Promise и setTimeout. */
async function changeTravels(change, message) {
  if (busy) {
    return false;
  }
  setBusy(true);
  showStatus('Выполняется операция…');
  try {
    await new Promise((resolve) => {
      setTimeout(resolve, 250);
    });
    const next = travels.map(
      (travel) =>
        new Travel(travel.id, travel.travelerName, travel.visitedCountries),
    );
    change(next);
    // Сначала сохраняем: при ошибке записи текущие карточки остаются на месте.
    localStorage.setItem(storageKey, JSON.stringify(next));
    travels = next;
    render();
    showStatus(message);
    return true;
  } catch (error) {
    showStatus(
      error instanceof Error ? error.message : 'Операция не выполнена.',
      true,
    );
    return false;
  } finally {
    setBusy(false);
  }
}

function createCountryRow(travel, country) {
  const row = element('li', undefined, 'country-row');
  const remove = element('button', 'Удалить страну', 'secondary-button');
  remove.type = 'button';
  remove.setAttribute('aria-label', `Удалить страну ${country}`);
  remove.addEventListener('click', () => {
    void changeTravels((next) => {
      next.find((item) => item.id === travel.id).removeCountry(country);
    }, 'Страна удалена.');
  });
  row.append(element('span', country), remove);
  return row;
}

function createCountryForm(travel) {
  const form = element('form', undefined, 'country-form');
  const label = element('label', 'Название страны');
  const input = element('input');
  input.name = 'country';
  input.type = 'text';
  input.required = true;
  input.maxLength = 120;
  input.placeholder = 'Например, Япония';
  label.append(input);
  const add = element('button', 'Добавить страну');
  add.type = 'submit';
  form.append(label, add);
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const country = input.value.trim();
    void changeTravels((next) => {
      const target = next.find((item) => item.id === travel.id);
      if (target.visitedCountries.includes(country)) {
        throw new Error('Эта страна уже есть в путешествии.');
      }
      target.addCountry(country);
    }, 'Страна добавлена.');
  });
  return form;
}

function createCard(travel) {
  const card = element('article', undefined, 'travel-card');
  card.dataset.testid = 'entity-card';
  const heading = element('div', undefined, 'card-header');
  heading.append(
    element('h3', travel.travelerName),
    element('span', `ID: ${travel.id}`, 'summary'),
  );
  card.append(heading, element('p', `Посещено стран: ${travel.visitedCount}`));
  if (travel.visitedCount > 0) {
    const countries = element('ul', undefined, 'country-list');
    travel.visitedCountries.forEach((country) => {
      countries.append(createCountryRow(travel, country));
    });
    card.append(countries);
  } else {
    card.append(element('p', 'Посещённых стран пока нет.', 'hint'));
  }
  card.append(createCountryForm(travel));
  const remove = element('button', 'Удалить путешествие', 'secondary-button');
  remove.type = 'button';
  remove.dataset.testid = 'delete-entity';
  remove.addEventListener('click', () => {
    void changeTravels((next) => {
      const index = next.findIndex((item) => item.id === travel.id);
      next.splice(index, 1);
    }, 'Путешествие удалено.');
  });
  card.append(remove);
  return card;
}

function describeTravels(items) {
  return items.length > 0
    ? items
        .map((travel) => `${travel.travelerName} (ID: ${travel.id})`)
        .join(', ')
    : 'Нет путешествий.';
}

function renderGroups(selector, groups, describeKey) {
  const container = document.querySelector(selector);
  container.replaceChildren();
  if (groups.size === 0) {
    container.append(element('p', 'Пока нет данных.'));
    return;
  }
  const list = element('ul');
  groups.forEach((items, key) => {
    list.append(
      element('li', `${describeKey(key)}: ${describeTravels(items)}`),
    );
  });
  container.append(list);
}

function renderFilters() {
  const country = countryFilter.value.trim();
  document.querySelector('#country-results').textContent = country
    ? describeTravels(findTravelsByCountry(travels, country))
    : 'Введите название страны.';
  const threshold = countFilter.valueAsNumber;
  document.querySelector('#count-results').textContent =
    Number.isInteger(threshold) && threshold >= 0
      ? describeTravels(findTravelsAboveCountryCount(travels, threshold))
      : 'Введите целое число N от 0.';
}

function render() {
  entityList.replaceChildren();
  if (travels.length === 0) {
    entityList.append(
      element(
        'p',
        'Путешествий пока нет. Добавь первое через форму выше.',
        'empty-state',
      ),
    );
  } else {
    travels.forEach((travel) => entityList.append(createCard(travel)));
  }
  const countries = getUniqueCountries(travels);
  document.querySelector('#summary').textContent =
    `Путешествий: ${travels.length} · Уникальных стран: ${countries.length}`;
  document.querySelector('#unique-countries').textContent =
    countries.length > 0 ? countries.join(', ') : 'Пока нет посещённых стран.';
  renderGroups(
    '#count-groups',
    groupTravelsByCountryCount(travels),
    (count) => `Стран: ${count}`,
  );
  renderGroups(
    '#country-groups',
    groupTravelersByCountry(travels),
    (country) => country,
  );
  renderFilters();
}

entityForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const data = new FormData(entityForm);
  const id = Number(data.get('id'));
  const name = String(data.get('travelerName'));
  const success = await changeTravels((next) => {
    if (next.some((travel) => travel.id === id)) {
      throw new Error('Путешествие с таким ID уже существует.');
    }
    next.push(new Travel(id, name));
  }, 'Путешествие добавлено.');
  if (success) {
    entityForm.reset();
    entityForm.elements.namedItem('id').focus();
  }
});

countryFilter.addEventListener('input', renderFilters);
countFilter.addEventListener('input', renderFilters);
render();
