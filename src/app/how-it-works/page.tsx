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
                <strong>Immutable Log:</strong> Once recorded, events are immutable. Any amendment or dispute is recorded as a new linked event in the chain, preserving the historical provenance of the original record.
              </div>
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h3 className={styles.heading}>Data Integrity & Provenance</h3>
          <p className={styles.text}>
            Each professional record is assigned a unique <span className={styles.highlight}>Record Hash</span>. 
            Verification is completed by comparing the provided hash against the immutable registry log, 
            ensuring that no tampering has occurred between the point of origin and the final verifier.
          </p>
          <div className={styles.auditLog}>
            WHR_EVENT_V1_VERIFY [OK] 
            HASH: 49c9423c15bfe143546904f1c9be343fc8a4d94349b45eda1535ca3bfdfa72eb
            PROVENANCE: SRC_INSTITUTIONAL_ATTESTOR_ID: 0x8829...
          </div>
        </section>

        <footer className={styles.footer}>
          Official Registry Technical Documentation V1.0 - Published 2026.
        </footer>
      </main>
    </div>
  );
}
