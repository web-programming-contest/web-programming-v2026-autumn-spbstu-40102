export class Library {
  constructor(name, books = []) {
    this.name = name;
    this.books = books.map((book) => ({...book}));
  }

  addBook(book) {
    this.books.push({...book});
  }

  removeBook(title) {
    this.books = this.books.filter((book) => book.title !== title);
  }

  get booksCount() {
    return this.books.length;
  }
}

function getAllBooks(libraries) {
  return libraries.flatMap((library) => library.books);
}

function groupBooks(libraries, field) {
  const groups = new Map();

  for (const book of getAllBooks(libraries)) {
    const key = book[field];
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key).push(book);
  }

  return groups;
}

export function groupBooksByGenre(libraries) {
  return groupBooks(libraries, 'genre');
}

export function getUniqueAuthors(libraries) {
  return [...new Set(getAllBooks(libraries).map((book) => book.author))];
}

export function groupBooksByYear(libraries) {
  return groupBooks(libraries, 'year');
}

export function getUniqueYears(libraries) {
  return [...new Set(getAllBooks(libraries).map((book) => book.year))];
}

export function findBooksByAuthor(libraries, author) {
  return getAllBooks(libraries).filter((book) => book.author === author);
}
