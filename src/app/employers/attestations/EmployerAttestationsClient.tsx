"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./attestations.module.css";

interface Attestation {
  id: string;
  employeeName: string;
  employeeDisplayId: string;
  eventType: string;
  startDate: string;
  endDate: string | null;
  rehireEligible: boolean;
  attestedAt: string;
  recordHash: string;
}

interface EmployerAttestationsClientProps {
  employerName: string;
  attestations: Attestation[];
}

export default function EmployerAttestationsClient({
  employerName,
  attestations
}: EmployerAttestationsClientProps) {
  const [filter, setFilter] = useState("all");

  const filteredAttestations = attestations.filter(attestation => {
    if (filter === "all") return true;
    return attestation.eventType.toLowerCase() === filter;
  });

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.breadcrumb}>
              <Link href="/employers" className={styles.backLink}>← Back to Dashboard</Link>
            </div>
            <h1 className={styles.title}>Attestation Management</h1>
            <p className={styles.subtitle}>
              Review and manage employment event attestations for {employerName}
            </p>
          </div>

          <div className={styles.controls}>
            <div className={styles.filterGroup}>
              <label htmlFor="filter">Filter by Event Type:</label>
              <select
                id="filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="all">All Events</option>
                <option value="hired">Hired</option>
                <option value="terminated">Terminated</option>
                <option value="promoted">Promoted</option>
              </select>
            </div>
            <div className={styles.stats}>
              <span className={styles.stat}>
                Total Attestations: <strong>{attestations.length}</strong>
              </span>
            </div>
          </div>

          <div className={styles.attestationsList}>
            {filteredAttestations.length === 0 ? (
              <div className={styles.emptyState}>
                <h3>No attestations found</h3>
                <p>
                  {filter === "all"
                    ? "You haven't created any attestations yet."
                    : `No ${filter} attestations found.`
                  }
                </p>
                <Link href="/employers" className="auth-button">
                  Create Your First Attestation
                </Link>
              </div>
            ) : (
              filteredAttestations.map((attestation) => (
                <div key={attestation.id} className={styles.attestationCard}>
                  <div className={styles.cardHeader}>
                    <div className={styles.employeeInfo}>
                      <h3 className={styles.employeeName}>{attestation.employeeName}</h3>
                      <span className={styles.employeeId}>{attestation.employeeDisplayId}</span>
                    </div>
                    <div className={styles.eventBadge}>
                      {attestation.eventType}
                    </div>
                  </div>

                  <div className={styles.cardBody}>
                    <div className={styles.detailRow}>
                      <span className={styles.label}>Event Date:</span>
                      <span className={styles.value}>
                        {new Date(attestation.startDate).toLocaleDateString()}
                      </span>
                    </div>

                    {attestation.endDate && (
                      <div className={styles.detailRow}>
                        <span className={styles.label}>End Date:</span>
                        <span className={styles.value}>
                          {new Date(attestation.endDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}

                    <div className={styles.detailRow}>
                      <span className={styles.label}>Rehire Eligible:</span>
                      <span className={styles.value}>
                        <span className={attestation.rehireEligible ? styles.eligible : styles.notEligible}>
                          {attestation.rehireEligible ? "✓ Eligible" : "✗ Not Eligible"}
                        </span>
                      </span>
                    </div>

                    <div className={styles.detailRow}>
                      <span className={styles.label}>Attested On:</span>
                      <span className={styles.value}>
                        {new Date(attestation.attestedAt).toLocaleDateString()} at{" "}
                        {new Date(attestation.attestedAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>

                  <div className={styles.cardFooter}>
                    <div className={styles.hashInfo}>
                      <span className={styles.hashLabel}>Record Hash:</span>
                      <code className={styles.hashValue}>
                        {attestation.recordHash.slice(0, 16)}...
                      </code>
                    </div>
                    <div className={styles.actions}>
                      <button
                        className={styles.viewButton}
                        onClick={() => {
                          // Copy hash to clipboard
                          navigator.clipboard.writeText(attestation.recordHash);
                          // Could add toast notification here
                        }}
                      >
                        Copy Hash
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}