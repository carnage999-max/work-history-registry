"use client";

import { useState } from "react";
import styles from './EmployerAttestationModal.module.css';

interface EmployerAttestationModalProps {
  isOpen: boolean;
  onConfirm: (data: { employeeName: string; employeeRegistryId: string; eventType: string }) => void;
  onCancel: () => void;
  employerName: string;
}

export const EmployerAttestationModal = ({ 
  isOpen, 
  onConfirm, 
  onCancel, 
  employerName
}: EmployerAttestationModalProps) => {
  const [employeeName, setEmployeeName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [eventType, setEventType] = useState("HIRED");
  const [step, setStep] = useState(1);

  if (!isOpen) return null;

  const handleNext = () => {
    if (employeeName && employeeId) setStep(2);
  };

  const handleConfirm = () => {
    onConfirm({ employeeName, employeeRegistryId: employeeId, eventType });
    setStep(1);
    setEmployeeName("");
    setEmployeeId("");
  };

  const maskedId = employeeId.length > 4 ? `***-**-${employeeId.slice(-4)}` : employeeId;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            {step === 1 ? "Record Detail Entry" : "Institutional Attestation"}
          </h2>
        </div>
        
        <div className={styles.body}>
          {step === 1 ? (
            <div className={styles.form}>
              <div className={styles.field}>
                <div className={styles.labelWrapper}>
                  <label>Employee Legal Name</label>
                  <div className={styles.tooltip}>
                    i
                    <span className={styles.tooltipText}>
                      The full legal name of the individual as it appears on official institutional payroll and tax records.
                    </span>
                  </div>
                </div>
                <input 
                  type="text" 
                  value={employeeName} 
                  onChange={(e) => setEmployeeName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                  required
                />
              </div>
              <div className={styles.field}>
                <div className={styles.labelWrapper}>
                  <label>SSN / Employee Identifier</label>
                  <div className={styles.tooltip}>
                    i
                    <span className={styles.tooltipText}>
                      Raw government ID or custom payroll ID. This value will be cryptographically hashed (SHA-256) and the raw input will NEVER be stored in the Registry database.
                    </span>
                  </div>
                </div>
                <input 
                  type="text" 
                  value={employeeId} 
                  onChange={(e) => setEmployeeId(e.target.value)}
                  placeholder="Enter raw ID for secure hashing"
                  required
                />
              </div>
              <div className={styles.field}>
                <div className={styles.labelWrapper}>
                  <label>Event Classification</label>
                  <div className={styles.tooltip}>
                    i
                    <span className={styles.tooltipText}>
                      The official Nature of Action being recorded (Hiring, Separation, or Formal Position Change).
                    </span>
                  </div>
                </div>
                <select value={eventType} onChange={(e) => setEventType(e.target.value)}>
                  <option value="HIRED">HIRED / COMMENCEMENT</option>
                  <option value="TERMINATED">TERMINATED / SEPARATION</option>
                  <option value="PROMOTED">POSITION CHANGE / ADVANCEMENT</option>
                </select>
              </div>
            </div>
          ) : (
            <>
              <p className={styles.text}>
                I, acting as an authorized representative of <strong>{employerName}</strong>, 
                hereby attest under penalty of perjury that the professional history records for 
                <strong> {employeeName} (Masked Reference: {maskedId})</strong> are accurate, complete, and derived from official payroll records.
              </p>
              <div className={styles.legalNotice}>
                Submitting this record will permanently store a <strong>Blind Index Hash</strong> in the Registry. No raw government identifiers will be persisted.
              </div>
            </>
          )}
        </div>

        <div className={styles.footer}>
          {step === 1 ? (
            <>
              <button className="secondary-button" onClick={onCancel}>Cancel</button>
              <button 
                className="auth-button" 
                onClick={handleNext}
                disabled={!employeeName || !employeeId}
              >
                Proceed to Secure Attestation
              </button>
            </>
          ) : (
            <>
              <button className="secondary-button" onClick={() => setStep(1)}>Edit Data</button>
              <button className="auth-button" onClick={handleConfirm}>Confirm & Certify Hash</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
