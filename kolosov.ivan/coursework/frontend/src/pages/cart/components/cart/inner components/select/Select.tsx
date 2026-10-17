import { useState, useRef, useEffect } from "react";
import styles from "./Select.module.scss";

function Select({ options, value, placeholder, onChange, error }: {options: string[], value: string | null, placeholder: string, onChange: (value: string) => void, error: string | undefined}) {
    const [isOpen, setIsOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setIsOpen(false)
            }
        };
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, []);

    const handleSelect = (option: string) => {
        onChange(option)
        setIsOpen(false)
    };

    return (
        <div className={styles.select} ref={ref}>
            <span className={styles.title}>Способ оплаты</span>
            <button type="button" onClick={() => setIsOpen((prev) => !prev)} className={`${isOpen ? styles.buttonOpen : styles.buttonClosed} ${value ? styles.filled : styles.empty} ${error ? styles.errorInput : ""}`}>
                <span className={value ? styles.value : styles.placeholder}>
                    {value ?? placeholder}
                </span>
                <img src="src/assets/images/icons/drop-down-arrow.png" alt="Dropdown arrow img" className={`${styles.arrow} ${isOpen ? styles.open : ""}`}/>
            </button>

            {isOpen && (
                <ul className={styles.options}>
                    {options.map((option) => (
                        <li key={option} onClick={() => handleSelect(option)}>
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Select;