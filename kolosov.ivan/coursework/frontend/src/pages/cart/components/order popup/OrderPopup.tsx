import styles from "./OrderPopup.module.scss"

function OrderPopup({orderId, close}: {orderId: number, close: () => void}) {
    return (
        <div className={styles.popup}>
            <div className={styles.bg}/>
            <div className={styles.card}>
                <img src="src/assets/images/icons/smile.png" alt="cross image" className={styles.smile}/>
                <button className={styles.cross} onClick={close}>
                    <img src="src/assets/images/icons/cross.png" alt="cross image"/>
                </button>
                <p>Спасибо за заказ!</p>
                <span>Номер заказа {orderId}.</span>
                <span>Мы свяжемся с вами в течение 10 минут, чтобы уточнить удобное для вас время доставки</span>
                <button className={styles.blueButton} onClick={close}>Ок</button>
            </div>
        </div>
    )
}

export default OrderPopup