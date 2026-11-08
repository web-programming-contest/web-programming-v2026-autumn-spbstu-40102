import {Modal} from '@/components/Modal/Modal';
import {Button} from '@/components/Button/Button';
import styles from './RemoveModal.module.scss';

export function RemoveModal({items, onConfirm, onClose}) {
  const isOpen = items.length > 0;
  const text =
    items.length === 1
      ? `«${items[0].name}» будет удалён из корзины.`
      : `Будет удалено товаров: ${items.length}.`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="s">
      <div className={styles.content}>
        <h2 className={styles.title}>Вы уверены, что хотите удалить?</h2>
        {isOpen && <p className={styles.text}>{text}</p>}
        <div className={styles.actions}>
          <button type="button" className={styles.cancel} onClick={onClose}>
            Отмена
          </button>
          <Button onClick={onConfirm}>Да, удалить</Button>
        </div>
      </div>
    </Modal>
  );
}
