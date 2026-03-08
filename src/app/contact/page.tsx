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
        <h1 className={informationalStyles.title}>Get in Touch</h1>
        
        <section className={informationalStyles.section}>
          <p className={informationalStyles.text}>
            Have questions about how the Registry works? Need technical help? 
            Send us a message and we'll get back to you soon.
          </p>
        </section>

        {!submitted ? (
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.grid}>
              <div className={styles.field}>
                <label>Your Email</label>
                <input 
                  type="email" 
                  name="email"
                  required 
                  placeholder="you@company.com" 
                />
              </div>
              <div className={styles.field}>
                <label>Your Organization</label>
                <input 
                  type="text" 
                  name="organization"
                  required 
                  placeholder="Company or Agency Name" 
                />
              </div>
            </div>
            
            <div className={styles.field}>
              <label>What's This About?</label>
              <select 
                name="classification" 
                required 
                className={styles.select}
              >
                <option value="">Choose a topic</option>
                <option value="access">Getting started</option>
                <option value="legal">Legal or compliance</option>
                <option value="tech">Technical support</option>
                <option value="other">Something else</option>
              </select>
            </div>

            <div className={styles.field}>
              <label>Your Message</label>
              <textarea 
                name="message"
                rows={5} 
                required 
                className={styles.textarea} 
                placeholder="Tell us what you need..."
              ></textarea>
            </div>

            <button type="submit" className="auth-button" disabled={isSubmitting}>
              {isSubmitting ? "Initializing..." : "Initialize Communication Log"}
            </button>
          </form>
        ) : (
          <div className={styles.success}>
            <div className={styles.successIcon}>✓</div>
            <h3>Message Sent</h3>
            <p>
              Thanks for reaching out. We've received your message and will get back to you soon.
            </p>
            <button 
              className="secondary-button" 
              onClick={() => setSubmitted(false)}
            >
              Send Another Message
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
