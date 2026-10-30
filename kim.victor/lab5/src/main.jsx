import React, {useEffect, useMemo, useState} from 'react';
import {createRoot} from 'react-dom/client';
import './styles.css';

const STORAGE_KEY = 'finance-variant-35-transactions';

function readTransactions() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function formatMoney(value) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 2,
  }).format(value);
}

function FinanceApp() {
  const [transactions, setTransactions] = useState(readTransactions);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('income');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  const income = useMemo(
    () =>
      transactions
        .filter((item) => item.type === 'income')
        .reduce((sum, item) => sum + item.amount, 0),
    [transactions],
  );
  const expense = useMemo(
    () =>
      transactions
        .filter((item) => item.type === 'expense')
        .reduce((sum, item) => sum + item.amount, 0),
    [transactions],
  );
  const balance = income - expense;
  const visibleTransactions = transactions.filter(
    (item) => filter === 'all' || item.type === filter,
  );
  const chartTotal = income + expense;
  const incomeWidth = chartTotal ? (income / chartTotal) * 100 : 50;
  const expenseWidth = chartTotal ? (expense / chartTotal) * 100 : 50;

  function handleSubmit(event) {
    event.preventDefault();
    const cleanDescription = description.trim();
    const parsedAmount = Number(amount);

    if (
      !cleanDescription ||
      !Number.isFinite(parsedAmount) ||
      parsedAmount <= 0
    ) {
      return;
    }

    const transaction = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      description: cleanDescription,
      amount: parsedAmount,
      type,
      date: new Date().toISOString(),
    };

    setTransactions((current) => [transaction, ...current]);
    setDescription('');
    setAmount('');
  }

  function removeTransaction(id) {
    setTransactions((current) => current.filter((item) => item.id !== id));
  }

  return (
    <div className="page-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Финансы — главная">
          <span className="brand-mark">₽</span>
          <span>мой бюджет</span>
        </a>
        <span className="topbar-note">Личный финансовый кабинет</span>
      </header>

      <section className="intro" id="top">
        <div>
          <p className="eyebrow">ФИНАНСЫ / ОБЗОР</p>
          <h1>Финансовый отчёт</h1>
          <p className="intro-copy">
            Следите за доходами и расходами в одном месте.
          </p>
        </div>
        <div className="date-chip">
          <span className="date-dot" />
          {new Intl.DateTimeFormat('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }).format(new Date())}
        </div>
      </section>

      <section className="summary-grid" aria-label="Сводка финансов">
        <article className="summary-card balance-card">
          <div className="summary-label">Текущий баланс</div>
          <div className="summary-value">{formatMoney(balance)}</div>
          <div className="summary-foot">Доходы минус расходы</div>
          <span className="balance-decoration">₽</span>
        </article>
        <article className="summary-card">
          <div className="summary-label">
            <span className="legend-dot income-dot" /> Доходы
          </div>
          <div className="summary-value">{formatMoney(income)}</div>
          <div className="summary-foot">Всего поступлений</div>
        </article>
        <article className="summary-card">
          <div className="summary-label">
            <span className="legend-dot expense-dot" /> Расходы
          </div>
          <div className="summary-value">{formatMoney(expense)}</div>
          <div className="summary-foot">Всего списаний</div>
        </article>
      </section>

      <section className="content-grid">
        <article className="panel add-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">НОВАЯ ЗАПИСЬ</p>
              <h2>Добавить операцию</h2>
            </div>
            <span className="heading-icon">＋</span>
          </div>
          <form className="transaction-form" onSubmit={handleSubmit}>
            <label htmlFor="transaction-description">Описание</label>
            <input
              id="transaction-description"
              data-testid="transaction-description"
              type="text"
              placeholder="Например, зарплата или продукты"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              required
              maxLength={80}
            />

            <label htmlFor="transaction-amount">Сумма, ₽</label>
            <div className="amount-wrap">
              <input
                id="transaction-amount"
                data-testid="transaction-amount"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                required
              />
              <span>₽</span>
            </div>

            <label htmlFor="transaction-type">Тип операции</label>
            <select
              id="transaction-type"
              data-testid="transaction-type"
              value={type}
              onChange={(event) => setType(event.target.value)}
            >
              <option value="income">Доход</option>
              <option value="expense">Расход</option>
            </select>

            <button
              className="primary-button"
              data-testid="transaction-add"
              type="submit"
            >
              <span>＋</span> Добавить операцию
            </button>
          </form>
          <p className="form-hint">
            Записи сохраняются автоматически в этом браузере.
          </p>
        </article>

        <article className="panel chart-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">АНАЛИТИКА</p>
              <h2>Структура финансов</h2>
            </div>
            <span className="chart-period">За всё время</span>
          </div>
          <div
            className="chart-area"
            data-testid="finance-chart"
            aria-label="Диаграмма доходов и расходов"
          >
            <div className="chart-total-label">Общий оборот</div>
            <div className="chart-total">{formatMoney(chartTotal)}</div>
            <div
              className="bar-chart"
              role="img"
              aria-label={`Доходы ${incomeWidth.toFixed(0)} процентов, расходы ${expenseWidth.toFixed(0)} процентов`}
            >
              <div className="bar-column">
                <div className="bar-track">
                  <div
                    className="bar-fill income-fill"
                    style={{height: `${incomeWidth}%`}}
                  />
                </div>
                <span className="bar-caption">Доходы</span>
                <strong>{formatMoney(income)}</strong>
              </div>
              <div className="bar-column">
                <div className="bar-track">
                  <div
                    className="bar-fill expense-fill"
                    style={{height: `${expenseWidth}%`}}
                  />
                </div>
                <span className="bar-caption">Расходы</span>
                <strong>{formatMoney(expense)}</strong>
              </div>
            </div>
            <div className="chart-legend">
              <span>
                <i className="legend-dot income-dot" /> Доходы
              </span>
              <span>
                <i className="legend-dot expense-dot" /> Расходы
              </span>
            </div>
          </div>
        </article>
      </section>

      <section className="panel history-panel">
        <div className="history-heading">
          <div>
            <p className="eyebrow">ЖУРНАЛ</p>
            <h2>История операций</h2>
          </div>
          <div className="filter-tabs" aria-label="Фильтр операций">
            <button
              className={filter === 'all' ? 'active' : ''}
              onClick={() => setFilter('all')}
              type="button"
            >
              Все
            </button>
            <button
              className={filter === 'income' ? 'active' : ''}
              onClick={() => setFilter('income')}
              type="button"
            >
              Доходы
            </button>
            <button
              className={filter === 'expense' ? 'active' : ''}
              onClick={() => setFilter('expense')}
              type="button"
            >
              Расходы
            </button>
          </div>
        </div>
        <div
          data-testid="transaction-history"
          className="transaction-list"
          hidden={visibleTransactions.length === 0}
        >
          {visibleTransactions.map((item) => (
            <div
              className="transaction-row"
              data-testid="transaction-item"
              key={item.id}
            >
              <div className={`transaction-symbol ${item.type}`}>
                {item.type === 'income' ? '↙' : '↗'}
              </div>
              <div className="transaction-info">
                <strong>{item.description}</strong>
                <span>
                  {new Intl.DateTimeFormat('ru-RU', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  }).format(new Date(item.date))}
                </span>
              </div>
              <strong className={`transaction-amount ${item.type}`}>
                {item.type === 'income' ? '+' : '−'}
                {formatMoney(item.amount)}
              </strong>
              <button
                className="delete-button"
                type="button"
                onClick={() => removeTransaction(item.id)}
                aria-label={`Удалить ${item.description}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        {visibleTransactions.length === 0 && (
          <div className="empty-state">
            <span className="empty-icon">▤</span>
            <strong>
              {transactions.length
                ? 'Нет операций в этой категории'
                : 'Пока нет операций'}
            </strong>
            <span>Добавьте первую запись с помощью формы выше.</span>
          </div>
        )}
        <div className="history-footer">
          <span>
            Всего записей: <strong>{transactions.length}</strong>
          </span>
          <span>Данные хранятся локально</span>
        </div>
      </section>

      <footer className="footer">
        мой бюджет <span>·</span> Финансовый отчёт
      </footer>
    </div>
  );
}

createRoot(document.querySelector('[data-testid="app"]')).render(
  <FinanceApp />,
);
