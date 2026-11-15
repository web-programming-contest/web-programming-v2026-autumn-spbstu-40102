import rocketIcon from '@/assets/icons/rocket.svg';
import rubleIcon from '@/assets/icons/ruble.svg';
import certIcon from '@/assets/icons/cert.svg';
import styles from './Advantages.module.scss';

const ADVANTAGES = [
  {icon: rocketIcon, text: 'Утром заказали, вечером получили'},
  {icon: rubleIcon, text: 'С товаром что-то не так? Вернем деньги'},
  {icon: certIcon, text: 'Только оригинальные товары'},
];

export function Advantages() {
  return (
    <section className={styles.section}>
      <h2 className={`h1 ${styles.title}`}>Преимущества</h2>

      <ul className={styles.list}>
        {ADVANTAGES.map(({icon, text}) => (
          <li key={text} className={styles.card}>
            <img src={icon} alt={text} className={styles.icon} />
            <p className={`h2 ${styles.text}`}>{text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
