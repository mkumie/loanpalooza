import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const session = useSession();
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (session) {
      // Get the redirect path from location state, default to dashboard
      const from = (location.state as any)?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        // Extract user metadata from social login
        const { user } = session;
        const metadata = user.user_metadata;

        // Update profile with social login data if available
        if (metadata) {
          const { data: existingProfile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (!profileError && existingProfile && !existingProfile.first_name) {
            await supabase
              .from('profiles')
              .update({
                first_name: metadata.full_name?.split(' ')[0] || metadata.first_name,
                surname: metadata.full_name?.split(' ').slice(1).join(' ') || metadata.last_name,
                gender: metadata.gender,
                updated_at: new Date().toISOString(),
              })
              .eq('id', user.id);
          }
        }
        
        // Get the redirect path from location state, default to dashboard
        const from = (location.state as any)?.from?.pathname || "/dashboard";
        navigate(from, { replace: true });
      } else if (event === 'SIGNED_OUT') {
        setAuthError(null);
      }
    });

    // Check URL for error parameters
    const params = new URLSearchParams(window.location.search);
    const error = params.get('error');
    const errorDescription = params.get('error_description');
    
    if (error === 'unauthorized' && errorDescription?.includes('Email not confirmed')) {
      setAuthError('Please check your email and confirm your account before logging in.');
    }

    return () => {
      subscription.unsubscribe();
    };
  }, [session, navigate, location]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto flex flex-col items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Welcome back
            </CardTitle>
            <CardDescription className="text-center">
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            {authError && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{authError}</AlertDescription>
              </Alert>
            )}
            <Auth
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: 'hsl(var(--primary))',
                      brandAccent: 'hsl(var(--primary))',
                      brandButtonText: 'hsl(var(--primary-foreground))',
                    },
                    borderWidths: {
                      buttonBorderWidth: '1px',
                      inputBorderWidth: '1px',
                    },
                    radii: {
                      borderRadiusButton: '0.5rem',
                      buttonBorderRadius: '0.5rem',
                      inputBorderRadius: '0.5rem',
                    },
                  },
                },
                className: {
                  container: 'w-full',
                  button: 'w-full px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90',
                  input: 'w-full px-3 py-2 border rounded-md',
                  message: 'text-red-500 text-sm',
                },
              }}
              theme="default"
              providers={["google", "facebook"]}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;