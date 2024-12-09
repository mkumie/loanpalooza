import { Navigation } from "@/components/Navigation";
import { LoanApplicationForm } from "@/components/LoanApplicationForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="container mx-auto py-8">
        <LoanApplicationForm />
      </main>
    </div>
  );
};

export default Index;