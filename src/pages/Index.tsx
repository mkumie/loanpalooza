import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Calculator, GraduationCap, Wallet, RefreshCw, Download } from "lucide-react";
import { DocumentChecklist } from "@/components/DocumentChecklist";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const navigate = useNavigate();
  const session = useSession();
  const [loanAmount, setLoanAmount] = useState<string>("");
  const [loanTerm, setLoanTerm] = useState<string>("");
  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);

  const { data: downloadableFiles } = useQuery({
    queryKey: ["downloadableFiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("downloadable_files")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleGetStarted = () => {
    if (session) {
      navigate("/apply");
    } else {
      navigate("/register");
    }
  };

  const calculateFortnightlyPayment = () => {
    const principal = parseFloat(loanAmount);
    const fortnights = parseFloat(loanTerm) * 26; // 26 fortnights in a year
    const fortnightlyInterestRate = 0.15 / 26; // 15% annual interest rate divided by 26 fortnights

    if (principal && fortnights) {
      const payment =
        (principal * fortnightlyInterestRate * Math.pow(1 + fortnightlyInterestRate, fortnights)) /
        (Math.pow(1 + fortnightlyInterestRate, fortnights) - 1);
      setMonthlyPayment(payment);
    }
  };

  const handleDownload = async (filePath: string, fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from("downloadable_files")
        .download(filePath);

      if (error) throw error;

      // Create a download link
      const url = URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-5xl font-bold text-primary">
            Trusted Financial Solutions in PNG
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            YES Finance provides accessible loan solutions to Papua New Guinea residents. 
            We offer competitive rates, flexible fortnightly repayments, and a simple online application process.
          </p>
          
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

          {/* Loan Calculator Section */}
          <Card className="p-6 max-w-md mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Loan Calculator</h2>
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
                onClick={calculateFortnightlyPayment}
                className="w-full"
                disabled={!loanAmount || !loanTerm}
              >
                Calculate Payment
              </Button>
              {monthlyPayment && (
                <div className="mt-4 p-4 bg-primary/10 rounded-lg">
                  <p className="text-sm text-gray-600">Estimated Fortnightly Payment</p>
                  <p className="text-2xl font-bold text-primary">
                    K {monthlyPayment.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    *Based on 15% annual interest rate
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Downloadable Files Section */}
          {downloadableFiles && downloadableFiles.length > 0 && (
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Download className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Important Documents</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {downloadableFiles.map((file) => (
                  <Card key={file.id} className="p-4 hover:bg-gray-50">
                    <div className="space-y-2">
                      <h3 className="font-medium">{file.title}</h3>
                      {file.description && (
                        <p className="text-sm text-gray-600">{file.description}</p>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => handleDownload(file.file_path, file.file_name)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          )}

          {/* Document Requirements Section */}
          <div className="py-8">
            <h2 className="text-2xl font-semibold mb-6">Required Documents</h2>
            <DocumentChecklist />
          </div>

          <div className="space-y-4">
            <Button size="lg" onClick={handleGetStarted} className="text-lg px-8">
              Apply Now
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