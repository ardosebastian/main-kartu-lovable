import { LogOut } from "lucide-react";
import { Button } from "./ui/button";
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
    <header className="w-full px-4 py-4 bg-[#FFB6C1] fixed top-0 left-0 shadow-sm z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-lg font-bold text-white">Kartu Kikuk-Kikuk</h1>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleLogout}
          className="text-gray-600 hover:text-pink-600"
        >
          <LogOut className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Keluar</span>
        </Button>
      </div>
    </header>
  );
};