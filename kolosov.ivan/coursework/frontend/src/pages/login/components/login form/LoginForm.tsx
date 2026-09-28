import styles from "./LoginForm.module.scss"
import {useState} from "react"
import * as React from "react"
import {useNavigate} from "react-router-dom"
import {checkCredentials} from "../../api/Login.ts"
import {useAuth} from "../../../../shared/contexts/AuthContext.tsx"
import {ApiError} from "../../types.ts";

type FormErrors = {
    login?: string
    password?: string
}

function LoginForm() {
    const { setIsLoggedIn, logIn } = useAuth()
    const navigate = useNavigate()

    const [errors, setErrors] = useState<FormErrors>({})


    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()

        setErrors({})
        const newErrors: FormErrors = {}

        const formData = new FormData(e.currentTarget)
        const login = formData.get("login") as string
        const password = formData.get("password") as string


        if (login.length === 0) {
            newErrors.login = "Заполните обязательное поле"
        }

        if (password.length === 0) {
            newErrors.password = "Заполните обязательное поле"
        }

        if (newErrors.login || newErrors.password) {
            setErrors(newErrors)
            return
        }

        try {
            const clientId = await checkCredentials(login, password)
            logIn(clientId)
            setIsLoggedIn(true)
            navigate("/")
        } catch (err) {
            setErrors(
                {login: err instanceof ApiError
                        ? err.message
                        : 'Something went wrong. Please try again.',
                password: err instanceof ApiError
                    ? err.message
                    : 'Something went wrong. Please try again.'}
            );
        }
    }

    return (
        <div className={styles.loginForm}>
            <form onSubmit={handleSubmit}>
                <div className={styles.wrapper}>
                    <p>Логин</p>
                    <input
                        type="text"
                        name="login"
                        placeholder="login"
                        className={errors.login ? styles.error : ""}
                    />
                    <span>*</span>
                    {errors.login && <p className={styles.errorText}>{errors.login}</p>}
                </div>
                <div className={styles.wrapper}>
                    <p>Пароль</p>
                    <input
                        type="password"
                        name="password"
                        placeholder="password"
                        className={errors.password ? styles.error : ""}
                    />
                    <span>*</span>
                    {errors.password && <p className={styles.errorText}>{errors.password}</p>}
                </div>
                <button>Войти</button>
            </form>
        </div>
    )
}

export default LoginForm
