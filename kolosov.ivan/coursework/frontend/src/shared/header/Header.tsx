import {Link, NavLink} from "react-router-dom";

import styles from "./Header.module.scss"
import {useAuth} from "../contexts/AuthContext.tsx";
import {useCart} from "../contexts/CartContext.tsx";


function Header() {
    const { isLoggedIn, setIsLoggedIn, logout } = useAuth()
    const { clearCart, getQuantity } = useCart()

    const quantity = getQuantity()

    const handleLogout = () => {
        logout()
        clearCart()
        setIsLoggedIn(false)
    }

    const linkClassName = ({ isActive }: { isActive: boolean }) =>
        isActive ? `${styles.link} ${styles.active}` : styles.link

    return (
        <div className={styles.header}>
            <div className="container">
                <div className={styles.container}>
                    <Link to="/" className={styles.logo} ><p className={styles.first}>Gadget</p> <p className={styles.second}>Hub</p></Link>
                    <div className={styles.pages}>
                        <NavLink to="/catalog" className={linkClassName}>
                            <img src="src/assets/images/icons/catalog.svg" alt="Catalog icon"/>
                            <p>Каталог</p>
                        </NavLink>
                        {isLoggedIn && <NavLink to="/cart" className={linkClassName}>
                            <img src="src/assets/images/icons/cart.svg" alt="Cart icon"/>
                            <p>Корзина</p>
                            {quantity !== 0 && <div className={styles.quantity}>{quantity}</div>}
                        </NavLink>}
                        {!isLoggedIn && <NavLink to="/login" className={linkClassName}>
                            <img src="src/assets/images/icons/profile.svg" alt="Login icon"/>
                            <p>Войти</p>
                        </NavLink>}
                        {isLoggedIn && <button className={styles.link} onClick={() => { handleLogout() }}>
                            <img src="src/assets/images/icons/profile.svg" alt="Loout icon"/>
                            <p>Выйти</p>
                        </button>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header