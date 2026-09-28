import { createContext, useContext, useState } from "react"
import * as React from "react"
import type {Product} from "../../dtos/Product.ts";
import type {CartItem} from "../../dtos/CartItem.ts";

interface CartContextType {
    items: CartItem[],
    addProduct: (product: Product) => void,
    changeProductQuantity: (product: Product, newQuantity: number) => void,
    deleteProduct: (productId: number) => void,
    deleteProducts: (productIds: Set<number>) => void,
    clearCart: () => void,
    getProductQuantity: (product: Product) => number,
    getQuantity: () => number,
    getItems: () => CartItem[]
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({children}: {children: React.ReactNode}) {
    const [items, setItems] = useState<CartItem[]>(() => {
        const raw = localStorage.getItem("items")
        return raw ? JSON.parse(raw) : []
    })

    const addProduct = (product: Product) => {
        const updatedItems = [...items, { product, quantity: 1 }]

        localStorage.setItem("items", JSON.stringify(updatedItems))
        setItems(updatedItems)
    }

    const changeProductQuantity = (product: Product, newQuantity: number) => {
        const updatedItems = items.map((item) =>
            item.product.id === product.id ? {...item, quantity: newQuantity} : item
        )

        localStorage.setItem("items", JSON.stringify(updatedItems))
        setItems(updatedItems)
    }

    const deleteProduct = (productId: number) => {
        const updatedItems = items.filter((item) =>
            item.product.id !== productId
        )

        localStorage.setItem("items", JSON.stringify(updatedItems))
        setItems(updatedItems)
    }

    const deleteProducts = (productIds: Set<number>) => {
        const updatedItems = items.filter((item) =>
            !productIds.has(item.product.id)
        )

        localStorage.setItem("items", JSON.stringify(updatedItems))
        setItems(updatedItems)
    }

    const clearCart = () => {
        localStorage.setItem("items", "[]")
        setItems([])
    }

    const getProductQuantity = (product: Product) => {
        return items.find((item) => item.product.id === product.id)?.quantity ?? 0
    }

    const getQuantity = () => {
        return items.reduce((sum, n) => sum + n.quantity, 0)
    }

    const getItems = () => {
        return items
    }

    return (
        <CartContext.Provider value={{items, addProduct, changeProductQuantity, deleteProduct, deleteProducts, clearCart, getProductQuantity, getQuantity, getItems}}>
            {children}
        </CartContext.Provider>
    )
}
export function useCart() {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }

    return context;
}

