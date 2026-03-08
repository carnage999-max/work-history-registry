"use client";

import { useState, useEffect } from "react";
import styles from "./register.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export default function RegisterPage() {
  const router = useRouter();
  const { user, loading: authLoading, refreshSession } = useAuth();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    employer_name: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      const response = await fetch("/api/employers/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await refreshSession();
        showToast("Institutional application registered securely.", "success");
        router.push("/employers");
      } else {
        const result = await response.json();
        setError(result.error || "Registration failed.");
        showToast("Registration failed.", "error");
      }
    } catch (err) {
      setError("Registry connection failure.");
      showToast("Network failure.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return null;

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.card}>
          <div className={styles.header}>
            <h1 className={styles.title}>Apply for Institutional Access</h1>
            <p className={styles.subtitle}>Registration Required for Attestation and Verification</p>
          </div>
          
          <div className={styles.content}>
            <section className={styles.info}>
              <h3>Institutional Eligibility</h3>
              <p>The Registry is restricted to verified organizations. To apply, you must provide:</p>
              <ul className={styles.list}>
                <li>A valid Federal Tax ID (EIN) or international equivalent.</li>
                <li>Documentation of institutional authority for the applicant.</li>
                <li>A secondary credential from an accredited trade or governance body.</li>
              </ul>
            </section>

            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.field}>
                <label>Organization Name</label>
                <input 
                  type="text" 
                  value={formData.employer_name}
                  onChange={(e) => setFormData({...formData, employer_name: e.target.value})}
                  required 
                />
              </div>
              <div className={styles.field}>
                <label>Institutional Email</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required 
                />
              </div>
              <div className={styles.field}>
                <label>Registry Key (Password)</label>
                <input 
                  type="password" 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required 
                />
              </div>

              {error && <div className={styles.error}>{error}</div>}

              <div className={styles.actions}>
                <div className={styles.alert}>
                  Digital registration is restricted to corporate representatives. 
                  Access pending verification will be issued in 'L6-PENDING' status.
                </div>
                <button type="submit" className="auth-button" style={{ width: '100%' }} disabled={loading}>
                  {loading ? "Registering..." : "Submit Institutional Application"}
                </button>
              </div>
            </form>
          </div>
          
          <div className={styles.footer}>
            <Link href="/login">Return to Sign In</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
