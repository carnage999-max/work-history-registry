"use client";

import { useState } from "react";
import { VerificationTimeline } from "@/components/VerificationTimeline";
import { ConsentGate } from "@/components/ConsentGate";
import styles from "./verify.module.css";

interface APIEvent {
  event_id: string;
  employer_id: string;
  employee_hash_id: string;
  event_type: string;
  start_date: string;
  end_date: string;
  rehire_eligible: boolean;
  attested_at: string;
  record_hash: string;
  prev_record_hash: string | null;
}

import { useToast } from "@/context/ToastContext";

export default function VerifyPage() {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{ events: APIEvent[] } | null>(null);
  const [errorStatus, setErrorStatus] = useState<number | null>(null);
  const { showToast } = useToast();

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!token) return;

    setLoading(true);
    setErrorStatus(null);
    setData(null);

    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      if (!res.ok) {
        setErrorStatus(res.status);
        showToast("Token verification failed.", "error");
        setLoading(false);
        return;
      }

      const payload = await res.json();
      setData(payload);
      showToast("Cryptographic signature verified.", "success");
    } catch (err) {
      setErrorStatus(500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>Secure Registry Access</h1>
            <div className={styles.meta}>
              <span>Status: <strong>Active Authentication Required</strong></span>
            </div>
          </div>

          <form onSubmit={handleVerify} className={styles.searchBar}>
            <input 
              type="text" 
              placeholder="Paste cryptographically signed Registry Token" 
              className={styles.input}
              value={token}
              onChange={(e) => setToken(e.target.value)}
              disabled={loading}
            />
            <button type="submit" className="auth-button" disabled={loading || !token}>
              {loading ? "Verifying..." : "Execute Secure Search"}
            </button>
          </form>

          <div className={styles.results}>
            {errorStatus === 400 && (
              <div className={styles.errorBox}>
                <strong>Access Denied:</strong> The provided token is invalid, malformed, or has expired.
              </div>
            )}

            {errorStatus === 403 && (
              <div className={styles.gateWrapper}>
                <ConsentGate 
                  onAccept={() => {
                    alert("Institutional consent workflow initiated. In a backend-integrated app, this would update the server state.");
                  }}
                  title="Employee Consent Required"
                  description="A valid token was provided, but the employee has not yet authorized access for this specific inquiry."
                />
              </div>
            )}

            {errorStatus === 429 && (
              <div className={styles.errorBox}>
                <strong>Security Alert:</strong> Rate limit exceeded. Secure search disabled for 60 seconds.
              </div>
            )}

            {data && (
              <>
                <div className={styles.resultsHeader}>
                  <h2>Timeline Analysis</h2>
                  <p>Cryptographically verified history (Hash Chain Active)</p>
                </div>
                
                <VerificationTimeline 
                  events={data.events.map((e: APIEvent) => ({
                    ...e,
                    status: 'verified' // Default status for verified events
                  }))} 
                />
              </>
            )}
            
            {!data && !errorStatus && !loading && (
              <div className={styles.placeholder}>
                Enter a signed token to retrieve employment records.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
