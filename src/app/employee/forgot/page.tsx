"use client";

import { useState } from "react";
import styles from "../login/login.module.css";
import { useToast } from "@/context/ToastContext";
import Link from "next/link";

export default function EmployeeForgot() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/employee/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        showToast("If that address exists, you will receive an email shortly.", "success");
      }
    } catch (err) {
      showToast("Request failed. Try again later.", "error");
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
             Remembered? <Link href="/employee/login">Sign In</Link>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.formContainer}>
          <div className={styles.badge}>Forgot Password</div>
          <h1 className={styles.title}>Reset Your Vault Password</h1>
          <p className={styles.subtitle}>
            Enter the email associated with your profile and we&apos;ll send you a 
            link to create a new password.
          </p>

          {submitted ? (
            <div className={styles.success}>
              <div className={styles.successIcon}>✓</div>
              <p>If the address exists, you will receive an email with reset instructions.</p>
              <Link href="/employee/login" className="secondary-button">
                Return to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
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
              <button type="submit" className="auth-button" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
