"use client";

import { useState } from "react";
import styles from "./contact.module.css";
import informationalStyles from "../informational.module.css";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const payload = {
      email: formData.get("email"),
      organization: formData.get("organization"),
      classification: formData.get("classification"),
      message: formData.get("message"),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        console.error("CONTACT_SUBMIT_FAILED", await response.text());
      }
    } catch (err) {
      console.error("CONTACT_SUBMIT_ERROR", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={informationalStyles.page}>
      <main className={informationalStyles.container}>
        <h1 className={informationalStyles.title}>Institutional Inquiries</h1>
        
        <section className={informationalStyles.section}>
          <p className={informationalStyles.text}>
            For institutional access requests, API technical support, 
            or regulatory compliance inquiries, please utilize the secure 
            communication channel below. 
          </p>
        </section>

        {!submitted ? (
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.grid}>
              <div className={styles.field}>
                <label>Institutional Email</label>
                <input 
                  type="email" 
                  name="email"
                  required 
                  placeholder="name@organization.gov" 
                />
              </div>
              <div className={styles.field}>
                <label>Organization Name</label>
                <input 
                  type="text" 
                  name="organization"
                  required 
                  placeholder="Organization Identifier" 
                />
              </div>
            </div>
            
            <div className={styles.field}>
              <label>Inquiry Classification</label>
              <select 
                name="classification" 
                required 
                className={styles.select}
              >
                <option value="">Select Priority Level</option>
                <option value="access">Access Calibration / Onboarding</option>
                <option value="legal">Regulatory / Legal Affairs</option>
                <option value="tech">API / Technical Infrastructure</option>
                <option value="other">General Registry Support</option>
              </select>
            </div>

            <div className={styles.field}>
              <label>Communication Metadata</label>
              <textarea 
                name="message"
                rows={5} 
                required 
                className={styles.textarea} 
                placeholder="Detail your institutional requirement..."
              ></textarea>
            </div>

            <button type="submit" className="auth-button" disabled={isSubmitting}>
              {isSubmitting ? "Initializing..." : "Initialize Communication Log"}
            </button>
          </form>
        ) : (
          <div className={styles.success}>
            <div className={styles.successIcon}>✓</div>
            <h3>Inquiry Logged</h3>
            <p>
              Your communication has been cryptographically recorded in our priority queue. 
              A Registry representative will verify your organizational credentials and contact you via your institutional email.
            </p>
            <button 
              className="secondary-button" 
              onClick={() => setSubmitted(false)}
            >
              New Inquiry
            </button>
          </div>
        )}

        <div className={informationalStyles.auditLog}>
          WHR_CONTACT_SURFACE_V1 [READY] 
          SECURITY_LEVEL: INSTITUTIONAL-L4
          ENCRYPTION: AES-256-GCM
        </div>

        <footer className={informationalStyles.footer}>
          Official Registry Communications Bureau - Established 2026.
        </footer>
      </main>
    </div>
  );
}
