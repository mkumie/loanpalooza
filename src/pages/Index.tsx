import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";

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