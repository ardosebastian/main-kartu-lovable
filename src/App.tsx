import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import MainCepat from "./pages/Game/MainCepat";
import Tutorial from "./pages/Tutorial";
import { BottomNavigation } from "./components/common/BottomNavigation";
import { Header } from "./components/common/Header";

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
        
        if (!session) {
          // Clear any stale session data
          await supabase.auth.signOut();
          localStorage.removeItem("sb-suzbpqdwrzqydsozlele-auth-token");
        }
        
        setIsAuthenticated(!!session);
      } catch (error) {
        console.error("Error checking auth status:", error);
        setIsAuthenticated(false);
        // Clear session on error
        await supabase.auth.signOut();
        localStorage.removeItem("sb-suzbpqdwrzqydsozlele-auth-token");
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session) {
        // Clear session data when auth state changes to signed out
        localStorage.removeItem("sb-suzbpqdwrzqydsozlele-auth-token");
      }
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>; 
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" replace />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <div className="flex flex-col min-h-screen overflow-hidden">
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={<ProtectedRoute><Navigate to="/main-cepat" replace /></ProtectedRoute>} />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <div className="flex flex-col min-h-screen">
                    <Header />
                    <main className="flex-grow overflow-y-auto pb-20">
                      <Profile />
                    </main>
                    <BottomNavigation />
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/main-cepat" element={
                <ProtectedRoute>
                  <div className="flex flex-col min-h-screen">
                    <Header />
                    <main className="flex-grow overflow-y-auto pb-20">
                      <MainCepat />
                    </main>
                    <BottomNavigation />
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/tutorial" element={
                <ProtectedRoute>
                  <div className="flex flex-col min-h-screen">
                    <Header />
                    <main className="flex-grow overflow-y-auto pb-20">
                      <Tutorial />
                    </main>
                    <BottomNavigation />
                  </div>
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </BrowserRouter>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;