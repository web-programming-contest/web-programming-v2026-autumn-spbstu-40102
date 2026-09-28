import styles from "./ToCartButton.module.scss"
import {useCart} from "../contexts/CartContext.tsx";
import type {Product} from "../../dtos/Product.ts";
import * as React from "react";
import {useNavigate} from "react-router-dom";

function ToCartButton({product, isReversed}: {product: Product, isReversed: boolean}) {
    const {addProduct, getProductQuantity, changeProductQuantity, deleteProduct} = useCart()
    const navigate = useNavigate()

    const quantity = getProductQuantity(product);

    const handleAddingToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        addProduct(product)
    }

    const handleIncreasingQuantity = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        changeProductQuantity(product, quantity + 1)
    }

    const handleDecreasingQuantity = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        if (quantity - 1 === 0) deleteProduct(product.id)
        else changeProductQuantity(product, quantity - 1)
    }

    return (
        <>
            {quantity === 0 &&
                <button className={styles.toCartButton} onClick={handleAddingToCart}>
                    <img src="/src/assets/images/icons/cart-white.png" alt="Cart img"></img>
                    В корзину
                </button>
            }
            {quantity > 0 &&
                <div className={isReversed
                    ? `${styles.inCartButtonWrapper} ${styles.reversed}`
                    : styles.inCartButtonWrapper}>
                    <button className={styles.inCartButton} onClick={() => navigate('/cart')}>
                        <img src="/src/assets/images/icons/cart-white.png" alt="Cart img"></img>
                        {quantity} шт.
                    </button>
                    <div className={styles.quantity}>
                        <button onClick={handleDecreasingQuantity}>
                            -
                        </button>
                        <span>{quantity}</span>
                        <button onClick={handleIncreasingQuantity}>
                            +
                        </button>
                    </div>
                </div>
            }
        </>
    )
}

export default ToCartButton