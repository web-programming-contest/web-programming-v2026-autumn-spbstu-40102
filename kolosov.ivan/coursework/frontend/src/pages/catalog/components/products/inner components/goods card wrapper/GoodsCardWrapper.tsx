import GoodsCard from "../../../../../../shared/goods card/GoodsCard.tsx";
import type {Product} from "../../../../../../dtos/Product.ts";
import styles from "./GoodsCardWrapper.module.scss"
import ToCartButton from "../../../../../../shared/to cart button/ToCartButton.tsx";
import type {Dispatch, SetStateAction} from "react";


function GoodsCardWrapper({product, onClick}: {product: Product, onClick: Dispatch<SetStateAction<Product | undefined>>}) {
    return (
        <div className={styles.card} onClick={() => onClick(product)}>
            <GoodsCard product={product} disableHover={true}/>
            <ToCartButton product={product} isReversed={false}/>
        </div>
    )
}

export default GoodsCardWrapper
