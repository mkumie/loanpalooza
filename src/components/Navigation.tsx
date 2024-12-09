import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";

export const Navigation = () => {
  const session = useSession();

  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary">
              YES Finance
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {session ? (
              <Link to="/dashboard">
                <Button>Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/register">
                  <Button>Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};