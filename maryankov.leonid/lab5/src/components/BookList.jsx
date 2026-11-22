import {books} from '../books.js';

function BookList() {
  return (
    <ul className="book-list" data-testid="book-list">
      {books.map((book) => (
        <li className="book-card" key={book.id}>
          <h2 className="book-title">{book.title}</h2>
          <p className="book-author">{book.author}</p>
          <p className="book-price">{book.price} ₽</p>
        </li>
      ))}
    </ul>
  );
}

export default BookList;
