import type {Product} from "../../../../dtos/Product.ts"
import GoodsCardWrapper from "./inner components/goods card wrapper/GoodsCardWrapper.tsx"
import styles from "./Products.module.scss"
import {type Dispatch, type SetStateAction, useEffect, useMemo, useState} from "react"
import PagesButtons from "./inner components/PagesButtons/PagesButtons.tsx"
import {getPages} from "./utils/Pagination.ts"
import Arrow from "../../../../shared/arrow/Arrow.tsx";
import {getAllProductsRequest} from "../../api/CatalogPageAPI.ts";
import {sortAsc, sortBestseller, sortDesc, sortNew} from "./utils/Sorts.ts";
import type {Filters} from "../../../../dtos/Filters.ts";

const CARDS_PER_PAGE = 9

function Products({sortType, filters, onClick}: {sortType: number, filters: Filters, onClick: Dispatch<SetStateAction<Product | undefined>>}) {
    const [products, setProducts] = useState<Product[]>([])
    const [filteredProducts, setFilteredProducts] = useState<Product[]>(products)
    const [currentPage, setCurrentPage] = useState(1)

    useEffect(() => {
        getAllProductsRequest()
            .then(setProducts)
            .catch((err) => console.error(err));
    }, [])

    const getFilteredProducts = () => {
        const productsFilteredByPrice = products.filter(product => product.price >= filters.lowest_price && product.price <= filters.highest_price)
        if (filters.colours.length === 0 && filters.types.length === 0) return productsFilteredByPrice
        else if (filters.colours.length === 0) return productsFilteredByPrice.filter(product => filters.types.includes(product.type))
        else if (filters.types.length === 0) return productsFilteredByPrice.filter(product => filters.colours.includes(product.colour))
        return productsFilteredByPrice.filter(product => filters.types.includes(product.type) && filters.colours.includes(product.colour))
    }

    useEffect(() => {
        setFilteredProducts(getFilteredProducts)
        setCurrentPage(1)
    }, [filters, products])

    const sortedProducts = useMemo(() => {
        switch (sortType) {
            case 1:
                return sortNew(filteredProducts)
            case 2:
                return sortBestseller(filteredProducts)
            case 3:
                return sortAsc(filteredProducts)
            case 4:
                return sortDesc(filteredProducts)
            default:
                return filteredProducts
        }
    }, [filteredProducts, sortType]);

    const totalPages = Math.ceil(filteredProducts.length / CARDS_PER_PAGE)

    const startIndex = (currentPage - 1) * CARDS_PER_PAGE
    const endIndex = startIndex + CARDS_PER_PAGE
    const currentProducts = sortedProducts.slice(startIndex, endIndex)

    return (
        <div className={styles.wrapper}>
            { totalPages === 0 && <p>По данному запросу ничего не нашлось :(</p>}
            <div className={styles.products}>
                {currentProducts.map(product =>
                    <GoodsCardWrapper key={product.id} product={product} onClick={onClick}/>
                )}
            </div>
            <div className={styles.pageButtons}>
                <div className={styles.leftArrow}>
                    { (totalPages > 0 && currentPage !== 1) && <Arrow isForward={false} onClick={() => setCurrentPage(currentPage - 1)}/>}
                </div>
                <PagesButtons currentPage={currentPage} pagesToShow={getPages(currentPage, totalPages)} onClick={setCurrentPage}/>
                <div className={styles.rightArrow}>
                    { (totalPages > 0 && currentPage !== totalPages) && <Arrow isForward={true} onClick={() => setCurrentPage(currentPage + 1)}/>}
                </div>
            </div>
        </div>
    )
}

export default Products
