import styles from "./Sidebar.module.scss"
import { productTypes, colours } from "./SidebarData";
import * as React from "react";
import { type Dispatch, type SetStateAction, useRef, useState } from "react";
import type { Filters } from "../../../../dtos/Filters.ts";
import PriceSlider from "./inner components/price slider/PriceSlider.tsx";
import CheckBoxes from "./inner components/checkboxes/CheckBoxes.tsx";

function Sidebar({onApply, minPrice, maxPrice}: {onApply: Dispatch<SetStateAction<Filters>>, minPrice: number, maxPrice: number}) {
    const [price, setPrice] = useState({ min: minPrice, max: maxPrice });
    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);

        onApply({
            colours: form.getAll("colours") as string[],
            types: form.getAll("types") as string[],
            lowest_price: price.min,
            highest_price: price.max
        });
    };

    const handleReset = () => {
        formRef.current?.reset();
        setPrice({ min: minPrice, max: maxPrice });

        onApply({
            colours: [],
            types: [],
            lowest_price: minPrice,
            highest_price: maxPrice
        });
    };

    return (
        <div className={styles.sidebar}>
            <form ref={formRef} onSubmit={handleSubmit}>
                <p>Цена, ₽</p>
                <div className={styles.price}>
                    <div className={styles.priceInputs}>
                        <div className={styles.priceInput}>
                            <span>От</span>
                            <input
                                name="lowest_price"
                                type="number"
                                value={price.min}
                                onChange={(e) => {
                                    const value = Number(e.target.value);
                                    setPrice((prev) => ({
                                        ...prev,
                                        min: Math.min(value, prev.max)
                                    }));
                                }}
                            />
                        </div>
                        <div className={styles.priceInput}>
                            <span>До</span>
                            <input
                                name="highest_price"
                                type="number"
                                value={price.max}
                                onChange={(e) => {
                                    const value = Number(e.target.value);
                                    setPrice((prev) => ({
                                        ...prev,
                                        max: Math.max(value, prev.min)
                                    }));
                                }}
                            />
                        </div>
                    </div>
                    <PriceSlider price={price} setPrice={setPrice} min={minPrice} max={maxPrice} />
                </div>
                <p>Тип товара</p>
                <CheckBoxes toShow={productTypes} name="types"/>
                <p>Цвет</p>
                <CheckBoxes toShow={colours} name="colours"/>
                <div className={styles.buttons}>
                    <button type="submit" className={styles.show}>Показать</button>
                    <button type="button" className={styles.reset} onClick={handleReset}>Сбросить</button>
                </div>
            </form>
        </div>
    )
}

export default Sidebar