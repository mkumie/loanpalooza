import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProviders } from "@/components/providers/AppProviders";
import { routes } from "@/config/routes";
import { Footer } from "@/components/Footer";

const App = () => {
  return (
    <AppProviders>
      <div className="min-h-screen flex flex-col">
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {routes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}
          </Routes>
          <Footer />
        </BrowserRouter>
      </div>
    </AppProviders>
  );
};

export default App;