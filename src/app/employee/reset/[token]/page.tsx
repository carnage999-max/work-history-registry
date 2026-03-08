"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "../../login/login.module.css";
import { useToast } from "@/context/ToastContext";
import { PasswordField } from "@/components/PasswordField";

export default function ResetPage() {
  const params = useParams();
  const token = params.token as string;
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/employee/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });
      if (res.ok) {
        setDone(true);
      } else {
        const data = await res.json();
        showToast(data.error || "Reset failed", "error");
      }
    } catch (err) {
      showToast("Network error", "error");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className={styles.page}>
        <main className={styles.main}>
          <div className={styles.formContainer}>
            <div className={styles.successIcon}>✓</div>
            <h2>Password Updated</h2>
            <button className="auth-button" onClick={() => router.push("/employee/login")}>Login</button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.formContainer}>
          <div className={styles.badge}>Reset Password</div>
          <form onSubmit={handleReset} className={styles.form}>
            <PasswordField
              label="New Vault Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 12 characters"
              required
            />
            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? "Updating..." : "Set New Password"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
