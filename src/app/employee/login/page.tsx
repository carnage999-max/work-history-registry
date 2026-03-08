"use client";

import { useState } from "react";
import styles from "./login.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useToast } from "@/context/ToastContext";

export default function EmployeeLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/employee/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        showToast("Professional Vault Unsealed.", "success");
        router.push("/employee/dashboard");
      } else {
        setError("INVALID_CREDENTIALS");
        showToast("Access Denied: Invalid Credentials.", "error");
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
             New to the Registry? <Link href="/employee/register">Register</Link>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.formContainer}>
          <div className={styles.badge}>Vault Access Authorized</div>
          <h1 className={styles.title}>Professional Login</h1>
          <p className={styles.subtitle}>
            Enter your credentials to access your professional record vault, 
            manage your identity, and authorize secure background screenings.
          </p>

          <form onSubmit={handleLogin} className={styles.form}>
            {error === 'INVALID_CREDENTIALS' && <div className={styles.error}>Unauthorized: Credentials failed verification.</div>}
            
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
              <label>Vault Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 12 characters recommended"
                required
              />
            </div>

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? "Verifying Vault..." : "Unseal My Professional Vault"}
            </button>
          </form>

           <p className={styles.legalNotice}>
            By accessing my vault, I verify that I am the authorized representative 
            of the professional identity associated with this email.
          </p>
        </div>
      </main>
    </div>
  );
}
