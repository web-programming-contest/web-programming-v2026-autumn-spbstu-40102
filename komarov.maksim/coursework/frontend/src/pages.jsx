import {useEffect, useMemo, useState} from 'react';
import {Link, Navigate, useNavigate} from 'react-router-dom';
import {
  Flame,
  Sparkles,
  Rocket,
  BadgeRussianRuble,
  BadgeCheck,
  Phone,
  Mail,
  MapPin,
  ArrowDown,
  ArrowUp,
  Trash2,
  SearchX,
  LoaderCircle,
  X,
} from 'lucide-react';
import {
  Carousel,
  EmptyState,
  Field,
  ProductCard,
  Quantity,
} from './components.jsx';
import {useShop} from './state.jsx';
import {
  api,
  money,
  PAGE_SIZE,
  productWord,
  selectProducts,
  validateCheckout,
} from './shop.js';

export function HomePage() {
  const {products, user} = useShop();
  const byIds = (ids, predicate) => [
    ...ids.map((id) => products.find((p) => p.id === id)).filter(Boolean),
    ...products.filter((p) => predicate(p) && !ids.includes(p.id)),
  ];
  return (
    <main className="home-page">
      <div className="container">
        <Link
          className="hero-banner"
          to={user ? '/catalog' : '/login'}
          aria-label="Скидка 10% на умного робота-друга Red solution Reddy Air, 27 990 рублей"
        >
          <img
            src="/assets/hero.webp"
            alt="SUPER SALE — умный робот-друг Red solution Reddy Air. Скидка 10%, цена 27 990 ₽"
            fetchPriority="high"
          />
        </Link>
        <Carousel
          title="Хиты продаж"
          text="Тысячи покупателей уже одобрили эти товары. Самые популярные, проверенные и надежные гаджеты!"
          icon={<Flame className="pink-icon" size={36} />}
          products={byIds([108, 107, 106], (p) => p.isHit)}
        />
        <Carousel
          title="Новинки"
          text="Их только произвели — они уже у нас! Все самое новое и свежее на рынке электроники"
          icon={<Sparkles className="green-icon" size={36} />}
          products={byIds([102, 103, 104], (p) => p.isNew)}
        />
        <section className="advantages">
          <h2>Преимущества</h2>
          <div className="advantages-grid">
            <div>
              <Rocket size={54} className="pink-icon" />
              <h3>
                Утром заказали,
                <br />
                вечером получили
              </h3>
            </div>
            <div>
              <BadgeRussianRuble size={54} className="blue-icon" />
              <h3>
                С товаром что-то не так?
                <br />
                Вернем деньги
              </h3>
            </div>
            <div>
              <BadgeCheck size={54} className="green-icon" />
              <h3>
                Только оригинальные
                <br />
                товары
              </h3>
            </div>
          </div>
        </section>
        <section className="contacts">
          <h2>Работаем 24/7</h2>
          <div className="contacts-grid">
            <a href="tel:88006783424">
              <Phone size={30} />8 (800) 678-34-24
            </a>
            <a href="mailto:gadget@hub.ru">
              <Mail size={30} />
              gadget@hub.ru
            </a>
            <p>
              <MapPin size={32} />
              <span>
                Санкт-Петербург, ул.
                <br />
                Барочная, д.7, корпус 2
              </span>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export function LoginPage() {
  const {user, login, showModal} = useShop();
  const [form, setForm] = useState({username: '', password: ''});
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  if (user) {
    return <Navigate to="/" replace />;
  }
  async function submit(event) {
    event.preventDefault();
    const invalid = {};
    if (!form.username.trim()) {
      invalid.username = 'Заполните обязательное поле';
    }
    if (!form.password) {
      invalid.password = 'Заполните обязательное поле';
    }
    setErrors(invalid);
    if (Object.keys(invalid).length) {
      document.getElementById(Object.keys(invalid)[0])?.focus();
      return;
    }
    setBusy(true);
    try {
      await login(form.username.trim(), form.password);
      navigate('/');
    } catch (error) {
      showModal({
        kind: 'message',
        title: 'Не удалось войти',
        text: error.message,
      });
    } finally {
      setBusy(false);
    }
  }
  function change(event) {
    const {name, value} = event.target;
    setForm((f) => ({...f, [name]: value}));
    setErrors((e) => ({...e, [name]: ''}));
  }
  return (
    <main className="login-page">
      <div className="login-content">
        <h1>Добро пожаловать!</h1>
        <form className="login-form" onSubmit={submit} noValidate>
          <fieldset disabled={busy}>
            <Field
              label="Логин"
              name="username"
              value={form.username}
              onChange={change}
              error={errors.username}
              required
              autoComplete="username"
              maxLength={100}
            />
            <Field
              label="Пароль"
              name="password"
              value={form.password}
              onChange={change}
              error={errors.password}
              required
              autoComplete="current-password"
              type="password"
              maxLength={200}
            />
            <button className="button button-blue" type="submit">
              {busy && <LoaderCircle className="spin" size={16} />}
              {busy ? 'Входим…' : 'Войти'}
            </button>
          </fieldset>
        </form>
      </div>
    </main>
  );
}

const emptyFilters = () => ({min: '', max: '', categories: [], colors: []});
const colorValues = {
  Красный: '#ff5161',
  Оранжевый: '#ff9837',
  Жёлтый: '#ffd540',
  Зелёный: '#13cda0',
  Голубой: '#67d5ff',
  Синий: '#1260ff',
  Фиолетовый: '#a269e6',
  Розовый: '#ff60c3',
  Белый: '#fff',
  Чёрный: '#222',
  Серый: '#a9abb1',
  Бежевый: '#dec39c',
};

function Filters({products, draft, setDraft, onApply, onReset}) {
  const [error, setError] = useState('');
  const categories = [...new Set(products.map((p) => p.category))];
  const colors = Object.keys(colorValues).filter((c) =>
    products.some((p) => p.color === c),
  );
  const minPrice = Math.min(...products.map((p) => p.price));
  const maxPrice = Math.max(...products.map((p) => p.price));
  function toggle(type, value) {
    setDraft((f) => ({
      ...f,
      [type]: f[type].includes(value)
        ? f[type].filter((v) => v !== value)
        : [...f[type], value],
    }));
  }
  function submit(event) {
    event.preventDefault();
    if (
      (draft.min !== '' && Number(draft.min) < 0) ||
      (draft.max !== '' && Number(draft.max) < 0)
    ) {
      setError('Цена не может быть отрицательной');
      return;
    }
    if (
      draft.min !== '' &&
      draft.max !== '' &&
      Number(draft.min) > Number(draft.max)
    ) {
      setError('Цена «От» должна быть не больше цены «До»');
      return;
    }
    setError('');
    onApply();
  }
  return (
    <aside className="filters">
      <form onSubmit={submit} noValidate aria-label="Фильтры товаров">
        <fieldset>
          <legend>Цена, ₽</legend>
          <div className="price-fields">
            <Field
              label="От"
              name="price-min"
              type="number"
              min="0"
              step="1"
              value={draft.min}
              placeholder={String(minPrice)}
              onChange={(e) => {
                setDraft((f) => ({...f, min: e.target.value}));
                setError('');
              }}
            />
            <Field
              label="До"
              name="price-max"
              type="number"
              min="0"
              step="1"
              value={draft.max}
              placeholder={String(maxPrice)}
              onChange={(e) => {
                setDraft((f) => ({...f, max: e.target.value}));
                setError('');
              }}
            />
          </div>
          {error && (
            <p className="field-error" role="alert">
              {error}
            </p>
          )}
        </fieldset>
        <fieldset>
          <legend>Тип товара</legend>
          <div className="filter-options">
            {categories.map((category) => (
              <label className="check-label" key={category}>
                <input
                  type="checkbox"
                  checked={draft.categories.includes(category)}
                  onChange={() => toggle('categories', category)}
                />
                {category}
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend>Цвет</legend>
          <div className="filter-options">
            {colors.map((color) => (
              <label className="check-label" key={color}>
                <input
                  type="checkbox"
                  checked={draft.colors.includes(color)}
                  onChange={() => toggle('colors', color)}
                />
                <span
                  className="color-dot"
                  style={{background: colorValues[color]}}
                />
                {color}
              </label>
            ))}
          </div>
        </fieldset>
        <div className="filter-actions">
          <button className="button button-blue" type="submit">
            Показать
          </button>
          <button
            className="button button-text pink-text"
            type="button"
            onClick={() => {
              setError('');
              onReset();
            }}
          >
            Сбросить
          </button>
        </div>
      </form>
    </aside>
  );
}

function Pagination({page, total, onChange}) {
  if (total <= 1) {
    return null;
  }
  const numbers =
    total <= 3
      ? Array.from({length: total}, (_, i) => i + 1)
      : [...new Set([1, 2, 3, page, total])].sort((a, b) => a - b);
  return (
    <nav className="pagination" aria-label="Страницы каталога">
      <button
        className="page-button"
        aria-label="Предыдущая страница"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
      >
        ‹
      </button>
      {numbers.map((n, i) => (
        <span className="page-part" key={n}>
          {i > 0 && n - numbers[i - 1] > 1 && (
            <span className="page-ellipsis">…</span>
          )}
          <button
            className={`page-button ${n === page ? 'selected' : ''}`}
            aria-label={`Страница ${n}`}
            aria-current={n === page ? 'page' : undefined}
            onClick={() => onChange(n)}
          >
            {n}
          </button>
        </span>
      ))}
      <button
        className="page-button"
        aria-label="Следующая страница"
        disabled={page === total}
        onClick={() => onChange(page + 1)}
      >
        ›
      </button>
    </nav>
  );
}

export function CatalogPage() {
  const {products} = useShop();
  const [draft, setDraft] = useState(emptyFilters);
  const [filters, setFilters] = useState(emptyFilters);
  const [sort, setSort] = useState('new');
  const [page, setPage] = useState(1);
  const results = useMemo(
    () => selectProducts(products, filters, sort),
    [products, filters, sort],
  );
  const pages = Math.ceil(results.length / PAGE_SIZE);
  function setSorting(value) {
    setSort(value);
    setPage(1);
  }
  function reset() {
    setDraft(emptyFilters());
    setFilters(emptyFilters());
    setPage(1);
  }
  function changePage(n) {
    setPage(n);
    document
      .getElementById('catalog-title')
      ?.scrollIntoView({behavior: 'smooth', block: 'start'});
  }
  const chips = [
    {
      label: 'Новые',
      active: ['new', 'old'].includes(sort),
      value: sort === 'new' ? 'old' : 'new',
      reverse: sort === 'old',
    },
    {
      label: 'Популярные',
      active: ['popular', 'unpopular'].includes(sort),
      value: sort === 'popular' ? 'unpopular' : 'popular',
      reverse: sort === 'unpopular',
    },
    {label: 'Подешевле', active: sort === 'cheap', value: 'cheap'},
    {label: 'Подороже', active: sort === 'expensive', value: 'expensive'},
  ];
  return (
    <main className="catalog-page container">
      <h1 id="catalog-title" className="catalog-title">
        Каталог товаров
      </h1>
      <div className="catalog-layout">
        <div className="catalog-main">
          <div
            className="sort-chips"
            role="group"
            aria-label="Сортировка товаров"
          >
            {chips.map((chip, i) => (
              <button
                key={chip.label}
                type="button"
                className={`sort-chip ${chip.active ? 'active' : ''}`}
                aria-pressed={chip.active}
                title={
                  i < 2
                    ? 'Нажмите повторно, чтобы изменить направление'
                    : undefined
                }
                onClick={() => setSorting(chip.value)}
              >
                {chip.label}
                {chip.active &&
                  i < 2 &&
                  (chip.reverse ? (
                    <ArrowUp size={13} />
                  ) : (
                    <ArrowDown size={13} />
                  ))}
              </button>
            ))}
          </div>
          {results.length ? (
            <>
              <div className="product-grid">
                {results
                  .slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
                  .map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
              </div>
              <Pagination page={page} total={pages} onChange={changePage} />
            </>
          ) : (
            <div className="no-results" role="status">
              <SearchX size={50} />
              <h2>Товары не найдены</h2>
              <p>
                По вашему запросу ничего нет.
                <br />
                Попробуйте изменить или сбросить фильтры.
              </p>
              <button className="button button-blue" onClick={reset}>
                Сбросить фильтры
              </button>
            </div>
          )}
        </div>
        <Filters
          products={products}
          draft={draft}
          setDraft={setDraft}
          onApply={() => {
            setFilters({...draft});
            setPage(1);
          }}
          onReset={reset}
        />
      </div>
    </main>
  );
}

function CheckoutForm({onBusy, onSuccess}) {
  const {items, clearCart, expireSession} = useShop();
  const [form, setForm] = useState({
    phone: '',
    email: '',
    delivery: 'pickup',
    address: '',
    payment: '',
    wrapping: false,
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  function change(event) {
    const {name, value, type, checked} = event.target;
    setForm((f) => ({...f, [name]: type === 'checkbox' ? checked : value}));
    setErrors((e) => ({...e, [name]: ''}));
    setError('');
  }
  async function submit(event) {
    event.preventDefault();
    if (busy) {
      return;
    }
    const invalid = validateCheckout(form);
    setErrors(invalid);
    setError('');
    if (Object.keys(invalid).length) {
      document.getElementById(Object.keys(invalid)[0])?.focus();
      return;
    }
    setBusy(true);
    onBusy(true);
    try {
      const order = await api('/orders', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          phone: form.phone.trim(),
          email: form.email.trim(),
          address: form.delivery === 'delivery' ? form.address.trim() : '',
          items: items.map((p) => ({productId: p.id, quantity: p.quantity})),
        }),
      });
      clearCart();
      onSuccess(order);
    } catch (err) {
      if (err.status === 401) {
        expireSession();
      } else {
        setError(err.message);
      }
    } finally {
      setBusy(false);
      onBusy(false);
    }
  }
  return (
    <section className="checkout-section">
      <h2>Оформление заказа</h2>
      <form className="checkout-form panel" onSubmit={submit} noValidate>
        <fieldset disabled={busy}>
          <div className="contact-fields">
            <Field
              label="Телефон"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="+7 (999) 123-45-67"
              value={form.phone}
              onChange={change}
              error={errors.phone}
              required
              maxLength={40}
            />
            <Field
              label="E-mail"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={change}
              error={errors.email}
              maxLength={254}
            />
          </div>
          <div
            className="delivery-options"
            role="group"
            aria-label="Способ получения"
          >
            <label className="check-label">
              <input
                type="radio"
                name="delivery"
                value="pickup"
                checked={form.delivery === 'pickup'}
                onChange={change}
              />
              Самовывоз
            </label>
            <label className="check-label">
              <input
                type="radio"
                name="delivery"
                value="delivery"
                checked={form.delivery === 'delivery'}
                onChange={change}
              />
              Доставка
            </label>
          </div>
          {form.delivery === 'delivery' && (
            <Field
              label="Адрес доставки"
              name="address"
              autoComplete="street-address"
              value={form.address}
              onChange={change}
              error={errors.address}
              required
              maxLength={500}
            />
          )}
          <Field
            label="Способ оплаты"
            name="payment"
            error={errors.payment}
            required
          >
            <select
              name="payment"
              id="payment"
              value={form.payment}
              onChange={change}
              aria-invalid={Boolean(errors.payment)}
              aria-describedby={errors.payment ? 'payment-error' : undefined}
            >
              <option value="">Не выбрано</option>
              <option value="card">По карте</option>
              <option value="cash">Наличными</option>
            </select>
          </Field>
          <label className="check-label wrapping">
            <input
              type="checkbox"
              name="wrapping"
              checked={form.wrapping}
              onChange={change}
            />
            Нужна упаковка
          </label>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <button type="submit" className="button button-blue">
            {busy && <LoaderCircle size={16} className="spin" />}
            {busy ? 'Оформляем…' : 'Оформить заказ'}
          </button>
        </fieldset>
      </form>
    </section>
  );
}

function OrderHistory({revision}) {
  const {expireSession} = useShop();
  const [state, setState] = useState({loading: true, orders: [], error: ''});
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setState({loading: true, orders: [], error: ''});
    api('/orders', {signal: controller.signal})
      .then((orders) => setState({loading: false, orders, error: ''}))
      .catch((error) => {
        if (error.name === 'AbortError') {
          return;
        }
        if (error.status === 401) {
          expireSession();
        } else {
          setState({loading: false, orders: [], error: error.message});
        }
      });
    return () => controller.abort();
  }, [revision, retry]);
  if (state.loading) {
    return (
      <p className="loading-message" role="status">
        <LoaderCircle className="spin" />
        Загружаем заказы…
      </p>
    );
  }
  if (state.error) {
    return (
      <div className="inline-error" role="alert">
        <p>{state.error}</p>
        <button
          className="button button-blue"
          onClick={() => setRetry((n) => n + 1)}
        >
          Повторить
        </button>
      </div>
    );
  }
  if (!state.orders.length) {
    return <EmptyState history />;
  }
  const date = new Intl.DateTimeFormat('ru-RU', {timeZone: 'Europe/Moscow'});
  return (
    <div className="order-history panel">
      <table>
        <caption className="visually-hidden">История ваших заказов</caption>
        <thead className="visually-hidden">
          <tr>
            <th>Заказ</th>
            <th>Количество товаров</th>
            <th>Стоимость</th>
          </tr>
        </thead>
        <tbody>
          {state.orders.map((order) => (
            <tr key={order.id}>
              <td>
                № {order.id} от {date.format(new Date(order.createdAt))}
              </td>
              <td>
                {order.quantity} {productWord(order.quantity)}
              </td>
              <td>{money(order.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CartPage() {
  const {items, count, total, showModal, removeProducts} = useShop();
  const [tab, setTab] = useState('cart');
  const [selected, setSelected] = useState([]);
  const [busy, setBusy] = useState(false);
  const [revision, setRevision] = useState(0);
  const [completed, setCompleted] = useState(null);
  const selectedExisting = selected.filter((id) =>
    items.some((p) => p.id === id),
  );
  const allSelected =
    Boolean(items.length) && selectedExisting.length === items.length;
  function confirmDelete(ids) {
    const title =
      ids.length === 1 ? 'Удалить товар?' : 'Удалить выбранные товары?';
    const text =
      ids.length === 1
        ? `Вы действительно хотите удалить ${items.find((p) => p.id === ids[0])?.name} из корзины?`
        : `Из корзины будут удалены выбранные позиции: ${ids.length}.`;
    showModal({
      kind: 'confirm',
      title,
      text,
      confirmText: 'Да, удалить',
      action: () => {
        removeProducts(ids);
        setSelected((s) => s.filter((id) => !ids.includes(id)));
      },
    });
  }
  function success(order) {
    setRevision((n) => n + 1);
    setSelected([]);
    setCompleted(order);
    showModal({
      kind: 'success',
      title: 'Спасибо за заказ!',
      text: `Номер заказа ${order.id}. Мы свяжемся с вами в течение 10 минут, чтобы уточнить детали получения.`,
    });
  }
  return (
    <main className="cart-page">
      <div className="container cart-container">
        <div className="cart-tabs" role="tablist" aria-label="Корзина и заказы">
          <button
            role="tab"
            id="cart-tab"
            aria-controls="cart-panel"
            aria-selected={tab === 'cart'}
            className={tab === 'cart' ? 'active' : ''}
            onClick={() => setTab('cart')}
            disabled={busy}
          >
            Корзина
          </button>
          <button
            role="tab"
            id="history-tab"
            aria-controls="history-panel"
            aria-selected={tab === 'history'}
            className={tab === 'history' ? 'active' : ''}
            onClick={() => setTab('history')}
            disabled={busy}
          >
            История заказов
          </button>
        </div>
        {tab === 'history' ? (
          <section
            role="tabpanel"
            id="history-panel"
            aria-labelledby="history-tab"
          >
            <OrderHistory revision={revision} />
          </section>
        ) : (
          <section role="tabpanel" id="cart-panel" aria-labelledby="cart-tab">
            {!items.length ? (
              <>
                {completed && (
                  <div className="order-success" role="status">
                    Спасибо, ваш заказ успешно оформлен. № {completed.id}{' '}
                    <button onClick={() => setTab('history')}>
                      Посмотреть в истории
                    </button>
                  </div>
                )}
                <EmptyState />
              </>
            ) : (
              <>
                <section
                  className="cart-list panel"
                  aria-label="Товары в корзине"
                >
                  <div className="cart-toolbar">
                    <label className="check-label">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        disabled={busy}
                        onChange={() =>
                          setSelected(allSelected ? [] : items.map((p) => p.id))
                        }
                      />
                      Выбрать все
                    </label>
                    {selectedExisting.length > 0 && (
                      <button
                        className="delete-button"
                        onClick={() => confirmDelete(selectedExisting)}
                        disabled={busy}
                      >
                        <Trash2 size={16} />
                        {allSelected ? 'Удалить все' : 'Удалить выбранные'}
                      </button>
                    )}
                  </div>
                  {items.map((p) => (
                    <article className="cart-row" key={p.id}>
                      <input
                        type="checkbox"
                        aria-label={`Выбрать: ${p.name}`}
                        checked={selectedExisting.includes(p.id)}
                        onChange={() =>
                          setSelected((s) =>
                            s.includes(p.id)
                              ? s.filter((id) => id !== p.id)
                              : [...s, p.id],
                          )
                        }
                        disabled={busy}
                      />
                      <button
                        className="cart-product"
                        onClick={() => showModal({kind: 'product', product: p})}
                        disabled={busy}
                      >
                        <img src={p.image} alt="" />
                        <span>{p.name}</span>
                      </button>
                      <Quantity product={p} disabled={busy} />
                      <strong className="cart-row-price">
                        {money(p.price * p.quantity)}
                      </strong>
                      <button
                        className="delete-button"
                        onClick={() => confirmDelete([p.id])}
                        disabled={busy}
                      >
                        <X size={16} />
                        Удалить
                      </button>
                    </article>
                  ))}
                  <div className="cart-total">
                    {count} {productWord(count)} на {money(total)}
                  </div>
                </section>
                <CheckoutForm onBusy={setBusy} onSuccess={success} />
              </>
            )}
          </section>
        )}
      </div>
    </main>
  );
}

export function NotFoundPage() {
  return (
    <main className="container not-found">
      <span>404</span>
      <h1>Страница не найдена</h1>
      <p>Возможно, адрес изменился или в нём опечатка.</p>
      <Link className="button button-blue" to="/">
        На главную
      </Link>
    </main>
  );
}
