"use client";

import styles from "./page.module.css";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user, loading } = useAuth();

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <div className={styles.badge}>Authorized Registry</div>
            <h1 className={styles.title}>
              The Single Source of Truth for Professional History
            </h1>
            <p className={styles.subtitle}>
              Infrastructure-grade verification for employers and employees. 
              Immutable records, cryptographically secured, and accessible 
              only by authorized consent.
            </p>
            <div className={styles.cta}>
              {!loading && user ? (
                <div className={styles.portalChoice}>
                  <Link href="/employers" className="auth-button">Institutional Registry Console</Link>
                  <Link href="/employee/dashboard" className="secondary-button">Professional Record Vault</Link>
                </div>
              ) : (
                <div className={styles.portalGrid}>
                  <div className={styles.portalCard}>
                    <h3>Professional Subject</h3>
                    <p>Claim your attested history and manage access tokens.</p>
                    <Link href="/employee/register" className="auth-button">Access My Vault</Link>
                  </div>
                  <div className={styles.portalCard}>
                    <h3>Institutional Body</h3>
                    <p>Attest records and execute institutional verifications.</p>
                    <Link href="/register" className="secondary-button">Registry Console</Link>
                  </div>
                </div>
              )}
            </div>
            <div className={styles.verifyLink}>
                <Link href="/verify">Verify an Authorization Token →</Link>
            </div>
          </div>
          <div className={styles.heroVisual}>
            <div className={styles.nodeGrid}>
              {[...Array(9)].map((_, i) => (
                <div key={i} className={styles.node} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
