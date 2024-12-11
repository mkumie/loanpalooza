import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { DocumentChecklist } from "@/components/DocumentChecklist";
import { LoanCalculator } from "@/components/home/LoanCalculator";
import { LoanFeatures } from "@/components/home/LoanFeatures";
import { DownloadableFiles } from "@/components/home/DownloadableFiles";
import { REQUIRED_DOCUMENTS } from "@/constants/documentRequirements";

const Index = () => {
  const navigate = useNavigate();
  const session = useSession();

  const handleGetStarted = () => {
    if (session) {
      navigate("/apply");
    } else {
      navigate("/register");
    }
  };

  // Create empty document status array since this is just for display
  const documentStatus = REQUIRED_DOCUMENTS.map(doc => ({
    type: doc.type,
    uploaded: false
  }));

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
          
          <LoanFeatures />
          <LoanCalculator />
          <DownloadableFiles />

          {/* Document Requirements Section */}
          <div className="py-8">
            <h2 className="text-2xl font-semibold mb-6">Required Documents</h2>
            <DocumentChecklist 
              documents={REQUIRED_DOCUMENTS}
              documentStatus={documentStatus}
            />
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