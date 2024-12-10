import React from 'react';
import { Card } from "@/components/ui/card";
import { Wallet, GraduationCap, RefreshCw } from "lucide-react";

export const LoanFeatures = () => {
  return (
    <div className="grid gap-6 md:grid-cols-3 max-w-3xl mx-auto py-8">
      <Card className="p-6">
        <div className="flex flex-col items-center space-y-3">
          <Wallet className="h-10 w-10 text-primary" />
          <h3 className="text-lg font-semibold">Personal Loans</h3>
          <p className="text-gray-600 text-sm">
            Quick access to funds for your personal needs with flexible repayment options
          </p>
        </div>
      </Card>
      <Card className="p-6">
        <div className="flex flex-col items-center space-y-3">
          <GraduationCap className="h-10 w-10 text-primary" />
          <h3 className="text-lg font-semibold">School Fee Loans</h3>
          <p className="text-gray-600 text-sm">
            Invest in education with our dedicated school fee financing solutions
          </p>
        </div>
      </Card>
      <Card className="p-6">
        <div className="flex flex-col items-center space-y-3">
          <RefreshCw className="h-10 w-10 text-primary" />
          <h3 className="text-lg font-semibold">Refinancing</h3>
          <p className="text-gray-600 text-sm">
            Consolidate your existing loans with better terms and lower rates
          </p>
        </div>
      </Card>
    </div>
  );
};