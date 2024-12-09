import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Calculator } from "lucide-react";
import { DocumentChecklist } from "@/components/DocumentChecklist";

const Index = () => {
  const navigate = useNavigate();
  const session = useSession();
  const [loanAmount, setLoanAmount] = useState<string>("");
  const [loanTerm, setLoanTerm] = useState<string>("");
  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);

  const handleGetStarted = () => {
    if (session) {
      navigate("/apply");
    } else {
      navigate("/register");
    }
  };

  const calculateMonthlyPayment = () => {
    const principal = parseFloat(loanAmount);
    const months = parseFloat(loanTerm) * 12;
    const interestRate = 0.15 / 12; // 15% annual interest rate

    if (principal && months) {
      const payment =
        (principal * interestRate * Math.pow(1 + interestRate, months)) /
        (Math.pow(1 + interestRate, months) - 1);
      setMonthlyPayment(payment);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-5xl font-bold text-primary">
            Fast & Easy Personal Loans
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get the financial support you need with YES Finance. We offer competitive rates, 
            flexible repayment terms, and a simple online application process.
          </p>
          
          <div className="grid gap-4 md:grid-cols-3 max-w-3xl mx-auto py-8">
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2">Quick Process</h3>
              <p className="text-gray-600">Apply online and get a decision within 24 hours</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2">Flexible Terms</h3>
              <p className="text-gray-600">Choose repayment terms that work for you</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2">Competitive Rates</h3>
              <p className="text-gray-600">Get access to affordable interest rates</p>
            </div>
          </div>

          {/* Loan Calculator Section */}
          <Card className="p-6 max-w-md mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Loan Calculator</h2>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="loanAmount">Loan Amount ($)</Label>
                <Input
                  id="loanAmount"
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  placeholder="Enter loan amount"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="loanTerm">Loan Term (Years)</Label>
                <Input
                  id="loanTerm"
                  type="number"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(e.target.value)}
                  placeholder="Enter loan term"
                />
              </div>
              <Button
                onClick={calculateMonthlyPayment}
                className="w-full"
                disabled={!loanAmount || !loanTerm}
              >
                Calculate Payment
              </Button>
              {monthlyPayment && (
                <div className="mt-4 p-4 bg-primary/10 rounded-lg">
                  <p className="text-sm text-gray-600">Estimated Monthly Payment</p>
                  <p className="text-2xl font-bold text-primary">
                    ${monthlyPayment.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    *Based on 15% annual interest rate
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Document Requirements Section */}
          <div className="py-8">
            <h2 className="text-2xl font-semibold mb-6">Required Documents</h2>
            <DocumentChecklist />
          </div>

          <div className="space-y-4">
            <Button size="lg" onClick={handleGetStarted} className="text-lg px-8">
              Get Started Now
            </Button>
            <p className="text-sm text-gray-500">
              Already have an account? <a href="/login" className="text-primary hover:underline">Sign in</a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;