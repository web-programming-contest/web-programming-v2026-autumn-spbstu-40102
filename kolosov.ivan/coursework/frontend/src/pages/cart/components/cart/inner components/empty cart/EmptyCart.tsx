import styles from "./EmptyCart.module.scss";
import {useNavigate} from "react-router-dom";

function EmptyCart() {
    const navigate = useNavigate()

    return (
        <div className={styles.emptyCart}>
            <img src="src/assets/images/icons/empty-cart.png" alt="Empty cart img"/>
            <p>Пока пусто</p>
            <span>Ознакомьтесь с новинками и хитами на главной или найдите нужное в каталоге</span>
            <div className={styles.buttons}>
                <button className={styles.toCart} onClick={() => navigate("../catalog")}>Перейти в каталог</button>
                <button className={styles.toHome} onClick={() => navigate("../")}>Главная страница</button>
            </div>
        </div>
    )
}

export default EmptyCart