import {useState} from 'react';
import {ThemeContext} from './ThemeContext.js';
import ThemeToggle from './components/ThemeToggle.jsx';
import BookList from './components/BookList.jsx';

function App() {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{theme, toggleTheme}}>
      <main className="app" data-testid="app" data-theme={theme}>
        <header className="app-header">
          <h1 className="app-title">Книжный магазин</h1>
          <ThemeToggle />
        </header>
        <BookList />
      </main>
    </ThemeContext.Provider>
  );
}

export default App;
