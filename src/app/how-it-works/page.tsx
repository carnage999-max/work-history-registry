import styles from "../informational.module.css";

export default function HowItWorksPage() {
  return (
    <div className={styles.page}>
      <main className={styles.container}>
        <h1 className={styles.title}>Operation Environment & Architecture</h1>
        
        <section className={styles.section}>
          <h2 className={styles.heading}>Institutional Methodology</h2>
          <p className={styles.text}>
            The Work History Registry functions as a cryptographically verifiable source of professional truth.
            Our architecture is built on the principle of <span className={styles.highlight}>Absolute Neutrality</span>.
          </p>
        </section>

        <section className={styles.section}>
          <h3 className={styles.heading}>The Verification Lifecycle</h3>
          <ul className={styles.list}>
            <li className={styles.listItem}>
              <div className={styles.listItemText}>
                <strong>Attestation:</strong> An employer records an employment event. This event is hashed using SHA-256 and becomes part of a continuous cryptographic chain.
              </div>
            </li>
            <li className={styles.listItem}>
              <div className={styles.listItemText}>
                <strong>Consent Management:</strong> The employee maintains sovereign control over their professional history. No information is released without a cryptographically signed consent token.
              </div>
            </li>
            <li className={styles.listItem}>
              <div className={styles.listItemText}>
                <strong>Permanent Record:</strong> Once recorded, employment events can't be deleted. If there's a mistake or dispute, it's recorded as a new entry, so everyone can see the full history.
              </div>
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h3 className={styles.heading}>Verification & Proof</h3>
          <p className={styles.text}>
            Each employment record gets a unique fingerprint (called a Record Hash). 
            When someone verifies a record, we compare the provided hash against our registry 
            to confirm it hasn't been changed since the employer recorded it.
          </p>
          <div className={styles.auditLog}>
            WHR_EVENT_V1_VERIFY [OK] 
            HASH: 49c9423c15bfe143546904f1c9be343fc8a4d94349b45eda1535ca3bfdfa72eb
            SOURCE: Employer ID 0x8829...
          </div>
        </section>

        <footer className={styles.footer}>
          Official Registry Technical Documentation V1.0 - Published 2026.
        </footer>
      </main>
    </div>
  );
}
