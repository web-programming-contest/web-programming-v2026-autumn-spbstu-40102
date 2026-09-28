import { type Dispatch, type SetStateAction, useEffect, useRef } from "react";
import noUiSlider, { type API } from "nouislider";
import "nouislider/dist/nouislider.css";
import styles from "./PriceSlider.module.scss"

interface PriceSliderProps {
    price: { min: number; max: number };
    setPrice: Dispatch<SetStateAction<{ min: number; max: number }>>;
    min: number;
    max: number;
}

export default function PriceSlider({ price, setPrice, min, max }: PriceSliderProps) {
    const sliderRef = useRef<HTMLDivElement>(null);
    const sliderInstance = useRef<API | null>(null);
    const isInternalUpdate = useRef(false);

    useEffect(() => {
        if (!sliderRef.current) return;

        const instance = noUiSlider.create(sliderRef.current, {
            start: [price.min, price.max],
            connect: true,
            range: { min, max },
            step: 1,
        });

        sliderInstance.current = instance;

        instance.on("update", (values) => {
            isInternalUpdate.current = true;
            setPrice({
                min: Number(values[0]),
                max: Number(values[1]),
            });
        });

        return () => {
            instance.destroy();
            sliderInstance.current = null;
        };
    }, [max]);

    useEffect(() => {
        if (isInternalUpdate.current) {
            isInternalUpdate.current = false;
            return;
        }
        sliderInstance.current?.set([price.min, price.max]);
    }, [price.min, price.max]);

    return (
        <div className={styles.slider}>
            <div ref={sliderRef} className={styles.slider}/>
        </div>
        )
}