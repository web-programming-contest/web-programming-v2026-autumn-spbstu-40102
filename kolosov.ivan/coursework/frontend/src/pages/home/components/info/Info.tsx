import styles from "./Info.module.scss"

function Info() {

    return (
        <div className={styles.info}>
            <p>Работаем 24/7</p>
            <div className={styles.wrapper}>
                <a href="tel:8 800 555 35 35" className={styles.link}>
                    <img src="src/assets/images/icons/mobile-black.png" alt="Phone icon"/>
                    <span>8 (800) 555 35 35</span>
                </a>
                <a href="mailto:daitemnexiao@bk.ru" className={styles.link}>
                    <img src="src/assets/images/icons/envelope.png" alt="Mail icon"/>
                    <span>gadget@hub.ru</span>
                </a>
                <a href="https://yandex.ru/maps/geo/posyolok_vesyolaya_zhizn/53021643/?ll=35.617739%2C53.360340&z=16" className={styles.link}>
                    <img src="src/assets/images/icons/spot.png" alt="Spot icon"/>
                    <span>Санкт-Петербург, ул. Барочная, д.7, корпус 2</span>
                </a>
            </div>
        </div>
    )
}

export default Info
