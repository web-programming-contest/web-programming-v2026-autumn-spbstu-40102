import {useEffect} from 'react';
import {createPortal} from 'react-dom';
import styles from './Modal.module.scss';

export function Modal({isOpen, onClose, size = 's', children}) {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div
      className={styles.overlay}
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <div
        className={`${styles.window} ${styles[size]}`}
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label="Закрыть"
        />
        {children}
      </div>
    </div>,
    document.body,
  );
}
