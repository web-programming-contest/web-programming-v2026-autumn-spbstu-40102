import {useEffect, useState} from 'react';
import type {ChangeEvent, FormEvent} from 'react';
import {createRoot} from 'react-dom/client';
import './styles.css';

interface Todo {
  id: number;
  text: string;
  done: boolean;
}

type Filter = 'all' | 'active' | 'completed';

interface FilterOption {
  value: Filter;
  label: string;
}

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

const FILTERS: FilterOption[] = [
  {value: 'all', label: 'Все'},
  {value: 'active', label: 'Активные'},
  {value: 'completed', label: 'Выполненные'},
];

const STORAGE_KEY = 'lab5-todos';

function TodoForm({onAdd}: {onAdd: (text: string) => void}) {
  const [text, setText] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = text.trim();
    if (value === '') {
      return;
    }
    onAdd(value);
    setText('');
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <input
        className="todo-input"
        data-testid="todo-input"
        type="text"
        placeholder="Новая задача"
        value={text}
        onChange={handleChange}
      />
      <button className="todo-add" data-testid="todo-add" type="submit">
        Добавить
      </button>
    </form>
  );
}

function TodoItem({todo, onToggle, onDelete}: TodoItemProps) {
  return (
    <li className="todo-item" data-testid="todo-item">
      <label className="todo-label">
        <input
          className="todo-checkbox"
          type="checkbox"
          checked={todo.done}
          onChange={() => onToggle(todo.id)}
        />
        <span className={todo.done ? 'todo-text todo-text-done' : 'todo-text'}>
          {todo.text}
        </span>
      </label>
      <button
        className="todo-delete"
        type="button"
        onClick={() => onDelete(todo.id)}
      >
        Удалить
      </button>
    </li>
  );
}

function App() {
  const [todos, setTodos] = useState<Todo[]>(loadTodos);
  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  const addTodo = (text: string) => {
    setTodos([...todos, {id: Date.now(), text, done: false}]);
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? {...todo, done: !todo.done} : todo,
      ),
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const visibleTodos = todos.filter((todo) => {
    if (filter === 'active') {
      return !todo.done;
    }
    if (filter === 'completed') {
      return todo.done;
    }
    return true;
  });

  return (
    <div className="todo">
      <h1>Список задач</h1>
      <TodoForm onAdd={addTodo} />
      <div className="filters">
        {FILTERS.map((option) => (
          <button
            key={option.value}
            className={
              filter === option.value ? 'filter filter-active' : 'filter'
            }
            data-testid="todo-filter"
            type="button"
            onClick={() => setFilter(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
      <ul className="todo-list" data-testid="todo-list">
        {visibleTodos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
          />
        ))}
      </ul>
    </div>
  );
}

function loadTodos(): Todo[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === null) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    const result: Todo[] = [];
    for (const value of parsed) {
      if (typeof value !== 'object' || value === null) {
        continue;
      }
      const record = value as Record<string, unknown>;
      const id = record.id;
      const text = record.text;
      if (typeof id !== 'number' || typeof text !== 'string') {
        continue;
      }
      result.push({id, text, done: record.done === true});
    }
    return result;
  } catch {
    return [];
  }
}

function saveTodos(todos: Todo[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

const container = document.querySelector<HTMLElement>('[data-testid="app"]');
if (container === null) {
  throw new Error('Не найден корневой элемент приложения.');
}

createRoot(container).render(<App />);
