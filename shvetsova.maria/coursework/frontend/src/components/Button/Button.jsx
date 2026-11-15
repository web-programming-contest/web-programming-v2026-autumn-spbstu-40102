import styles from './Button.module.scss';

export function Button({
  as: Component = 'button',
  variant = 'primary',
  className = '',
  icon = '',
  badge = 0,
  children,
  ...props
}) {
  const defaultProps = Component === 'button' ? {type: 'button'} : {};

  return (
    <Component
      className={`${styles.button} ${styles[variant]} ${className}`}
      {...defaultProps}
      {...props}
    >
      {icon && (
        <span
          className={styles.icon}
          style={{maskImage: `url(${icon})`, WebkitMaskImage: `url(${icon})`}}
          aria-hidden="true"
        />
      )}
      {children}
      {badge > 0 && <span className={styles.badge}>{badge}</span>}
    </Component>
  );
}
