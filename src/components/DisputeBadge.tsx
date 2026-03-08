import styles from './DisputeBadge.module.css';

interface DisputeBadgeProps {
  status?: 'open' | 'resolved' | 'pending';
}

export const DisputeBadge = ({ status = 'pending' }: DisputeBadgeProps) => {
  return (
    <div className={`${styles.badge} ${styles[status]}`}>
      <span className={styles.dot} />
      RECORD UNDER DISPUTE
    </div>
  );
};
