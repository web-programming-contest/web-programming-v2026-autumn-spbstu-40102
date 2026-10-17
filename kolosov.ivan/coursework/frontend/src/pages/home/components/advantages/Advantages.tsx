import styles from "./Advantages.module.scss"

function Advantages() {

    return (
        <div className={styles.advantages}>
            <p>Преимущества</p>
            <div className={styles.wrapper}>
                <div className={styles.greyRectangle}>
                    <img src="src/assets/images/icons/rocket.png" alt="Rocket img"/>
                    <p>Утром заказали, вечером получили</p>
                </div>
                <div className={styles.greyRectangle}>
                    <img src="src/assets/images/icons/refund.png" alt="Refund img"/>
                    <p>С товаром что-то не так? Вернем деньги</p>
                </div>
                <div className={styles.greyRectangle}>
                    <img src="src/assets/images/icons/secrtificate.png" alt="Secrtificate img"/>
                    <p>Только оригинальные товары</p>
                </div>
            </div>
        </div>

    )
}

export default Advantages
