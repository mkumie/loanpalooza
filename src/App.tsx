import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SessionContextProvider, useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import { LoanApplicationForm } from "./components/LoanApplicationForm";
import { Footer } from "./components/Footer";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import { toast } from "sonner";

// Protected Route wrapper component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session: currentSession }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Session check error:", error);
        toast.error("Session expired. Please login again.");
      }
      
      if (!currentSession) {
        toast.error("Please login to continue");
      }
    };

    checkSession();
  }, []);

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Create a new client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: false, // Disable retries for failed queries
    },
  },
});

// App component as a proper function component
const App: React.FC = () => {
  // Force logout on initial load to clear any stale session
  useEffect(() => {
    const hasLoggedOut = localStorage.getItem('initial_logout_completed');
    
    if (!hasLoggedOut) {
      const forceLogout = async () => {
        try {
          localStorage.clear();
          sessionStorage.clear();
          await supabase.auth.signOut();
          // Set flag after successful logout
          localStorage.setItem('initial_logout_completed', 'true');
          window.location.href = '/login';
        } catch (error) {
          console.error("Error during forced logout:", error);
        }
      };

      forceLogout();
    }
  }, []);

  return (
    <SessionContextProvider 
      supabaseClient={supabase}
      initialSession={null}
    >
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <div className="min-h-screen flex flex-col">
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<Terms />} />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/apply"
                  element={
                    <ProtectedRoute>
                      <LoanApplicationForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
              </Routes>
              <Footer />
            </BrowserRouter>
          </div>
        </TooltipProvider>
      </QueryClientProvider>
    </SessionContextProvider>
  );
};

export default App;