import Link from 'next/link';
import Image from 'next/image';
import styles from './Footer.module.css';

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            <Image 
              src="/logo.png" 
              alt="Work History Registry Logo" 
              width={40} 
              height={40} 
              className={styles.logoImage}
            />
            WORK<span>HISTORY</span>
          </div>
          <p className={styles.tagline}>
            The Professional Registry of Record. 
            Cryptographically Verifiable Work History.
          </p>
        </div>
        
        <div className={styles.links}>
          <div className={styles.linkGroup}>
            <h4>Platform</h4>
            <Link href="/verify">Verification Engine</Link>
            <Link href="/employers">Employer Toolkit</Link>
            <Link href="/employee/dashboard">Professional Vault</Link>
          </div>
          
          <div className={styles.linkGroup}>
            <h4>Information</h4>
            <Link href="/how-it-works">Methodology</Link>
            <Link href="/security">Security & Proofs</Link>
            <Link href="/about">Mission Registry</Link>
            <Link href="/legal">Legal & FCRA</Link>
          </div>
          
          <div className={styles.linkGroup}>
            <h4>Support</h4>
            <Link href="/contact">Registry Inquiries</Link>
            <div className={styles.status}>
              <span className={styles.statusDot}></span> System Status: Online
            </div>
          </div>
        </div>
        
        <div className={styles.bottom}>
          <p>© 2026 Work History Registry. All rights reserved.</p>
          <div className={styles.legalLinks}>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
