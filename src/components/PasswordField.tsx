import React, { useState } from "react";
import styles from "./PasswordField.module.css";

interface PasswordFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const PasswordField = ({ label, ...rest }: PasswordFieldProps) => {
  const [visible, setVisible] = useState(false);
  return (
    <div className={styles.field}>
      <label>{label}</label>
      <div className={styles.inputWrapper}>
        <input
          {...rest}
          type={visible ? "text" : "password"}
          className={styles.input}
        />
        <button
          type="button"
          className={styles.toggle}
          onClick={() => setVisible(v => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? (
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path
                fill="currentColor"
                d="M12 5c-7.633 0-11 6.5-11 7s3.367 7 11 7 11-6.5 11-7-3.367-7-11-7zm0 12c-2.761 0-5-2.239-5-5s2.239-5 5-5 5 2.239 5 5-2.239 5-5 5z"
              />
              <circle cx="12" cy="12" r="2" fill="currentColor" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path
                fill="currentColor"
                d="M12 5c-7.633 0-11 6.5-11 7s3.367 7 11 7c2.004 0 3.87-.32 5.485-.862l1.563 1.562 1.414-1.414-18-18-1.414 1.414 3.785 3.785c-1.734 1.1-3.182 2.514-4.124 3.915 1.946 2.8 5.397 5.085 10.239 5.085 2.761 0 5-2.239 5-5 0-.928-.264-1.793-.719-2.53l2.274-2.274c1.488 1.41 2.598 3.007 3.218 4.803-1.946 2.8-5.397 5.085-10.239 5.085-4.714 0-8.48-2.154-10.453-4.354l1.764-1.764c1.379 1.539 4.151 3.119 8.689 3.119 2.761 0 5-2.239 5-5 0-1.106-.358-2.13-.957-2.966l1.674-1.674c.556.88.883 1.92.883 3.102 0 2.761-2.239 5-5 5-1.335 0-2.553-.536-3.429-1.401l1.442-1.442c.238.238.512.44.828.593v.513c0 1.654-1.346 3-3 3-1.178 0-2.204-.676-2.674-1.644l1.472-1.472c.056.223.145.433.267.63l-1.299 1.299c-.292-.438-.464-.968-.464-1.522 0-1.654 1.346-3 3-3 .554 0 1.084.172 1.522.464l1.299-1.299c-.197-.122-.407-.211-.63-.267l1.472-1.472c.968.47 1.644 1.496 1.644 2.674 0 1.654-1.346 3-3 3-.171 0-.339-.012-.505-.034l-2.292 2.292c.524.332 1.128.542 1.771.542 1.654 0 3-1.346 3-3 0-.643-.21-1.247-.542-1.771l2.292-2.292c.022.166.034.334.034.505 0 2.761-2.239 5-5 5-1.106 0-2.13-.358-2.966-.957l-1.674 1.674c.88.556 1.92.883 3.102.883 2.761 0 5-2.239 5-5 0-.902-.226-1.75-.62-2.49l1.487-1.487c1.407 1.31 2.497 2.908 3.117 4.703-1.946 2.8-5.397 5.085-10.239 5.085z"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};
