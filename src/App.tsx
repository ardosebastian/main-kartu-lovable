import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Auth from "./pages/Auth";
import Game from "./pages/Game";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Session:', session);
        setIsAuthenticated(!!session);
      } catch (error) {
        console.error("Error checking auth status:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', session);
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  console.log('isAuthenticated:', isAuthenticated);

  if (isAuthenticated === null) {
    return <div>Loading...</div>; 
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Auth />} />
            <Route 
              path="/game" 
              element={
                <ProtectedRoute>
                  <Game />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </BrowserRouter>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;