import {useState} from 'react';
import {Button} from '@/components/Button/Button';
import {TextField} from '@/components/TextField/TextField';
import {Checkbox} from '@/components/Checkbox/Checkbox';
import {formatPrice, pluralize} from '@/utils/format';
import styles from './OrderForm.module.scss';

const INITIAL_VALUES = {
  phone: '',
  email: '',
  delivery: 'pickup',
  address: '',
  payment: '',
  packaging: false,
};

const DELIVERY_OPTIONS = [
  {value: 'pickup', label: 'Самовывоз'},
  {value: 'delivery', label: 'Доставка'},
];

const PAYMENT_OPTIONS = [
  {value: 'card', label: 'Картой'},
  {value: 'cash', label: 'Наличными'},
];

const PHONE_PATTERN = /^\+?[\d\s()-]{10,}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REQUIRED_MESSAGE = 'Заполните обязательное поле';

function validate(values) {
  const errors = {};

  if (!values.phone.trim()) {
    errors.phone = REQUIRED_MESSAGE;
  } else if (!PHONE_PATTERN.test(values.phone.trim())) {
    errors.phone = 'Введите корректный номер телефона';
  }

  if (values.email.trim() && !EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = 'Введите корректный email';
  }

  if (values.delivery === 'delivery' && !values.address.trim()) {
    errors.address = REQUIRED_MESSAGE;
  }

  if (!values.payment) {
    errors.payment = 'Выберите способ оплаты';
  }

  return errors;
}

export function OrderForm({
  totalCount,
  totalPrice,
  isSubmitting = false,
  onSubmit,
}) {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const {name, value, type, checked} = event.target;
    setValues((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrors((current) => ({...current, [name]: undefined}));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    onSubmit({
      ...values,
      phone: values.phone.trim(),
      email: values.email.trim(),
      address: values.delivery === 'delivery' ? values.address.trim() : '',
    });
  };

  const isEmpty = totalCount === 0;

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Оформление заказа</h2>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.fields}>
          <TextField
            label="Телефон"
            name="phone"
            type="tel"
            value={values.phone}
            onChange={handleChange}
            error={errors.phone}
          />
          <TextField
            label="E-mail"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            error={errors.email}
          />
        </div>

        <fieldset className={styles.radios}>
          <legend className={styles.hidden}>Способ получения</legend>
          {DELIVERY_OPTIONS.map((option) => (
            <label key={option.value} className={styles.radio}>
              <input
                className={styles.radioInput}
                type="radio"
                name="delivery"
                value={option.value}
                checked={values.delivery === option.value}
                onChange={handleChange}
              />
              <span className={styles.radioMark} aria-hidden="true" />
              {option.label}
            </label>
          ))}
        </fieldset>

        {values.delivery === 'delivery' && (
          <div className={styles.fields}>
            <TextField
              label="Адрес доставки"
              name="address"
              value={values.address}
              onChange={handleChange}
              error={errors.address}
            />
          </div>
        )}

        <label className={styles.selectField}>
          <span className={styles.label}>Способ оплаты</span>
          <span className={styles.selectBox}>
            <select
              className={`${styles.select} ${values.payment ? '' : styles.placeholder} ${errors.payment ? styles.invalid : ''}`}
              name="payment"
              value={values.payment}
              onChange={handleChange}
              aria-invalid={Boolean(errors.payment)}
            >
              <option value="" disabled>
                Не выбрано
              </option>
              {PAYMENT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </span>
          {errors.payment && (
            <span className={styles.error}>{errors.payment}</span>
          )}
        </label>

        <Checkbox
          label="Нужна упаковка"
          name="packaging"
          checked={values.packaging}
          onChange={handleChange}
        />

        <div className={styles.footer}>
          <p className={styles.total}>
            {totalCount} {pluralize(totalCount, ['товар', 'товара', 'товаров'])}{' '}
            на {formatPrice(totalPrice)}
          </p>
          <Button type="submit" disabled={isEmpty || isSubmitting}>
            {isSubmitting ? 'Оформляем…' : 'Оформить заказ'}
          </Button>
        </div>
      </form>
    </section>
  );
}
