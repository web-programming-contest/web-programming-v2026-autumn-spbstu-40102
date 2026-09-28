import styles from './Order.module.scss'
import Select from "../select/Select.tsx"
import {useState} from "react"
import type {CartItem} from "../../../../../../dtos/CartItem.ts"
import * as React from "react"
import {useAuth} from "../../../../../../shared/contexts/AuthContext.tsx";
import {postNewOrder} from "../../../../api/CartPageAPI.ts";
import {IMaskInput} from "react-imask";

type FormErrors = {
    phone?: string
    address?: string
    paymentMethod?: string
}

function Order({items, onSuccess, setOrderId}: {items: CartItem[], onSuccess: () => void, setOrderId: (orderId: number) => void}) {
    const { getClientId } = useAuth()

    const [paymentMethod, setPaymentMethod] = useState<string | null>(null)
    const [isToTheDoor, setIsToTheDoor] = useState<boolean>(false)
    const [rawPhone, setRawPhone] = useState("")
    const [errors, setErrors] = useState<FormErrors>({})

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()

        setErrors({})
        const newErrors: FormErrors = {}
        let toAbort: boolean = false

        const clientId = getClientId()

        const formData = new FormData(e.currentTarget)
        let email: string | null = formData.get("email") as string
        if (email.length === 0) {
            email = null
        }
        const phone = rawPhone
        const address = isToTheDoor ? (formData.get("address") as string) : null
        const isCash = paymentMethod === "Наличные"
        const isPackageRequired = formData.get("packaging") === "on"

        const productsAmount = items.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

        const productsJson = JSON.stringify(items)

        if (phone.length != 11) {
            newErrors.phone = "Введите корректный номер телефона"
            toAbort = true
        }

        if (!paymentMethod) {
            newErrors.paymentMethod = "Выберите способ оплаты"
            toAbort = true
        }

        if (isToTheDoor && !address) {
            newErrors.address = "Укажите адрес доставки"
            toAbort = true
        }

        if (toAbort) {
            setErrors(newErrors)
            return
        }

        try {
            const orderId = await postNewOrder({
                clientId: clientId,
                products: productsJson,
                productsAmount: productsAmount,
                totalPrice: totalPrice,
                email: email,
                phone: phone,
                address: address,
                isCash: isCash,
                isPackagingRequired: isPackageRequired
            })
            setOrderId(orderId)
        }
        catch (err) {
            console.log(err)
        }

        onSuccess()
    }

    return (
        <>
            <p className={styles.title}>Оформление заказа</p>
            <form className={styles.order} onSubmit={handleSubmit}>
                <div className={styles.contactData}>
                    <label>
                        <span>Телефон</span>
                        <IMaskInput
                            mask="8 (000) 000-00-00"
                            placeholder="8 (XXX) XXX-XX-XX"
                            unmask={true}
                            onAccept={(value) => setRawPhone("8" + value)}
                            className={errors.phone ? styles.errorInput : ""}
                        />
                        {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
                        <span className={styles.star}>*</span>
                    </label>
                    <label>
                        <span>E-mail</span>
                        <input name="email" placeholder="example@gmail.com"/>
                    </label>
                </div>
                <div className={styles.deliveryType}>
                    <label>
                        <input type="radio" name="delivery-type" checked={!isToTheDoor} onChange={() => setIsToTheDoor(false)}></input>
                        <span>Самовывоз</span>
                    </label>
                    <label>
                        <input type="radio" name="delivery-type" checked={isToTheDoor} onChange={() => setIsToTheDoor(true)}></input>
                        <span>Доставка</span>
                    </label>
                </div>
                {isToTheDoor &&
                    <label className={styles.delivery}>
                        <span>Адрес доставки</span>
                        <input name="address" placeholder="Улица Шишкина 128" className={errors.address ? styles.errorInput : ""}/>
                        <span className={styles.star}>*</span>
                        {errors.address && <span className={styles.errorText}>{errors.address}</span>}
                    </label>}
                <div className={styles.dropdown}>
                    <Select options={["Наличные", "Банковская карта"]} value={paymentMethod} placeholder={"Не выбрано"} onChange={setPaymentMethod} error={errors.paymentMethod}/>
                    <span className={styles.star}>*</span>
                    {errors.paymentMethod && <span className={styles.errorText}>{errors.paymentMethod}</span>}
                </div>
                <label className={styles.package}>
                    <input type="checkbox" name="packaging"></input>
                    <span>Нужна упаковка</span>
                </label>
                <button className={styles.blueButton}>Оформить заказ</button>
            </form>
        </>
    )
}

export default Order