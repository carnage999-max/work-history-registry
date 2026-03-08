"use client";

import { useState, useEffect } from "react";
import styles from "./dashboard.module.css";
import Link from "next/link";

import { useToast } from "@/context/ToastContext";

interface EmployeeDashboardClientProps {
  email: string;
  history: any[];
  consents: any[];
}

export default function EmployeeDashboardClient({ 
  email, 
  history, 
  consents: initialConsents 
}: EmployeeDashboardClientProps) {
  const [consents, setConsents] = useState(initialConsents);
  const [newToken, setNewToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("timeline");
  const { showToast } = useToast();

  const handleCreateToken = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/employee/consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          scope: "FULL",
          authorizedActor: "ANY",
          expiresInDays: 7
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setNewToken(data.token);
        // Add to local state to show immediately
        setConsents(prev => [{
            id: data.consent_id,
            scope: "FULL",
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            createdAt: new Date().toISOString()
        }, ...prev]);
        showToast("Access Token cryptographically signed.", "success");
      } else {
        showToast("Failed to generate token.", "error");
      }
    } catch (err) {
      console.error("CONSENT_CREATION_FAILED", err);
      showToast("Token generation network failure.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <nav className={styles.navbar}>
        <div className={styles.navContainer}>
          <Link href="/" className={styles.logo}>
            WORK<span>HISTORY</span>
          </Link>
          <div className={styles.navLinks}>
            <button 
              className={activeTab === 'timeline' ? styles.activeNavLink : styles.navLink}
              onClick={() => setActiveTab('timeline')}
            >
              My Timeline
            </button>
            <button 
                className={activeTab === 'consents' ? styles.activeNavLink : styles.navLink}
                onClick={() => setActiveTab('consents')}
            >
              Authorizations
            </button>
            <div className={styles.navDivider} />
            <div className={styles.userProfile}>
              <div className={styles.avatar}>{email[0].toUpperCase()}</div>
              <span>{email}</span>
            </div>
          </div>
        </div>
      </nav>

      <main className={styles.main}>
        <div className={styles.container}>
          <header className={styles.header}>
            <div className={styles.headerContent}>
              <h1 className={styles.pageTitle}>
                {activeTab === 'timeline' ? "Professional Record Vault" : "Identity Authorizations"}
              </h1>
              <p className={styles.pageSubtitle}>
                {activeTab === 'timeline' 
                  ? "Your unbroken professional history, secured by institutional attestations." 
                  : "Manage access tokens and cryptographic consents for third-party verifiers."}
              </p>
            </div>
            {activeTab === 'timeline' && (
                <button className={styles.actionBtn} onClick={() => setActiveTab('consents')}>
                    Generate Access Token
                </button>
            )}
          </header>

          <div className={styles.contentLayout}>
            {activeTab === 'timeline' ? (
              <div className={styles.timelineWrapper}>
                {history.length === 0 ? (
                  <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>🛡️</div>
                    <h3>No Records Attested Yet</h3>
                    <p>Once an employer certifies your professional history, it will appear here as a cryptographically sealed record.</p>
                  </div>
                ) : (
                  <div className={styles.timelineList}>
                    {history.map((record, index) => (
                      <div key={record.id} className={styles.timelineItem}>
                        <div className={styles.timelineMarker}>
                            <div className={styles.markerDot} />
                            {index !== history.length - 1 && <div className={styles.markerLine} />}
                        </div>
                        <div className={styles.recordCard}>
                          <div className={styles.recordHeader}>
                            <div className={styles.employerInfo}>
                              <h3>{record.employerName}</h3>
                              <span className={styles.eventType}>{record.eventType}</span>
                            </div>
                            <div className={styles.recordStatus}>
                                <span className={styles.statusBadge}>Verified</span>
                            </div>
                          </div>
                          
                          <div className={styles.recordBody}>
                            <div className={styles.dataPoint}>
                                <label>Commencement</label>
                                <span>{new Date(record.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                            {record.endDate && (
                                <div className={styles.dataPoint}>
                                    <label>Separation</label>
                                    <span>{new Date(record.endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                </div>
                            )}
                            <div className={styles.dataPoint}>
                                <label>Institutional Audit ID</label>
                                <span className={styles.mono}>{record.id.slice(0, 12).toUpperCase()}</span>
                            </div>
                          </div>

                          <div className={styles.recordFooter}>
                            <div className={styles.hashProof}>
                                <label>Cryptographic Hash Proof</label>
                                <code>{record.recordHash}</code>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className={styles.consentGrid}>
                <div className={styles.consentManager}>
                  <div className={styles.managerCard}>
                    <h2>Generate Secure Token</h2>
                    <p>
                        Generate a cryptographically signed Registry Token to provide to prospective 
                        employers or background screening firms. This token allows them to 
                        execute a secure verification against your attested history.
                    </p>
                    <div className={styles.managerActions}>
                        <button 
                            className="auth-button" 
                            onClick={handleCreateToken}
                            disabled={loading}
                        >
                            {loading ? "Generating Signed Token..." : "Issue Verification Token (7 Days)"}
                        </button>
                    </div>

                    {newToken && (
                      <div className={styles.tokenOutput}>
                        <div className={styles.tokenHeader}>
                           <span>Registry Access Token</span>
                           <button onClick={() => {
                               navigator.clipboard.writeText(newToken);
                               showToast("Token copied to clipboard.", "success");
                           }}>Copy</button>
                        </div>
                        <div className={styles.tokenContainer}>
                          <code>{newToken}</code>
                        </div>
                        <div className={styles.tokenAdvice}>
                            <strong>Security Alert:</strong> Treat this token like a sensitive credential. 
                            It provides read-access to your professional records for the next 168 hours.
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.activeConsents}>
                    <h2 className={styles.sidebarTitle}>Active Authorizations</h2>
                    {consents.length === 0 ? (
                        <div className={styles.noConsents}>
                            No active cryptographic consents found.
                        </div>
                    ) : (
                        <div className={styles.consentList}>
                            {consents.map(c => (
                                <div key={c.id} className={styles.consentCard}>
                                    <div className={styles.consentHeader}>
                                        <span className={styles.scopeBadge}>{c.scope} ACCESS</span>
                                        <span className={styles.expiryBadge}>Expires: {new Date(c.expiresAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className={styles.consentMeta}>
                                        Created: {new Date(c.createdAt).toLocaleDateString()}
                                    </div>
                                    <div className={styles.consentId}>
                                        Consent ID: {c.id.slice(0, 8)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <div className={styles.container}>
            <div className={styles.footerInfo}>
                <strong>Work History Registry | Professional Subject Service</strong>
                <span>The Registry operates as a neutral protocol for professional data integrity.</span>
            </div>
            <div className={styles.footerLinks}>
                <Link href="/security">Security Protocol</Link>
                <Link href="/legal">Privacy Mandate</Link>
            </div>
        </div>
      </footer>
    </div>
  );
}
