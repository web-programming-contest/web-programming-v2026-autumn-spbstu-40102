import {Library, getUniqueAuthors, getUniqueYears} from './model.js';

const storageKey = 'chuvashevskij.svyatoslav.lab4.libraries';
const libraryForm = document.querySelector('[data-testid="entity-form"]');
const bookForm = document.querySelector('.book-form');
const librarySelect = bookForm.elements.namedItem('library');
const list = document.querySelector('[data-testid="entity-list"]');
const status = document.querySelector('.status');
let busy = false;
let libraries = loadLibraries();

function isBook(book) {
  return (
    book !== null &&
    typeof book === 'object' &&
    ['title', 'author', 'genre'].every(
      (field) => typeof book[field] === 'string',
    ) &&
    Number.isInteger(book.year)
  );
}

function loadLibraries() {
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved === null) {
      return [];
    }
    const data = JSON.parse(saved);
    if (
      !Array.isArray(data) ||
      !data.every(
        (library) =>
          library !== null &&
          typeof library === 'object' &&
          typeof library.name === 'string' &&
          Array.isArray(library.books) &&
          library.books.every(isBook),
      )
    ) {
      throw new Error('Некорректный формат сохранённой коллекции.');
    }
    return data.map((library) => new Library(library.name, library.books));
  } catch {
    status.textContent =
      'Не удалось прочитать сохранённую коллекцию. Можно начать новую; старые данные заменятся после успешного изменения.';
    return [];
  }
}

function element(tag, className, text) {
  const node = document.createElement(tag);
  node.className = className;
  node.textContent = text;
  return node;
}

function updateControls() {
  libraryForm.querySelector('fieldset').disabled = busy;
  bookForm.querySelector('fieldset').disabled = busy || libraries.length === 0;
  for (const button of list.querySelectorAll('button')) {
    button.disabled = busy;
  }
  list.setAttribute('aria-busy', String(busy));
}

async function changeCollection(change, successMessage) {
  if (busy) {
    return false;
  }
  busy = true;
  status.textContent = 'Сохраняем изменения…';
  updateControls();

  try {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const next = libraries.map(
      (library) => new Library(library.name, library.books),
    );
    change(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
    libraries = next;
    render();
    status.textContent = successMessage;
    return true;
  } catch {
    status.textContent =
      'Не удалось сохранить изменения. Проверьте доступ к хранилищу браузера и повторите попытку.';
    return false;
  } finally {
    busy = false;
    updateControls();
  }
}

function renderBook(book, libraryIndex) {
  const card = element('article', 'book-card', '');
  card.append(element('h4', 'book-title', book.title));
  const description = document.createElement('dl');
  for (const [label, value] of [
    ['Автор', book.author],
    ['Год издания', book.year],
    ['Жанр', book.genre],
  ]) {
    const row = element('div', 'book-detail', '');
    row.append(element('dt', '', label), element('dd', '', String(value)));
    description.append(row);
  }
  const remove = element('button', 'button-danger', 'Удалить');
  remove.type = 'button';
  remove.setAttribute('aria-label', `Удалить книгу «${book.title}»`);
  remove.addEventListener('click', () => {
    void changeCollection((next) => {
      next[libraryIndex].removeBook(book.title);
    }, `Книга «${book.title}» удалена.`);
  });
  card.append(description, remove);
  return card;
}

function renderLibrary(library, libraryIndex) {
  const card = element('section', 'library-card', '');
  card.dataset.testid = 'entity-card';
  const header = element('div', 'library-header', '');
  const heading = element('div', '', '');
  heading.append(
    element('h3', '', library.name),
    element('p', 'hint', `Книг: ${library.booksCount}`),
  );
  const remove = element('button', 'button-danger', 'Удалить библиотеку');
  remove.type = 'button';
  remove.dataset.testid = 'delete-entity';
  remove.setAttribute('aria-label', `Удалить библиотеку «${library.name}»`);
  remove.addEventListener('click', () => {
    void changeCollection((next) => {
      next.splice(libraryIndex, 1);
    }, `Библиотека «${library.name}» удалена вместе с её книгами.`);
  });
  header.append(heading, remove);
  card.append(header);
  if (library.booksCount === 0) {
    card.append(
      element(
        'p',
        'empty-state',
        'Здесь пока нет книг. Добавьте первую через форму.',
      ),
    );
  } else {
    const books = element('div', 'book-grid', '');
    for (const book of library.books) {
      books.append(renderBook(book, libraryIndex));
    }
    card.append(books);
  }
  return card;
}

function render() {
  const selectedLibrary = librarySelect.value;
  list.replaceChildren();
  librarySelect.replaceChildren();

  libraries.forEach((library, index) => {
    list.append(renderLibrary(library, index));
    const option = document.createElement('option');
    option.value = String(index);
    option.textContent = library.name;
    librarySelect.append(option);
  });
  if (libraries.length === 0) {
    list.append(
      element(
        'p',
        'empty-state',
        'Коллекция пока пуста. Создайте библиотеку, чтобы начать.',
      ),
    );
  } else if (Number(selectedLibrary) < libraries.length) {
    librarySelect.value = selectedLibrary || '0';
  }

  document.querySelector('#book-hint').textContent = libraries.length
    ? 'Выберите библиотеку и заполните все поля.'
    : 'Сначала добавьте библиотеку.';
  const booksCount = libraries.reduce(
    (sum, library) => sum + library.booksCount,
    0,
  );
  document.querySelector('.collection-count').textContent =
    `Библиотек: ${libraries.length} · Книг: ${booksCount}`;
  const authors = getUniqueAuthors(libraries);
  const years = getUniqueYears(libraries);
  document.querySelector('.authors-summary').textContent =
    `Авторы: ${authors.length ? authors.join(', ') : 'пока нет'}`;
  document.querySelector('.years-summary').textContent =
    `Годы издания: ${years.length ? years.join(', ') : 'пока нет'}`;
  updateControls();
}

for (const input of document.querySelectorAll('input')) {
  input.addEventListener('input', () => input.setCustomValidity(''));
}

function validateTextFields(form) {
  for (const input of form.querySelectorAll('input:not([type="number"])')) {
    input.setCustomValidity(
      input.value.trim() ? '' : 'Введите текст, а не только пробелы.',
    );
  }
  return form.reportValidity();
}

libraryForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!validateTextFields(libraryForm)) {
    return;
  }
  const name = libraryForm.elements.namedItem('name').value.trim();
  const added = await changeCollection((next) => {
    next.push(new Library(name));
  }, `Библиотека «${name}» добавлена.`);
  if (added) {
    libraryForm.reset();
    librarySelect.value = String(libraries.length - 1);
  }
});

bookForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!validateTextFields(bookForm) || libraries.length === 0) {
    return;
  }
  const data = new FormData(bookForm);
  const libraryIndex = Number(data.get('library'));
  const book = {
    title: data.get('title').trim(),
    author: data.get('author').trim(),
    year: Number(data.get('year')),
    genre: data.get('genre').trim(),
  };
  const added = await changeCollection((next) => {
    next[libraryIndex].addBook(book);
  }, `Книга «${book.title}» добавлена.`);
  if (added) {
    bookForm.reset();
    librarySelect.value = String(libraryIndex);
  }
});

render();
