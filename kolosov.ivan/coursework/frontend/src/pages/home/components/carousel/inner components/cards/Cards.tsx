import type {Product} from "../../../../../../dtos/Product.ts";
import GoodsCard from "../../../../../../shared/goods card/GoodsCard.tsx";
import styles from "./Cards.module.scss"

import type { EmblaViewportRefType } from "embla-carousel-react";

function Cards({toShow, emblaRef}:
               {
                   toShow: Product[];
                   emblaRef: EmblaViewportRefType
               }) {

    return (
        <div className={styles.viewport} ref={emblaRef}>
            <div className={styles.cardsWrapper}>
                {toShow.map(product =>
                    <GoodsCard key={product.id} product={product} disableHover={false}/>
                )}
            </div>
        </div>
    )
}

export default Cards
