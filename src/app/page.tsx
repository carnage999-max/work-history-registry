"use client";

import React from "react";
import styles from "./page.module.css";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user, loading } = useAuth();
  const [activeIdxs, setActiveIdxs] = React.useState<number[]>([]);

  // periodically highlight random nodes and remove them individually
  React.useEffect(() => {
    const interval = setInterval(() => {
      setActiveIdxs(current => {
        const rand = Math.floor(Math.random() * 9);
        // if already active or we already have three, leave state unchanged
        if (current.includes(rand) || current.length >= 3) {
          return current;
        }
        return [...current, rand];
      });
    }, 400);

    return () => clearInterval(interval);
  }, []);

  // whenever an index is added, schedule its removal after 800ms
  React.useEffect(() => {
    if (activeIdxs.length === 0) return;

    const timers = activeIdxs.map(idx =>
      setTimeout(
        () => setActiveIdxs(current => current.filter(i => i !== idx)),
        800
      )
    );

    return () => timers.forEach(t => clearTimeout(t));
  }, [activeIdxs]);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.mobileImageWrapper}>
            <img 
              src="/work-history-registry.jpg" 
              alt="Work History Registry" 
              className={styles.mobileImage}
            />
          </div>
          <div className={styles.heroContent}>
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
                  <Link href="/employers" className="auth-button">Employer Portal</Link>
                  <Link href="/employee/dashboard" className="secondary-button">My Work History</Link>
                </div>
              ) : (
                <div className={styles.portalGrid}>
                  <div className={styles.portalCard}>
                    <h3>Professional Subject</h3>
                    <p>Claim your attested history and manage access tokens.</p>
                    <Link href="/employee/register" className="auth-button">Access My Vault</Link>
                  </div>
                  <div className={styles.portalCard}>
                    <h3>For Employers</h3>
                    <p>Record employment history and verify past employees.</p>
                    <Link href="/register" className="secondary-button">Employer Sign Up</Link>
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
                <div
                  key={i}
                  className={`${styles.node} ${activeIdxs.includes(i) ? styles.nodeActive : ""}`}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
