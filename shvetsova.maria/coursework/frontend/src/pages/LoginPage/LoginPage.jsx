import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '@/context/AuthContext';
import {Modal} from '@/components/Modal/Modal';
import {TextField} from '@/components/TextField/TextField';
import {Button} from '@/components/Button/Button';
import styles from './LoginPage.module.scss';

const REQUIRED_MESSAGE = 'Заполните обязательное поле';

export function LoginPage() {
  const {login} = useAuth();
  const navigate = useNavigate();

  const [values, setValues] = useState({login: '', password: ''});
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const {name, value} = event.target;
    setValues((current) => ({...current, [name]: value}));
    setErrors((current) => ({...current, [name]: undefined}));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = {};
    if (!values.login.trim()) {
      nextErrors.login = REQUIRED_MESSAGE;
    }
    if (!values.password) {
      nextErrors.password = REQUIRED_MESSAGE;
    }
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      await login(values);
      navigate('/');
    } catch (error) {
      setServerError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={styles.page}>
      <div className={styles.content}>
        <h1 className={styles.title}>Добро пожаловать!</h1>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <TextField
            label="Логин"
            name="login"
            autoComplete="username"
            required
            value={values.login}
            onChange={handleChange}
            error={errors.login}
          />
          <TextField
            label="Пароль"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={values.password}
            onChange={handleChange}
            error={errors.password}
          />
          <Button type="submit" disabled={isSubmitting}>
            Войти
          </Button>
        </form>

        <Modal isOpen={Boolean(serverError)} onClose={() => setServerError('')}>
          <h2 className={styles.modalTitle}>Не удалось войти</h2>
          <p className={styles.modalText}>{serverError}</p>
          <Button onClick={() => setServerError('')}>Ок</Button>
        </Modal>
      </div>
    </section>
  );
}
