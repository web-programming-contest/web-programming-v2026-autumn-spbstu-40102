import {useEffect, useRef, useState} from 'react';
import {Link, NavLink, useNavigate} from 'react-router-dom';
import {
  LayoutGrid,
  ShoppingCart,
  UserRound,
  LogOut,
  Smartphone,
  Plus,
  Minus,
  Star,
  X,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  ShoppingBasket,
} from 'lucide-react';
import {useShop} from './state.jsx';
import {money, MAX_QUANTITY} from './shop.js';

export function Logo() {
  return (
    <Link className="logo" to="/" aria-label="Gadget Hub — главная">
      <span>Gadget</span> Hub
    </Link>
  );
}

export function Header() {
  const {user, count, logout, showModal} = useShop();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  async function exit() {
    setBusy(true);
    try {
      await logout();
      navigate('/');
    } catch (error) {
      showModal({
        kind: 'message',
        title: 'Не удалось выйти',
        text: error.message,
      });
    } finally {
      setBusy(false);
    }
  }
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Logo />
        <nav aria-label="Основная навигация">
          <NavLink
            to="/catalog"
            className={({isActive}) => `menu-link ${isActive ? 'active' : ''}`}
          >
            <LayoutGrid size={18} />
            Каталог
          </NavLink>
          {user ? (
            <>
              <NavLink
                to="/cart"
                className={({isActive}) =>
                  `menu-link ${isActive ? 'active' : ''}`
                }
              >
                <ShoppingCart size={18} />
                Корзина
                {count > 0 && (
                  <span
                    className="cart-badge"
                    aria-label={`${count} единиц в корзине`}
                  >
                    {count}
                  </span>
                )}
              </NavLink>
              <button className="menu-link" onClick={exit} disabled={busy}>
                <LogOut size={18} />
                {busy ? 'Выходим…' : 'Выйти'}
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              className={({isActive}) =>
                `menu-link ${isActive ? 'active' : ''}`
              }
            >
              <UserRound size={18} />
              Войти
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <Logo />
          <p className="footer-caption">Магазин надежных гаджетов</p>
          <p className="copyright">
            © 2024 ООО «Гаджет Хаб». Все права защищены
          </p>
        </div>
        <a className="footer-phone" href="tel:88006783424">
          <Smartphone size={24} />8 (800) 678-34-24
        </a>
        <div className="social-links" aria-label="Социальные сети">
          <a
            href="https://vk.com/"
            aria-label="ВКонтакте"
            target="_blank"
            rel="noreferrer"
          >
            <img src="/assets/social%20icons/vk.png" alt="" />
          </a>
          <a
            href="https://t.me/"
            aria-label="Telegram"
            target="_blank"
            rel="noreferrer"
          >
            <img src="/assets/social%20icons/telegram.png" alt="" />
          </a>
          <a
            href="https://www.whatsapp.com/"
            aria-label="WhatsApp"
            target="_blank"
            rel="noreferrer"
          >
            <img src="/assets/social%20icons/whatsapp.png" alt="" />
          </a>
        </div>
      </div>
    </footer>
  );
}

export function Rating({value}) {
  return (
    <span className="rating" aria-label={`Рейтинг ${value} из 5`}>
      <Star size={16} fill="currentColor" strokeWidth={0} />
      <span>{String(value).replace('.', ',')}</span>
    </span>
  );
}

export function Labels({product}) {
  return (
    <div className="product-labels">
      {product.isNew && <span className="label-new">Новинка</span>}
      {product.isHit && <span className="label-hit">Хит</span>}
    </div>
  );
}

export function Quantity({
  product,
  disabled = false,
  includeButton = false,
  compact = false,
}) {
  const {cart, setQuantity} = useShop();
  const quantity = cart[product.id] || 0;
  if (!quantity) {
    return (
      <button
        className="button button-blue add-button"
        onClick={() => setQuantity(product.id, 1)}
        disabled={disabled}
      >
        <ShoppingCart size={17} />В корзину
      </button>
    );
  }
  return (
    <div className={`cart-control ${includeButton ? 'with-cart-button' : ''}`}>
      <div
        className="quantity-control"
        role="group"
        aria-label={`Количество: ${product.name}`}
      >
        <button
          className="quantity-button"
          disabled={disabled}
          onClick={() => setQuantity(product.id, quantity - 1)}
          aria-label={`Уменьшить количество: ${product.name}`}
        >
          <Minus size={14} />
        </button>
        <span className="quantity-value" aria-live="polite">
          {quantity}
        </span>
        <button
          className="quantity-button"
          disabled={disabled || quantity >= MAX_QUANTITY}
          onClick={() => setQuantity(product.id, quantity + 1)}
          aria-label={`Увеличить количество: ${product.name}`}
        >
          <Plus size={14} />
        </button>
      </div>
      {includeButton && (
        <Link className="button button-pink" to="/cart">
          <ShoppingCart size={17} />
          {compact ? 'В корзине' : `В корзине ${quantity} шт.`}
        </Link>
      )}
    </div>
  );
}

export function ProductCard({product, carousel = false}) {
  const {showModal} = useShop();
  return (
    <article className={`product-card ${carousel ? 'carousel-card' : ''}`}>
      <button
        className="card-open"
        onClick={() => showModal({kind: 'product', product})}
        aria-label={`Подробнее: ${product.name}`}
      >
        <div className="product-image">
          <img src={product.image} alt={product.name} loading="lazy" />
          <Labels product={product} />
        </div>
        <strong className="product-price">{money(product.price)}</strong>
        <span className="product-name">{product.name}</span>
        <Rating value={product.rating} />
      </button>
      {!carousel && (
        <div className="card-actions">
          <Quantity product={product} includeButton compact />
        </div>
      )}
    </article>
  );
}

export function Carousel({title, text, icon, products}) {
  const [position, setPosition] = useState(0);
  const {user} = useShop();
  const navigate = useNavigate();
  if (!products.length) {
    return null;
  }
  const cards = Array.from(
    {length: Math.min(3, products.length)},
    (_, i) => products[(position + i) % products.length],
  );
  // On the public landing page, detailed catalogue access goes through login.
  return (
    <section className="showcase" aria-label={title}>
      <div className="showcase-intro">
        {icon}
        <h2>{title}</h2>
        <p>{text}</p>
      </div>
      <div className="carousel-area">
        <button
          className="carousel-arrow previous"
          aria-label={`Предыдущие товары: ${title}`}
          onClick={() =>
            setPosition((n) => (n - 1 + products.length) % products.length)
          }
        >
          <ChevronLeft />
        </button>
        <div className="carousel-grid">
          {cards.map((p) =>
            user ? (
              <ProductCard product={p} carousel key={p.id} />
            ) : (
              <article className="product-card carousel-card" key={p.id}>
                <button
                  className="card-open"
                  onClick={() => navigate('/login')}
                  aria-label={`Войти, чтобы посмотреть: ${p.name}`}
                >
                  <div className="product-image">
                    <img src={p.image} alt={p.name} loading="lazy" />
                    <Labels product={p} />
                  </div>
                  <strong className="product-price">{money(p.price)}</strong>
                  <span className="product-name">{p.name}</span>
                  <Rating value={p.rating} />
                </button>
              </article>
            ),
          )}
        </div>
        <button
          className="carousel-arrow next"
          aria-label={`Следующие товары: ${title}`}
          onClick={() => setPosition((n) => (n + 1) % products.length)}
        >
          <ChevronRight />
        </button>
      </div>
    </section>
  );
}

function ProductDetails({product}) {
  return (
    <div className="product-details">
      <div className="details-image">
        <img src={product.image} alt={product.name} />
        <Labels product={product} />
      </div>
      <div className="details-content">
        <h2 id="modal-title">{product.name}</h2>
        <Rating value={product.rating} />
        <p className="details-description">{product.description}</p>
        <h3>Характеристики</h3>
        <dl className="specifications">
          {product.specifications.map((s) => (
            <div key={s.name}>
              <dt>{s.name}</dt>
              <dd>{s.value}</dd>
            </div>
          ))}
        </dl>
        <div className="details-purchase">
          <strong>{money(product.price)}</strong>
          <Quantity product={product} includeButton />
        </div>
      </div>
    </div>
  );
}

export function ModalHost() {
  const {modal, closeModal} = useShop();
  const dialog = useRef(null);
  useEffect(() => {
    if (!modal) {
      return;
    }
    const previous = document.activeElement;
    const element = dialog.current;
    element.showModal();
    return () => {
      element.close();
      if (previous?.isConnected) {
        previous.focus();
      }
    };
  }, [modal]);
  if (!modal) {
    return null;
  }
  return (
    <dialog
      ref={dialog}
      className={`modal ${modal.kind === 'product' ? 'product-modal' : ''}`}
      aria-labelledby="modal-title"
      onCancel={closeModal}
      onClick={(e) => {
        if (e.target === dialog.current) {
          const r = e.currentTarget.getBoundingClientRect();
          if (
            e.clientX < r.left ||
            e.clientX > r.right ||
            e.clientY < r.top ||
            e.clientY > r.bottom
          ) {
            closeModal();
          }
        }
      }}
    >
      <button
        className="modal-close icon-button"
        onClick={closeModal}
        aria-label="Закрыть окно"
        autoFocus
      >
        <X size={22} />
      </button>
      {modal.kind === 'product' ? (
        <ProductDetails product={modal.product} />
      ) : (
        <>
          {modal.kind === 'success' && (
            <div className="success-icon">
              <CircleCheck size={40} />
            </div>
          )}
          <h2 id="modal-title">{modal.title}</h2>
          <p className="modal-message">{modal.text}</p>
          <div className="modal-actions">
            {modal.kind === 'confirm' && (
              <button className="button button-text" onClick={closeModal}>
                Отмена
              </button>
            )}
            <button
              className="button button-blue"
              onClick={() => {
                modal.action?.();
                closeModal();
              }}
            >
              {modal.confirmText || 'Ок'}
            </button>
          </div>
        </>
      )}
    </dialog>
  );
}

export function EmptyState({history = false}) {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <ShoppingBasket size={72} strokeWidth={1.5} />
        <span>0</span>
      </div>
      <h2>{history ? 'Заказов пока нет' : 'Пока пусто'}</h2>
      <p>
        {history ? (
          'Ваши покупки появятся здесь после оформления заказа.'
        ) : (
          <>
            Ознакомьтесь с новинками и хитами на главной
            <br />
            или найдите нужное в каталоге
          </>
        )}
      </p>
      <div className="empty-actions">
        <Link className="button button-blue" to="/catalog">
          Перейти в каталог
        </Link>
        <Link className="button button-text" to="/">
          Главная страница
        </Link>
      </div>
    </div>
  );
}

export function Field({name, label, error, required, children, ...props}) {
  return (
    <div className={`field ${error ? 'has-error' : ''}`}>
      <label htmlFor={name}>
        {label}
        {required && <span className="required"> *</span>}
      </label>
      {children || (
        <input
          id={name}
          name={name}
          aria-required={required || undefined}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${name}-error` : undefined}
          {...props}
        />
      )}
      {error && (
        <span id={`${name}-error`} className="field-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
