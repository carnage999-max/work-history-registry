"use client";

import { useState, useEffect } from "react";
import styles from './EmployerAttestationModal.module.css';

interface Employee {
  id: string;
  email: string;
  name: string;
}

interface EmployerAttestationModalProps {
  isOpen: boolean;
  onConfirm: (data: { employeeName: string; employeeRegistryId: string; eventType: string; rehireEligible: boolean }) => void;
  onCancel: () => void;
  employerName: string;
  isLoading?: boolean;
}

export const EmployerAttestationModal = ({ 
  isOpen, 
  onConfirm, 
  onCancel, 
  employerName,
  isLoading = false
}: EmployerAttestationModalProps) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [selectedEmployeeEmail, setSelectedEmployeeEmail] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [eventType, setEventType] = useState("HIRED");
  const [rehireEligible, setRehireEligible] = useState(true);
  const [step, setStep] = useState(1);

  // Fetch employees on modal open
  useEffect(() => {
    if (isOpen && employees.length === 0) {
      fetchEmployees();
    }
  }, [isOpen, employees.length]);

  // Close dropdown when clicking outside or modal opens again
  useEffect(() => {
    if (!isOpen) {
      setShowDropdown(false);
    }
  }, [isOpen]);

  const fetchEmployees = async () => {
    setLoadingEmployees(true);
    try {
      const res = await fetch("/api/employees/list");
      if (res.ok) {
        const data = await res.json();
        setEmployees(data.employees || []);
      }
    } catch (err) {
      console.error("Failed to fetch employees", err);
    } finally {
      setLoadingEmployees(false);
    }
  };

  const handleNext = () => {
    if (selectedEmployeeId && eventType) setStep(2);
  };

  const handleConfirm = () => {
    onConfirm({ 
      employeeName: selectedEmployeeEmail, 
      employeeRegistryId: selectedEmployeeId, 
      eventType,
      rehireEligible
    });
    setStep(1);
    setSelectedEmployeeId("");
    setSelectedEmployeeEmail("");
    setEmployeeSearch("");
    setEventType("HIRED");
    setRehireEligible(true);
  };

  const handleCancel = () => {
    setStep(1);
    setSelectedEmployeeId("");
    setSelectedEmployeeEmail("");
    setEmployeeSearch("");
    setEventType("HIRED");
    setRehireEligible(true);
    onCancel();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            {step === 1 ? "Record Employment Event" : "Confirm & Record"}
          </h2>
        </div>
        
        <div className={styles.body}>
          {step === 1 ? (
            <div className={styles.form}>
              <div className={styles.field}>
                <div className={styles.labelWrapper}>
                  <label>Employee</label>
                  <div className={styles.tooltip}>
                    i
                    <span className={styles.tooltipText}>
                      Search by name or email; pick a registered employee to attest.
                    </span>
                  </div>
                </div>
                <div className={styles.autocompleteContainer}>
                  <input
                    type="text"
                    placeholder={loadingEmployees ? "Loading..." : "Search employee..."}
                    value={employeeSearch}
                    onChange={(e) => {
                      setEmployeeSearch(e.target.value);
                      setShowDropdown(true);
                      setSelectedEmployeeId("");
                      setSelectedEmployeeEmail("");
                    }}
                    onFocus={() => setShowDropdown(true)}
                    disabled={loadingEmployees}
                    autoComplete="off"
                    required
                  />
                  {showDropdown && !selectedEmployeeId && (
                    <div className={styles.dropdownMenu}>
                      {loadingEmployees ? (
                        <div className={styles.dropdownItem}>Loading...</div>
                      ) : employees.length === 0 ? (
                        <div className={styles.dropdownItem}>No employees found</div>
                      ) : (
                        employees
                          .filter(emp => 
                            employeeSearch === "" ||
                            `${emp.name} - ${emp.email}`.toLowerCase().includes(employeeSearch.toLowerCase()) ||
                            emp.name.toLowerCase().includes(employeeSearch.toLowerCase()) ||
                            emp.email.toLowerCase().includes(employeeSearch.toLowerCase())
                          )
                          .map(emp => (
                            <div
                              key={emp.id}
                              className={styles.dropdownItem}
                              onClick={() => {
                                setEmployeeSearch(`${emp.name} - ${emp.email}`);
                                setSelectedEmployeeId(emp.id);
                                setSelectedEmployeeEmail(emp.email);
                                setShowDropdown(false);
                              }}
                            >
                              <div className={styles.itemName}>{emp.name}</div>
                              <div className={styles.itemEmail}>{emp.email}</div>
                            </div>
                          ))
                      )}
                    </div>
                  )}
                </div>
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
              <div className={styles.field}>
                <div className={styles.labelWrapper}>
                  <label>Rehire Eligibility</label>
                  <div className={styles.tooltip}>
                    i
                    <span className={styles.tooltipText}>
                      Indicate whether this employee is eligible to be rehired by your institution.
                    </span>
                  </div>
                </div>
                <div className={styles.checkboxGroup}>
                  <label className={styles.checkboxLabel}>
                    <input 
                      type="checkbox"
                      checked={rehireEligible}
                      onChange={(e) => setRehireEligible(e.target.checked)}
                    />
                    <span>Eligible for re-hire</span>
                  </label>
                </div>
              </div>
            </div>
          ) : (
            <>
              <p className={styles.text}>
                I work for <strong>{employerName}</strong> and I hereby attest under penalty of perjury that 
                the professional history records for <strong>{selectedEmployeeEmail}</strong> are accurate, 
                complete, and derived from official payroll records.
              </p>
              <div className={styles.reviewBox}>
                <h4>Attestation Summary</h4>
                <div className={styles.reviewField}>
                  <span className={styles.reviewLabel}>Employee:</span>
                  <span className={styles.reviewValue}>{selectedEmployeeEmail}</span>
                </div>
                <div className={styles.reviewField}>
                  <span className={styles.reviewLabel}>Event Type:</span>
                  <span className={styles.reviewValue}>{eventType}</span>
                </div>
                <div className={styles.reviewField}>
                  <span className={styles.reviewLabel}>Rehire Eligible:</span>
                  <span className={styles.reviewValue}>{rehireEligible ? "Yes" : "No"}</span>
                </div>
              </div>
              <div className={styles.legalNotice}>
                Submitting this record will permanently store a <strong>Blind Index Hash</strong> in the Registry. No raw government identifiers will be persisted.
              </div>
            </>
          )}
        </div>

        <div className={styles.footer}>
          {step === 1 ? (
            <>
              <button className="secondary-button" onClick={handleCancel} disabled={isLoading}>Cancel</button>
              <button 
                className="auth-button" 
                onClick={handleNext}
                disabled={!selectedEmployeeId || loadingEmployees || isLoading}
              >
                Proceed to Secure Attestation
              </button>
            </>
          ) : (
            <>
              <button className="secondary-button" onClick={() => setStep(1)} disabled={isLoading}>Edit Data</button>
              <button 
                className="auth-button" 
                onClick={handleConfirm}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Confirm & Certify Hash"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
