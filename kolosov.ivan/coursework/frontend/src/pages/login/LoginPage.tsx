import styles from "./LoginPage.module.scss"
import LoginForm from "./components/login form/LoginForm.tsx";
import {useAuth} from "../../shared/contexts/AuthContext.tsx";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";

function LoginPage() {
    const { isLoggedIn } = useAuth()

    const navigate = useNavigate()

    useEffect(() => {
            if (isLoggedIn) {
                navigate("/")
            }
        },[])

    return (
        <div className={styles.login}>
            <h1>Добро пожаловать!</h1>
            <LoginForm/>
        </div>
    )
}

export default LoginPage
