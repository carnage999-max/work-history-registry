"use client";

import { useState } from "react";
import styles from "./admin.module.css";
import informationalStyles from "../informational.module.css";

interface Employer {
  id: string;
  name: string;
  email: string;
  status: string;
  createdAt: any;
}

interface AdminClientProps {
  employers: Employer[];
}

import { useToast } from "@/context/ToastContext";

export default function AdminClient({ employers: initialEmployers }: AdminClientProps) {
  const [employers, setEmployers] = useState(initialEmployers);
  const [processing, setProcessing] = useState<string | null>(null);
  const { showToast } = useToast();
  const [pendingSuspendInfo, setPendingSuspendInfo] = useState<{ id: string; name: string } | null>(null);

  const updateStatus = async (employerId: string, newStatus: string) => {
    setProcessing(employerId);
    try {
      const response = await fetch(`/api/admin/employers/${employerId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setEmployers(employers.map(e => e.id === employerId ? { ...e, status: newStatus } : e));
        showToast(`Institution status updated to ${newStatus}`);
      } else {
        const data = await response.json();
        showToast(data.error || "Update failed", "error");
      }
    } catch (err) {
      console.error("STATUS_UPDATE_ERROR", err);
      showToast("A network error occurred", "error");
    } finally {
      setProcessing(null);
      setPendingSuspendInfo(null);
    }
  };

  const executeSuspend = () => {
    if (pendingSuspendInfo) {
      updateStatus(pendingSuspendInfo.id, 'SUSPENDED');
    }
  };

  return (
    <div className={informationalStyles.page}>
      {/* High-Integrity Suspension Confirmation Modal */}
      {pendingSuspendInfo && (
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
            maxWidth: "480px",
            width: "90%",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
          }}>
            <h2 style={{ fontSize: "1.25rem", color: "#7f1d1d", fontWeight: "700", marginBottom: "16px" }}>Confirm Access Revocation</h2>
            <p style={{ color: "var(--graphite)", fontSize: "0.9375rem", lineHeight: 1.6, marginBottom: "24px" }}>
              You are about to suspend <strong>{pendingSuspendInfo.name}</strong>. This will immediately revoke their ability to attest records and execute professional verifications on the Registry platform.
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
              <button 
                onClick={() => setPendingSuspendInfo(null)}
                className="secondary-button"
                style={{ padding: "8px 16px" }}
              >
                Cancel Action
              </button>
              <button 
                onClick={executeSuspend}
                className="auth-button"
                style={{ backgroundColor: "#b91c1c", padding: "8px 16px" }}
                disabled={processing === pendingSuspendInfo.id}
              >
                {processing === pendingSuspendInfo.id ? "Suspending..." : "Revoke Access"}
              </button>
            </div>
          </div>
        </div>
      )}

      <main className={informationalStyles.container}>
        <div className={styles.header}>
           <h1 className={informationalStyles.title}>Registry Governance Console</h1>
           <p className={informationalStyles.text}>Manage institutional access for all Registry members.</p>
        </div>

        <section className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Organization</th>
                <th>Institutional Contact</th>
                <th>Registration Date</th>
                <th>Access Status</th>
                <th>Governance Actions</th>
              </tr>
            </thead>
            <tbody>
              {employers.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '40px' }}>No institutional entities registered.</td>
                </tr>
              )}
              {employers.map((emp) => (
                <tr key={emp.id}>
                  <td>
                    <div className={styles.nameCell}>
                      <strong>{emp.name}</strong>
                      <span className={styles.idSub}>{emp.id}</span>
                    </div>
                  </td>
                  <td>{emp.email}</td>
                  <td>{new Date(emp.createdAt).toLocaleDateString()}</td>
                  <td>
                    <span className={`${styles.statusPill} ${styles[`status_${emp.status}`]}`}>
                      {emp.status}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button 
                        disabled={processing === emp.id || emp.status === 'VERIFIED'}
                        onClick={() => updateStatus(emp.id, 'VERIFIED')}
                        className={styles.verifyBtn}
                        style={{ opacity: emp.status === 'VERIFIED' ? 0.5 : 1 }}
                      >
                        Verify
                      </button>
                      <button 
                         disabled={processing === emp.id || emp.status === 'SUSPENDED'}
                         onClick={() => setPendingSuspendInfo({ id: emp.id, name: emp.name })}
                         className={styles.suspendBtn}
                         style={{ opacity: emp.status === 'SUSPENDED' ? 0.5 : 1 }}
                      >
                        Suspend
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <div className={informationalStyles.auditLog}>
          GOVERNANCE_SYSTEM: WHR_L9_SECURE_ADMIN_V1 [ACTIVE]
        </div>
      </main>
    </div>
  );
}
