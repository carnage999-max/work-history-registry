"use client";

import { useState, useEffect } from "react";
import styles from "./login.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { PasswordField } from "@/components/PasswordField";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading: authLoading, refreshSession } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      if (user.type === "employee") {
        router.push("/employee/dashboard");
      } else {
        router.push("/employers");
      }
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/employers/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        await refreshSession();
        showToast("Institutional authentication successful.", "success");
        router.push("/employers");
      } else {
        // As per the specification, display the neutral message if SUSPENDED
        setError(result.error || "Institutional access denied.");
        showToast("Access denied.", "error");
      }
    } catch (err) {
      setError("Registry connection failure.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return null; // Prevent flicker during session check

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.card}>
          <div className={styles.header}>
            <h1 className={styles.title}>Institutional Sign In</h1>
            <p className={styles.subtitle}>Secure Access to the Registry of Record</p>
          </div>
          
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label>Institutional Email</label>
              <input 
                type="email" 
                placeholder="name@organization.gov" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <PasswordField
              label="Registry Key / Passcode"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            
            {error && (
              <div className={styles.statusBannerError}>
                {error}
              </div>
            )}

            <div className={styles.alert}>
              Registration and access are strictly limited to authorized 
              organizations and their verified representatives.
            </div>

            <button type="submit" className="auth-button" style={{ width: '100%' }} disabled={loading}>
              {loading ? "Verifying..." : "Continue to Registry"}
            </button>
          </form>
          
          <div className={styles.footer}>
            <Link href="/register">Apply for Institutional Access</Link>
            <span> | </span>
            <Link href="/legal">Compliance Documentation</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
