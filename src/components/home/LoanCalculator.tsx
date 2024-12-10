import React, { useState } from 'react';
import { Calculator } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const LoanCalculator = () => {
  const [loanAmount, setLoanAmount] = useState<string>("");
  const [fortnights, setFortnights] = useState<string>("");
  const [fortnightlyPayment, setFortnightlyPayment] = useState<number | null>(null);

  const calculateFortnightlyPayment = () => {
    const principal = parseFloat(loanAmount);
    const totalFortnights = parseInt(fortnights);
    const fortnightlyInterestRate = 0.15 / 26; // 15% annual interest rate divided by 26 fortnights

    if (principal && totalFortnights) {
      const payment =
        (principal * fortnightlyInterestRate * Math.pow(1 + fortnightlyInterestRate, totalFortnights)) /
        (Math.pow(1 + fortnightlyInterestRate, totalFortnights) - 1);
      setFortnightlyPayment(payment);
    }
  };

  return (
    <Card className="p-6 max-w-md mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Fortnightly Loan Calculator</h2>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="loanAmount">Loan Amount (K)</Label>
          <Input
            id="loanAmount"
            type="number"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
            placeholder="Enter loan amount"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fortnights">Number of Fortnights (1-52)</Label>
          <Input
            id="fortnights"
            type="number"
            min="1"
            max="52"
            value={fortnights}
            onChange={(e) => {
              const value = Math.min(Math.max(parseInt(e.target.value) || 1, 1), 52);
              setFortnights(value.toString());
            }}
            placeholder="Enter number of fortnights"
          />
          {fortnights && (
            <p className="text-sm text-gray-500">
              Loan term: {Math.floor(parseInt(fortnights) / 26)} years and {parseInt(fortnights) % 26} fortnights
            </p>
          )}
        </div>
        <Button
          onClick={calculateFortnightlyPayment}
          className="w-full"
          disabled={!loanAmount || !fortnights}
        >
          Calculate Fortnightly Payment
        </Button>
        {fortnightlyPayment && (
          <div className="mt-4 p-4 bg-primary/10 rounded-lg">
            <p className="text-sm text-gray-600">Estimated Fortnightly Payment</p>
            <p className="text-2xl font-bold text-primary">
              K {fortnightlyPayment.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              *Based on 15% annual interest rate
            </p>
            <p className="text-xs text-gray-500">
              Total {fortnights} fortnightly payments
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};