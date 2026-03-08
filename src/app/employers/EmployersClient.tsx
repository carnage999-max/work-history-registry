"use client";

import { useState } from "react";
import { EmployerAttestationModal } from "@/components/EmployerAttestationModal";
import styles from "./employers.module.css";
import Link from "next/link";

import { useToast } from "@/context/ToastContext";

interface EmployersClientProps {
  status: string;
  employerName: string;
  attestationCount: number;
  isAdmin?: boolean;
}

export default function EmployersClient({ status, employerName, attestationCount, isAdmin }: EmployersClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localCount, setLocalCount] = useState(attestationCount);
  const { showToast } = useToast();

  const handleAttest = async (data: { employeeName: string; employeeRegistryId: string; eventType: string }) => {
    try {
      const response = await fetch("/api/attest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employee_id: data.employeeRegistryId,
          employee_name: data.employeeName,
          event_type: data.eventType,
          employer_name: employerName,
        }),
      });

      if (response.ok) {
        setLocalCount(prev => prev + 1);
        showToast("Registry record securely attested.", "success");
      } else {
        const result = await response.json();
        showToast(result.error || "Attestation failed.", "error");
      }
    } catch (err) {
      console.error("ATTESTATION_FAILED", err);
      showToast("Attestation network failure.", "error");
    } finally {
      setIsModalOpen(false);
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.hero}>
            {status === "PENDING" && (
              <div className={styles.statusBanner}>
                Institutional verification status: PENDING REVIEW
              </div>
            )}
            <h1 className={styles.title}>Registry Operations</h1>
            <div className={styles.entityMeta}>
               Authorized Institutional Representative for: <strong>{employerName}</strong>
            </div>
            <p className={styles.subtitle}>
              Manage payroll synchronizations, attest employment history certificates, and execute 
              neutral professional verifications through the Registry of Record.
            </p>
          </div>


          <div className={styles.dashboardGrid}>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Audit Ready Status</span>
              <span className={styles.statValue}>ACTIVE</span>
              <span className={styles.statTrend}>Hash Integrity Verified</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Attestation Counter</span>
              <span className={styles.statValue}>{localCount.toLocaleString()}</span>
              <span className={styles.statTrend}>Total Records Attested</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Institutional Compliance</span>
              <span className={styles.statValue}>{status === 'VERIFIED' ? 'CONFIRMED' : 'L1-PENDING'}</span>
              <span className={styles.statTrend}>{status === 'VERIFIED' ? 'Audit Procedures Complete' : 'Registry Review Required'}</span>
            </div>
          </div>

          <div className={styles.sectionHeader}>
            <h2>Operational Interface</h2>
          </div>

          <div className={styles.grid}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>Employment Event Attestation</h3>
              </div>
              <p>Issue formal employment certificates for professional staff with direct, immutable Registry signatures and time-stamped proof of work history.</p>
              <button 
                className="auth-button"
                onClick={() => setIsModalOpen(true)}
              >
                Execute Secure Attestation
              </button>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>Professional Verification</h3>
              </div>
              <p>Search the Registry using employee-issued tokens to verify incoming candidate professional histories against the institutional record.</p>
              <Link href="/verify" className="secondary-button">Open Registry Verifier</Link>
            </div>

            {isAdmin && (
              <div className={`${styles.card} ${styles.adminCard}`}>
                <div className={styles.cardHeader}>
                  <h3>Registry Governance</h3>
                </div>
                <p>Execute platform-level oversight, verify new institutional registrants, and manage global Registry access status.</p>
                <Link href="/admin" className="auth-button">Governance Terminal</Link>
              </div>
            )}
          </div>
        </div>
      </main>

      <EmployerAttestationModal 
        isOpen={isModalOpen}
        onConfirm={handleAttest}
        onCancel={() => setIsModalOpen(false)}
        employerName={employerName}
      />
    </div>
  );
}
