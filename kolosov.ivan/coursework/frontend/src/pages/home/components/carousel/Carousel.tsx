import Cards from "./inner components/cards/Cards.tsx";
import styles from "./Carousel.module.scss"
import type {Product} from "../../../../dtos/Product.ts";
import useEmblaCarousel from "embla-carousel-react";
import {useEffect, useState} from "react";
import {getAllProductsWithLabelRequest} from "../../api/Home.ts";
import Arrow from "../../../../shared/arrow/Arrow.tsx";



function Carousel({label}: {label: string}) {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        align: "start",
        watchDrag: false
    });

    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        getAllProductsWithLabelRequest(label)
            .then(setProducts)
            .catch((err) => console.error(err));
    }, [label]);

    return (
        <div className={styles.carousel}>
            <Arrow isForward={false} onClick={() => emblaApi?.scrollPrev()}/>
            <Cards toShow={products} emblaRef={emblaRef}/>
            <Arrow isForward={true} onClick={() => emblaApi?.scrollNext()}/>
        </div>
    )
}

export default Carousel
