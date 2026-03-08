import styles from "../informational.module.css";

export default function SecurityPage() {
  return (
    <div className={styles.page}>
      <main className={styles.container}>
        <h1 className={styles.title}>Data Protection & Verification Infrastructure</h1>
        
        <section className={styles.section}>
          <h2 className={styles.heading}>Cryptographic Foundation</h2>
          <p className={styles.text}>
            The Work History Registry maintains data integrity through a continuous <span className={styles.highlight}>SHA-256 Hash Chain</span>. 
            Every professional event is cryptographically linked to the preceding event, 
            creating an immutable audit trail that is tamper-evident at all levels.
          </p>
        </section>

        <section className={styles.section}>
          <h3 className={styles.heading}>Institutional Safety Standards</h3>
          <ul className={styles.list}>
            <li className={styles.listItem}>
              <div className={styles.listItemText}>
                <strong>End-to-End Verification:</strong> At no point is information stored as plain-text for public access. Verification is a multi-step process requiring a signed consent token, an organizational identifier, and the specific record hash.
              </div>
            </li>
            <li className={styles.listItem}>
              <div className={styles.listItemText}>
                <strong>Signed At Origin (SAO):</strong> Each event is signed using the attestor's private key before it reaches the registry's storage layer. This ensures the digital signature is the definitive proof of work history.
              </div>
            </li>
            <li className={styles.listItem}>
              <div className={styles.listItemText}>
                <strong>Zero Leakage Response:</strong> Our API surface is hardened to return only the specific, whitelisted fields requested. Non-verified or invalid tokens return a neutral error to prevent information leakage through response timing or error semantics.
              </div>
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h3 className={styles.heading}>API Security Gating</h3>
          <p className={styles.text}>
            We enforce strict rate limiting on all verification endpoints. Each request is monitored to identify and block brute-force attempts.
          </p>
        </section>
      </main>
    </div>
  );
}
