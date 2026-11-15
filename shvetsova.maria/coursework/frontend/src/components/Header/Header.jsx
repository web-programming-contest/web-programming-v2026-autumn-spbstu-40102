import {useState, useEffect} from 'react';
import {Link, useMatch, useNavigate} from 'react-router-dom';
import {useAuth} from '@/context/AuthContext';
import {useCart} from '@/context/CartContext';
import {Button} from '@/components/Button/Button';
import catalogIcon from '@/assets/icons/catalog.svg';
import cartIcon from '@/assets/icons/cart.svg';
import profileIcon from '@/assets/icons/profile.svg';
import styles from './Header.module.scss';

export function Header() {
  const {user, logout} = useAuth();
  const navigate = useNavigate();
  const {totalCount} = useCart();
  const isCatalog = Boolean(useMatch('/catalog'));
  const isCart = Boolean(useMatch('/cart'));

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);

    handleScroll();
    window.addEventListener('scroll', handleScroll, {passive: true});

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={`wrapper ${styles.inner}`}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoAccent}>Gadget</span> Hub
        </Link>

        <nav className={styles.nav}>
          <Button
            as={Link}
            to="/catalog"
            icon={catalogIcon}
            variant={isCatalog ? 'primary' : 'menu'}
            aria-current={isCatalog ? 'page' : undefined}
          >
            Каталог
          </Button>

          {user ? (
            <>
              <Button
                as={Link}
                to="/cart"
                icon={cartIcon}
                badge={totalCount}
                variant={isCart ? 'primary' : 'menu'}
                aria-current={isCart ? 'page' : undefined}
              >
                Корзина
              </Button>

              <Button variant="menu" icon={profileIcon} onClick={handleLogout}>
                Выйти
              </Button>
            </>
          ) : (
            <Button as={Link} to="/login" variant="menu" icon={profileIcon}>
              Войти
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
