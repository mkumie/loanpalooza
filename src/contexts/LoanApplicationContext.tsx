import React, { createContext, useContext, useState } from 'react';

export interface LoanApplicationData {
  // Personal Details
  firstName: string;
  surname: string;
  dateOfBirth: string;
  gender: string;
  maritalStatus: string;
  district: string;
  village: string;
  homeProvince: string;
  // Employment Details
  employmentStatus: string;
  employerName: string;
  occupation: string;
  monthlyIncome: string;
  employmentLength: string;
  workAddress: string;
  workPhone: string;
  // Loan Details
  loanAmount: string;
  loanPurpose: string;
  repaymentPeriod: string;
  existingLoans: boolean;
  existingLoanDetails: string;
  // Reference Details
  referenceFullName: string;
  referenceRelationship: string;
  referenceAddress: string;
  referencePhone: string;
  referenceOccupation: string;
  // Bank Account Details
  bankName: string;
  accountNumber: string;
  accountType: string;
  branchName: string;
  accountHolderName: string;
}

interface LoanApplicationContextType {
  formData: LoanApplicationData;
  setFormData: React.Dispatch<React.SetStateAction<LoanApplicationData>>;
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  isSubmitting: boolean;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoanApplicationContext = createContext<LoanApplicationContextType | undefined>(undefined);

export const useLoanApplication = () => {
  const context = useContext(LoanApplicationContext);
  if (!context) {
    throw new Error('useLoanApplication must be used within a LoanApplicationProvider');
  }
  return context;
};

export const LoanApplicationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<LoanApplicationData>({
    firstName: "",
    surname: "",
    dateOfBirth: "",
    gender: "",
    maritalStatus: "",
    district: "",
    village: "",
    homeProvince: "",
    employmentStatus: "",
    employerName: "",
    occupation: "",
    monthlyIncome: "",
    employmentLength: "",
    workAddress: "",
    workPhone: "",
    loanAmount: "",
    loanPurpose: "",
    repaymentPeriod: "",
    existingLoans: false,
    existingLoanDetails: "",
    referenceFullName: "",
    referenceRelationship: "",
    referenceAddress: "",
    referencePhone: "",
    referenceOccupation: "",
    bankName: "",
    accountNumber: "",
    accountType: "",
    branchName: "",
    accountHolderName: "",
  });

  return (
    <LoanApplicationContext.Provider
      value={{
        formData,
        setFormData,
        currentStep,
        setCurrentStep,
        isSubmitting,
        setIsSubmitting,
      }}
    >
      {children}
    </LoanApplicationContext.Provider>
  );
};