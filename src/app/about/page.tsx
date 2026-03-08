import styles from "../informational.module.css";

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <main className={styles.container}>
        <h1 className={styles.title}>The Professional Registry of Record</h1>
        
        <section className={styles.section}>
          <h2 className={styles.heading}>History as Documentation</h2>
          <p className={styles.text}>
            Founded in 2026, the <span className={styles.highlight}>Work History Registry</span> was established to 
            modernize the infrastructure of professional credentials. We operate at the intersection 
            of record-keeping and cryptography, providing a secure, neutral surface for institutional employment records.
          </p>
        </section>

        <section className={styles.section}>
          <h3 className={styles.heading}>Institutional Philosophy</h3>
          <ul className={styles.list}>
            <li className={styles.listItem}>
              <div className={styles.listItemText}>
                <strong>Integrity First:</strong> We prioritize absolute truth in professional records. Our registry provides a single, cryptographically-backed source of confirmation for work history.
              </div>
            </li>
            <li className={styles.listItem}>
              <div className={styles.listItemText}>
                <strong>Employee Empowerment:</strong> We believe that every individual has a right to their professional identity. No information is released to a verifier without the specific, time-limited consent of the subject.
              </div>
            </li>
            <li className={styles.listItem}>
              <div className={styles.listItemText}>
                <strong>Employer Clarity:</strong> For organizations, the registry offers a standard for attesting to professional histories. This reduces administrative overhead while increasing the reliability of work history checks.
              </div>
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h3 className={styles.heading}>The Neutral Standard</h3>
          <p className={styles.text}>
            We do not score, rate, or rank. We do not provide "feedback" or "reviews." 
            The Registry is a ledger of facts—attested by organizations and verified by those with the credentials to see the truth.
          </p>
        </section>

        <footer className={styles.footer}>
          Registry Mission Control - Established 2026. 
          WHR-v1.0-ABOUT-INSTITUTIONAL.
        </footer>
      </main>
    </div>
  );
}
