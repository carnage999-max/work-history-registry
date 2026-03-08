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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [consentToDelete, setConsentToDelete] = useState<string | null>(null);
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [tokenAcknowledged, setTokenAcknowledged] = useState(false);
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
        setShowTokenModal(true);
        setTokenAcknowledged(false);
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

  const handleDeleteConsent = async () => {
    if (!consentToDelete) return;

    try {
      const res = await fetch("/api/employee/consent", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ consentId: consentToDelete }),
      });

      if (res.ok) {
        setConsents(prev => prev.filter(c => c.id !== consentToDelete));
        showToast("Consent revoked successfully.", "success");
      } else {
        showToast("Failed to revoke consent.", "error");
      }
    } catch (err) {
      console.error("CONSENT_DELETION_FAILED", err);
      showToast("Revocation network failure.", "error");
    } finally {
      setShowDeleteConfirm(false);
      setConsentToDelete(null);
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

                    {showTokenModal && newToken && (
                      <div className={styles.tokenModal}>
                        <div className={styles.tokenModalContent}>
                          <h3>Registry Access Token Generated</h3>
                          <p>Your cryptographically signed token is ready. Copy it now—you won't be able to view it again.</p>
                          <div className={styles.tokenContainer}>
                            <code>{newToken}</code>
                          </div>
                          <div className={styles.acknowledgment}>
                            <label>
                              <input 
                                type="checkbox" 
                                checked={tokenAcknowledged}
                                onChange={(e) => setTokenAcknowledged(e.target.checked)}
                              />
                              I understand this token provides access to my professional records and must be handled securely.
                            </label>
                          </div>
                          <div className={styles.modalActions}>
                            <button 
                              className="secondary-button" 
                              onClick={() => {
                                setShowTokenModal(false);
                                setNewToken(null);
                              }}
                            >
                              Close
                            </button>
                            <button 
                              className="auth-button" 
                              disabled={!tokenAcknowledged}
                              onClick={() => {
                                navigator.clipboard.writeText(newToken);
                                showToast("Token copied to clipboard.", "success");
                                setShowTokenModal(false);
                                setNewToken(null);
                              }}
                            >
                              Copy & Close
                            </button>
                          </div>
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
                                    <button 
                                        className={styles.deleteBtn}
                                        onClick={() => {
                                            setConsentToDelete(c.id);
                                            setShowDeleteConfirm(true);
                                        }}
                                    >
                                        Revoke Consent
                                    </button>
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

      {showDeleteConfirm && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(15, 23, 42, 0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 999
        }}>
          <div style={{
            background: "white",
            padding: "32px",
            borderRadius: "12px",
            maxWidth: "400px",
            width: "90%",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
          }}>
            <h2 style={{ fontSize: "1.25rem", color: "var(--slate)", fontWeight: "700", marginBottom: "16px" }}>Revoke Consent</h2>
            <p style={{ color: "var(--graphite)", fontSize: "0.9375rem", lineHeight: 1.6, marginBottom: "24px" }}>
              Are you sure you want to revoke this consent? This will invalidate any associated access tokens and prevent further verifications using this consent.
            </p>
            <div style={{ display: "flex", justifyItems: "center", justifyContent: "flex-end", gap: "12px" }}>
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="secondary-button"
                style={{ padding: "8px 16px" }}
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteConsent}
                className="auth-button"
                style={{ padding: "8px 16px" }}
              >
                Revoke
              </button>
            </div>
          </div>
        </div>
      )}

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
