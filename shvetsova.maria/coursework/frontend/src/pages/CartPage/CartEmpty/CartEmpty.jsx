import {Link} from 'react-router-dom';
import {Button} from '@/components/Button/Button';
import emptyImage from '@/assets/images/cart-empty.svg';
import styles from './CartEmpty.module.scss';

export function CartEmpty() {
  return (
    <section className={styles.empty}>
      <img className={styles.image} src={emptyImage} alt="" />
      <h1 className={styles.title}>Пока пусто</h1>
      <p className={styles.text}>
        Ознакомьтесь с новинками и хитами на главной
        <br />
        или найдите нужное в каталоге
      </p>
      <div className={styles.actions}>
        <Button as={Link} to="/catalog">
          Перейти в каталог
        </Button>
        <Link to="/" className={styles.link}>
          Главная страница
        </Link>
      </div>
    </section>
  );
}
