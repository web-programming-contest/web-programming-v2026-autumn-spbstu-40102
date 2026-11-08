import mobileIcon from '@/assets/icons/mobile.svg';
import vkIcon from '@/assets/images/social/vk.png';
import telegramIcon from '@/assets/images/social/telegram.png';
import whatsappIcon from '@/assets/images/social/whatsapp.png';
import styles from './Footer.module.scss';

const PHONE = '8 (800) 678-34-24';
const PHONE_HREF = 'tel:88006783424';

const SOCIALS = [
  {name: 'ВКонтакте', href: 'https://vk.com', icon: vkIcon},
  {name: 'Telegram', href: 'https://t.me', icon: telegramIcon},
  {name: 'WhatsApp', href: 'https://www.whatsapp.com', icon: whatsappIcon},
];

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`wrapper ${styles.inner}`}>
        <div className={styles.brand}>
          <p className={styles.logo}>Gadget Hub</p>
          <p className={styles.slogan}>Магазин надежных гаджетов</p>
        </div>

        <div>
          <a href={PHONE_HREF} className={styles.phone}>
            <span
              className={styles.phoneIcon}
              style={{
                maskImage: `url(${mobileIcon})`,
                WebkitMaskImage: `url(${mobileIcon})`,
              }}
              aria-hidden="true"
            />
            {PHONE}
          </a>
        </div>

        <ul className={styles.socials}>
          {SOCIALS.map(({name, href, icon}) => (
            <li key={name}>
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={name}
                className={styles.social}
              >
                <img src={icon} alt={name} />
              </a>
            </li>
          ))}
        </ul>

        <p className={styles.copyright}>
          © 2024 ООО “Гаджет Хаб”. Все права защищены
        </p>
      </div>
    </footer>
  );
}
