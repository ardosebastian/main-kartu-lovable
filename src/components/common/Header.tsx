import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const Header = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("isAuthenticated");
    navigate("/");
  };

  return (
    <header className="w-full px-4 py-5 bg-[#fc8099] fixed top-0 left-0 shadow-md z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center relative">
        <div className="w-full sm:w-auto flex justify-center sm:justify-start">
          <h1 className="text-xl font-bold text-white drop-shadow-sm transition-all hover:scale-105">
            Kartu Kikuk-Kikuk
          </h1>
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleLogout}
          className="absolute right-0 sm:relative text-white hover:text-pink-700 hover:bg-white/20 transition-all"
        >
          <LogOut className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Keluar</span>
        </Button>
      </div>
    </header>
  );
};
