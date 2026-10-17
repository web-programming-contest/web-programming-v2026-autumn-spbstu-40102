import styles from "./Footer.module.scss"

function Footer() {
    return (
        <div className={styles.footer}>
            <div className="container">
                <div className={styles.container}>
                    <div className={styles.links}>
                        <div>
                            <p className={styles.logo}>Gadget Hub</p>
                        </div>
                        <a href="tel:8 800 555 35 35" className={styles.phone}>
                            <img src="src/assets/images/icons/mobile-blue.svg" alt="Phone icon"/>
                            8 (800) 555 35 35
                        </a>
                        <div className={styles.socials}>
                            <a href="https://www.youtube.com/watch?v=eTQvtx1T3Tg">
                                <img src="src/assets/images/social icons/vk.png" alt="VK icon"/>
                            </a>
                            <a href="https://www.youtube.com/watch?v=eTQvtx1T3Tg">
                                <img src="src/assets/images/social icons/telegram.png" alt="Telegram icon"/>
                            </a>
                            <a href="https://www.youtube.com/watch?v=eTQvtx1T3Tg">
                                <img src="src/assets/images/social icons/whatsapp.png" alt="Whatsapp icon"/>
                            </a>
                        </div>
                    </div>
                    <div className={styles.belowText}>
                        <p className={styles.description}>Магазин надежных гаджетов</p>
                        <p>© 2024 ООО “Гаджет Хаб”. Все права защищены</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer