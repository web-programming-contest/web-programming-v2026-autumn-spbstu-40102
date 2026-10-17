import styles from "./Popup.module.scss"
import type {Product} from "../../../../dtos/Product.ts";
import ToCartButton from "../../../../shared/to cart button/ToCartButton.tsx";
import type {Dispatch, SetStateAction} from "react";

function Popup({product, onClick}: {product: Product, onClick: Dispatch<SetStateAction<Product | undefined>>}) {
    return (
        <div className={styles.popup}>
            <div className={styles.bg}>
            </div>
            <div className={styles.card}>
                <button onClick={ () => onClick(undefined)} className={styles.cross}>
                    <img src="src/assets/images/icons/cross.png" alt="cross image"/>
                </button>
                <div className={styles.wrapper}>
                    <div className={styles.productImgContainer}>
                        <img src={product.image} alt="product img" className={styles.productImg}/>
                    </div>
                    <div className={styles.content}>
                        <div className={styles.title}>
                            <p>{product.title}</p>
                            <div className={styles.stars}>
                                <img src="src/assets/images/icons/star.png" alt="star image"/>
                                <span>{product.stars}</span>
                            </div>
                        </div>
                        <span className={styles.description}>{product.text}</span>
                        <div className={styles.specs}>
                            <p>Характеристики</p>
                            {Object.entries(product.specs).map(([key, value]) => (
                                <div className={styles.specsRow} key={key}>
                                    <span className={styles.specsLabel}>{key}</span>
                                    <span className={styles.specsLine}/>
                                    <span className={styles.specsValue}>{value}</span>
                                </div>
                            )) }
                        </div>
                        <p className={styles.price}>{product.price}₽</p>
                    </div>
                </div>
                <ToCartButton product={product} isReversed={true}/>
            </div>
        </div>
    )
}

export default Popup