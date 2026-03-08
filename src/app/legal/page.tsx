import styles from "../informational.module.css";

export default function LegalPage() {
  return (
    <div className={styles.page}>
      <main className={styles.container}>
        <h1 className={styles.title}>Regulatory Compliance & Professional Rights</h1>
        
        <section className={styles.section}>
          <h2 className={styles.heading}>The Fairness & Neutrality Mandate</h2>
          <p className={styles.text}>
            The Work History Registry functions as a neutral record-keeping institution.
            In compliance with federal and international standards, our platform operates 
            under a strict mandate of accuracy. We prioritize the <span className={styles.highlight}>Sovereign Data Rights</span>
             of every professional, employee, and employer.
          </p>
        </section>

        <section className={styles.section}>
          <h3 className={styles.heading}>Professional Data Protection</h3>
          <ul className={styles.list}>
            <li className={styles.listItem}>
              <div className={styles.listItemText}>
                <strong>Sovereignty of Consent:</strong> Your professional records are private. No record is released to a third party without your explicit, cryptographically signed authorization. 
              </div>
            </li>
            <li className={styles.listItem}>
              <div className={styles.listItemText}>
                <strong>The Right to Dispute:</strong> Every record is linked to a dispute mechanism. If an inaccuracy is identified, a linked record is created to ensure the official history is corrected while maintaining the transparency of the audit trail.
              </div>
            </li>
            <li className={styles.listItem}>
              <div className={styles.listItemText}>
                <strong>Institutional Disclosure:</strong> Our platform adheres to the <span className={styles.highlight}>Fair Credit Reporting Act (FCRA)</span> standards for employment background checking. We are committed to absolute data accuracy and parity.
              </div>
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h3 className={styles.heading}>Arbitration & Accuracy</h3>
          <p className={styles.text}>
            We do not score, rate, or provide judgment on professional histories. 
            The Registry is a ledger of facts—attested by organizations and verifiable by anyone with the appropriate credentials.
          </p>
        </section>

        <footer className={styles.footer}>
          Registry Legal Affairs Bureau - WHR-v1-LEGAL (Feb 2026).
        </footer>
      </main>
    </div>
  );
}
