import type {Product} from "../../../../../../dtos/Product.ts";
import styles from "./Goods.module.scss"
import {useCart} from "../../../../../../shared/contexts/CartContext.tsx";
import DeletePopup from "../../../delete popup/DeletePopup.tsx";
import {useState} from "react";

function Goods({product, quantity, checked, onToggle, onDelete}: {product: Product, quantity: number, checked: boolean, onToggle: () => void, onDelete: () => void}) {
    const { deleteProduct, changeProductQuantity } = useCart()
    const [isOpen, setIsOpen] = useState(false)

    const handleDelete = () => {
        deleteProduct(product.id)
        onDelete()
    }

    return (
        <>
            {isOpen && <DeletePopup text={"Вы действительно хотите удалить " + product.title + "?"} close={() => setIsOpen(false)} onDelete={handleDelete}/>}
            <label className={styles.goods}>
                <input type="checkbox" name={product.title} value={product.title} checked={checked} onChange={onToggle}/>
                <div className={styles.content}>
                    <div className={styles.imgContainer}>
                        <img src={product.image} alt="Goods img"/>
                    </div>
                    <div className={styles.wrapper}>
                        <span className={styles.title}>{product.title}</span>
                        <div className={styles.quantity}>
                            <button onClick={() => quantity === 1 ? setIsOpen(true) : changeProductQuantity(product, --quantity)}>
                                -
                            </button>
                            <span>{quantity}</span>
                            <button onClick={() => changeProductQuantity(product, ++quantity)}>
                                +
                            </button>
                        </div>
                        <span className={styles.price}>{product.price * quantity} ₽</span>
                        <button className={styles.delete} onClick={() => setIsOpen(true)}>
                            <img src="src/assets/images/icons/pink-cross.png" alt="Cross img"/>
                            <span>Удалить</span>
                        </button>
                    </div>
                </div>
            </label>
        </>
    )
}

export default Goods
