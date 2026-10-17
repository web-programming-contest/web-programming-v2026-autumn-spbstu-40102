import {useEffect, useState} from "react";
import {getClientsOrders} from "../../api/CartPageAPI.ts";
import {useAuth} from "../../../../shared/contexts/AuthContext.tsx";
import type {OrderSummary} from "../../../../dtos/OrderSummary.ts";
import styles from "./History.module.scss"

function History() {
    const { getClientId } = useAuth()
    const [orders, setOrders] = useState<OrderSummary[]>([])

    useEffect(() => {
        getClientsOrders(getClientId())
            .then(setOrders)
    }, [])

    const getEnding = (productsAmount: number) => {
        const absCount = Math.abs(productsAmount) % 100;
        const lastDigit = absCount % 10;

        if (absCount > 10 && absCount < 20) return "ов";
        if (lastDigit > 1 && lastDigit < 5) return "а";
        if (lastDigit === 1) return "";
        return "ов";
    }

    return (
        <>
            {orders.length !== 0 && <div className={styles.history}>
                {orders.map((order) =>
                    <>
                        <div className={styles.order}>
                            <span className={styles.date}>№ {order.id} от {order.createDate}</span>
                            <span className={styles.quantity}>{order.productsAmount} товар{getEnding(order.productsAmount)}</span>
                            <span className={styles.price}>{order.totalPrice} ₽</span>
                        </div>
                    </>
                )}
            </div>}
            {orders.length === 0 &&
                <div className={styles.emptyHistory}>
                    <p>История пуста</p>
                    <span>Вы ещё не совершали покупок</span>
                </div>}
        </>
    )
}

export default History
