import styles from './ConsentGate.module.css';

interface ConsentGateProps {
  onAccept: () => void;
  title?: string;
  description?: string;
}

export const ConsentGate = ({ 
  onAccept, 
  title = "Privacy & Data Consent", 
  description = "A formal request for access to your work history records has been initiated. Review the scope of access below." 
}: ConsentGateProps) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{description}</p>
      
      <div className={styles.permissions}>
        <div className={styles.permissionItem}>
          <div className={styles.check}>✓</div>
          <div className={styles.permissionText}>Verified Employment Dates</div>
        </div>
        <div className={styles.permissionItem}>
          <div className={styles.check}>✓</div>
          <div className={styles.permissionText}>Position Titles & Job Codes</div>
        </div>
        <div className={styles.permissionItem}>
          <div className={styles.check}>✓</div>
          <div className={styles.permissionText}>Separation Status Codes</div>
        </div>
      </div>

      <div className={styles.actions}>
        <button className="secondary-button">Revoke All Access</button>
        <button className="auth-button" onClick={onAccept}>Authorize Access</button>
      </div>
      
      <p className={styles.fineprint}>
        By clicking Authorize, you provide explicit consent under the Data Protection Act 
        for the requesting entity to view the specific records listed above.
      </p>
    </div>
  );
};
