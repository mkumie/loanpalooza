import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Clock, DollarSign } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-24 lg:py-32">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Simple, Fast</span>
              <span className="block text-primary">Financial Solutions</span>
            </h1>
            <p className="mt-6 max-w-lg text-xl text-gray-500">
              Get the financial support you need with our easy-to-use loan application process. Quick decisions, competitive rates.
            </p>
            <div className="mt-10">
              <Link to="/register">
                <Button size="lg" className="gap-2">
                  Apply Now <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-start">
              <div className="rounded-lg bg-primary-50 p-3">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">Secure Process</h3>
              <p className="mt-2 text-gray-600">
                Your data is protected with bank-level security and encryption.
              </p>
            </div>
            <div className="flex flex-col items-start">
              <div className="rounded-lg bg-primary-50 p-3">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">Quick Decisions</h3>
              <p className="mt-2 text-gray-600">
                Get a decision on your loan application within 24 hours.
              </p>
            </div>
            <div className="flex flex-col items-start">
              <div className="rounded-lg bg-primary-50 p-3">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">Competitive Rates</h3>
              <p className="mt-2 text-gray-600">
                We offer some of the most competitive rates in the market.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;