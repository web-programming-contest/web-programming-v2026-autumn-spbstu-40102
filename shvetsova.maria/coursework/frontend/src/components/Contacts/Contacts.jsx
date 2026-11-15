import phoneIcon from '@/assets/icons/phone.svg';
import mailIcon from '@/assets/icons/mail.svg';
import pinIcon from '@/assets/icons/pin.svg';
import styles from './Contacts.module.scss';

const CONTACTS = [
  {icon: phoneIcon, text: '8 (800) 678-34-24', href: 'tel:88006783424'},
  {icon: mailIcon, text: 'gadget@hub.ru', href: 'mailto:gadget@hub.ru'},
  {icon: pinIcon, text: 'Санкт-Петербург, ул. Барочная, д.7, корпус 2'},
];

export function Contacts() {
  return (
    <section className={styles.section}>
      <h2 className={`h1 ${styles.title}`}>Работаем 24/7</h2>

      <ul className={styles.list}>
        {CONTACTS.map(({icon, text, href}) => {
          const content = (
            <>
              <img className={styles.icon} src={icon} alt={text} />
              <span className={`h2 ${styles.text}`}>{text}</span>
            </>
          );

          return (
            <li key={text} className={styles.inner}>
              {href ? (
                <a className={styles.item} href={href}>
                  {content}
                </a>
              ) : (
                <div className={styles.item}>{content}</div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
