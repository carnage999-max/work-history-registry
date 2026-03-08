import styles from './RecordCard.module.css';

interface RecordCardProps {
  employer_id: string;
  event_type: string;
  start_date: string;
  end_date: string;
  record_hash: string;
  rehire_eligible?: boolean;
  disputed?: boolean;
}

export const RecordCard = ({ employer_id, event_type, start_date, end_date, record_hash, rehire_eligible, disputed }: RecordCardProps) => {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.employer}>ID: {employer_id}</h3>
        {disputed && <div className={styles.disputeBadge}>In Dispute</div>}
      </div>
      <div className={styles.position}>{event_type}</div>
      <div className={styles.details}>
        <div className={styles.field}>
          <span className={styles.label}>Period:</span>
          <span className={styles.value}>{start_date} — {end_date}</span>
        </div>
        <div className={styles.field}>
          <span className={styles.label}>Rehire Eligibility:</span>
          <span className={styles.value}>{rehire_eligible ? "Eligible" : "Not Stated"}</span>
        </div>
        <div className={styles.field}>
          <span className={styles.label}>Record Hash:</span>
          <span className={styles.value} style={{ wordBreak: 'break-all', fontSize: '10px' }}>{record_hash}</span>
        </div>
      </div>
      <div className={styles.footer}>
        Verification Status: <span className={styles.hash}>VERIFIED</span>
      </div>
    </div>
  );
};
