"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Header.module.css';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSignoutConfirm, setShowSignoutConfirm] = useState(false);
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await logout();
    showToast("Session securely terminated.", "success");
    setShowSignoutConfirm(false);
    setIsOpen(false);
    router.push('/');
    router.refresh();
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <Image 
            src="/work-history-registry.png" 
            alt="Work History Registry Logo" 
            width={48} 
            height={48} 
            className={styles.logoImage}
          />
          WORK<span>HISTORY</span>
        </Link>
        
        <nav className={styles.nav}>
          <Link href="/verify" className={pathname === '/verify' ? styles.active : ''}>Verify</Link>
          <Link href="/employers" className={pathname === '/employers' ? styles.active : ''}>Employers</Link>
          {!user && (
            <Link href="/employee/dashboard" className={pathname === '/employee/dashboard' ? styles.active : ''}>Employees</Link>
          )}
          <Link href="/how-it-works" className={pathname === '/how-it-works' ? styles.active : ''}>How it works</Link>
          {user && (
            <Link href="/employers" className={styles.portalLink}>Institutional Portal</Link>
          )}
        </nav>

        <div className={styles.auth}>
          {!user ? (
            <>
              <Link href="/login" className={styles.login}>Sign In</Link>
              <Link href="/register" className={styles.register}>Institutional Access</Link>
            </>
          ) : (
            <>
              {(user.email === "nathan@membershipauto.com" || user.email === "cod3.culture@gmail.com") && (
                <Link href="/admin" className={styles.adminBtn}>Governance</Link>
              )}
              <span className={styles.userInfo}>
                {user.name} <span className={styles.statusBadge}>{user.status}</span>
              </span>
              <button onClick={() => setShowSignoutConfirm(true)} className={styles.logoutButton}>Sign Out</button>
            </>
          )}
        </div>

        <button 
          className={styles.menuButton} 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          <span className={`${styles.menuIcon} ${isOpen ? styles.open : ''}`}></span>
        </button>

        {isOpen && (
          <div className={styles.mobileMenu}>
            <div className={styles.mobileMenuHeader}>
              <button 
                className={styles.closeButton} 
                onClick={() => setIsOpen(false)}
              >
                &times;
              </button>
            </div>
            <nav className={styles.mobileNav}>
              <Link href="/verify" onClick={() => setIsOpen(false)}>Verify</Link>
              <Link href="/employers" onClick={() => setIsOpen(false)}>Employers</Link>
              {!user && (
                <Link href="/employee/dashboard" onClick={() => setIsOpen(false)}>Employees</Link>
              )}
              <Link href="/how-it-works" onClick={() => setIsOpen(false)}>How it works</Link>
              {user && (
                <Link href="/employers" onClick={() => setIsOpen(false)} className={styles.mobilePortalLink}>Institutional Portal</Link>
              )}
              <div className={styles.mobileAuth}>
                {!user ? (
                  <>
                    <Link href="/login" onClick={() => setIsOpen(false)} className={styles.mobileLogin}>Sign In</Link>
                    <Link href="/register" onClick={() => setIsOpen(false)} className={styles.mobileRegister}>Institutional Access</Link>
                  </>
                ) : (
                  <>
                    <div className={styles.mobileUserInfo}>
                       {user.name} ({user.status})
                    </div>
                    {(user.email === "nathan@membershipauto.com" || user.email === "cod3.culture@gmail.com") && (
                      <Link href="/admin" onClick={() => setIsOpen(false)} className={styles.mobileAdminBtn}>Governance Console</Link>
                    )}
                    <button onClick={() => setShowSignoutConfirm(true)} className={styles.mobileLogoutButton}>Sign Out</button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>

      {showSignoutConfirm && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(15, 23, 42, 0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 999
        }}>
          <div style={{
            background: "white",
            padding: "32px",
            borderRadius: "12px",
            maxWidth: "400px",
            width: "90%",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
          }}>
            <h2 style={{ fontSize: "1.25rem", color: "var(--slate)", fontWeight: "700", marginBottom: "16px" }}>Confirm Sign Out</h2>
            <p style={{ color: "var(--graphite)", fontSize: "0.9375rem", lineHeight: 1.6, marginBottom: "24px" }}>
              Are you sure you want to securely terminate your active session? Unsaved operations may be lost.
            </p>
            <div style={{ display: "flex", justifyItems: "center", justifyContent: "flex-end", gap: "12px" }}>
              <button 
                onClick={() => setShowSignoutConfirm(false)}
                className="secondary-button"
                style={{ padding: "8px 16px" }}
              >
                Cancel
              </button>
              <button 
                onClick={handleLogout}
                className="auth-button"
                style={{ padding: "8px 16px" }}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
