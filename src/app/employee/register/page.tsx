"use client";

import { useState, useEffect } from "react";
import styles from "./register.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/context/AuthContext";
import { PasswordField } from "@/components/PasswordField";

export default function EmployeeRegister() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ssn, setSsn] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();
  const { user, loading: authLoading, refreshSession } = useAuth();

  // redirect if already signed in
  useEffect(() => {
    if (!authLoading && user) {
      if (user.type === "employee") {
        router.push("/employee/dashboard");
      } else {
        router.push("/employers");
      }
    }
  }, [user, authLoading, router]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/employee/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, ssn }),
      });

      if (response.ok) {
        showToast("Professional Identity securely established.", "success");
        await refreshSession();
        router.push("/employee/dashboard");
      } else {
        const data = await response.json();
        setError(data.error || "REGISTRATION_FAILED");
        showToast("Identity verification failed.", "error");
      }
    } catch (err) {
      setError("SERVER_ERROR");
      showToast("Registry Connection Failure.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.container}>
          <Link href="/" className={styles.logo}>
            WORK<span>HISTORY</span>
          </Link>
          <div className={styles.authLinks}>
             Already registered? <Link href="/employee/login">Log In</Link>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.formContainer}>
          <div className={styles.badge}>Professional Registry Access</div>
          <h1 className={styles.title}>Claim Your Professional History</h1>
          <p className={styles.subtitle}>
            Establish your Registry identity to manage your attested work history, 
            view professional certificates, and authorize secure background screenings.
          </p>

          <form onSubmit={handleRegister} className={styles.form}>
            {error && <div className={styles.error}>{error === 'EMAIL_ALREADY_EXISTS' ? 'Email already in use' : 'Identity verification failed. Please try again.'}</div>}
            
            <div className={styles.field}>
              <label>Full Legal Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sarah Jenkins"
                required
              />
            </div>

            <div className={styles.field}>
              <label>Official Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@professional.com"
                required
              />
            </div>

            <div className={styles.field}>
              <label>Government ID / Payroll Identifier</label>
              <input 
                type="text" 
                value={ssn} 
                onChange={(e) => setSsn(e.target.value)}
                placeholder="From your institutional records"
                required
              />
              <div className={styles.fieldInfo}>
                Institutional identifier used for cryptographic linking. Raw value is <strong>immediately hashed</strong> and <strong>never stored</strong> in the Registry database.
              </div>
            </div>

            <PasswordField
              label="Create Vault Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 12 characters recommended"
              required
            />

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? "Verifying Identity..." : "Establish My Registry Identity"}
            </button>
          </form>

          <p className={styles.legalNotice}>
            By establishing this identity, you authorize the Registry of Record to link your 
            attested employment events to your professional dashboard for your oversight.
          </p>
        </div>
      </main>
    </div>
  );
}
