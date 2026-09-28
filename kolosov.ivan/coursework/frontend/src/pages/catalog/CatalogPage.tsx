import {useAuth} from "../../shared/contexts/AuthContext.tsx";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import styles from "./CatalogPage.module.scss"
import Products from "./components/products/Products.tsx";
import Sidebar from "./components/sidebar/Sidebar.tsx";
import type {Filters} from "../../dtos/Filters.ts";
import {getMaxPrice} from "./api/CatalogPageAPI.ts";
import Popup from "./components/popup/Popup.tsx";
import type {Product} from "../../dtos/Product.ts";


function CatalogPage() {
    const {isLoggedIn} = useAuth()
    const [sortType, setSortType] = useState(1)
    const [maxPrice, setMaxPrice] = useState<number>(1000000)
    const [popupProduct, setPopupProduct] = useState<Product | undefined>()

    const [filters, setFilters] = useState<Filters>({
        colours: [],
        types: [],
        lowest_price: 0,
        highest_price: 1000000
    })

    const navigate = useNavigate()

    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login")
        }
    },[isLoggedIn, navigate])

    useEffect(() => {
        getMaxPrice()
            .then(setMaxPrice)
            .catch((err) => console.error(err));
    }, [])

    return (
        <>
            {popupProduct && <Popup product={popupProduct} onClick={setPopupProduct}/>}
            <div className="container">
                <div className={styles.catalog}>
                    <h1>Каталог товаров</h1>
                    <div className={styles.buttons}>
                        <button onClick={() => setSortType(1)} className={sortType === 1 ? styles.selected : undefined}>Новые</button>
                        <button onClick={() => setSortType(2)} className={sortType === 2 ? styles.selected : undefined}>Популярные</button>
                        <button onClick={() => setSortType(3)} className={sortType === 3 ? styles.selected : undefined}>Подешевле</button>
                        <button onClick={() => setSortType(4)} className={sortType === 4 ? styles.selected : undefined}>Подороже</button>
                    </div>
                    <div className={styles.wrapper}>
                        <Products sortType={sortType} filters={filters} onClick={setPopupProduct}/>
                        <Sidebar onApply={setFilters} minPrice={0} maxPrice={maxPrice}/>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CatalogPage
