import { useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import HomePage from "@/pages/HomePage";
import ServicePage from "@/pages/ServicePage";
import AdminPage from "@/pages/AdminPage";
import ContactPage from "@/pages/ContactPage";
import AboutPage from "@/pages/AboutPage";
import AuthPage from "@/pages/auth-page";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NotFound from "@/pages/not-found";

function Router() {
  const [location] = useLocation();
  // Scroll to top of page when location changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  
  // Don't show navbar and footer on auth page
  const showLayout = location !== '/auth';

  return (
    <>
      {showLayout && <Navbar />}
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/services/:id" component={ServicePage} />
        <ProtectedRoute path="/admin">
          <AdminPage />
        </ProtectedRoute>
        <Route path="/auth" component={AuthPage} />
        <Route path="/contact" component={ContactPage} />
        <Route path="/about" component={AboutPage} />
        <Route component={NotFound} />
      </Switch>
      {showLayout && <Footer />}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
