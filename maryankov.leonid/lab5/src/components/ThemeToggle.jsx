import {useTheme} from '../ThemeContext.js';

function ThemeToggle() {
  const {theme, toggleTheme} = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      className="theme-toggle"
      data-testid="theme-toggle"
      onClick={toggleTheme}
    >
      {isDark ? '☀️ Светлая тема' : '🌙 Тёмная тема'}
    </button>
  );
}

export default ThemeToggle;
