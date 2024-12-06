import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const Auth = () => {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "123321") {
      localStorage.setItem("isAuthenticated", "true");
      navigate("/game");
    } else {
      toast({
        variant: "destructive",
        title: "Password salah",
        description: "Silakan coba lagi",
      });
    }
  };

  return (
    <div 
      className="w-full min-h-screen flex items-center justify-center p-4"
      style={{
        background: "linear-gradient(225deg, #FFE29F 0%, #FFA99F 48%, #FF719A 100%)",
      }}
    >
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Masukkan Password</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="text-lg py-6"
          />
          <Button type="submit" className="w-full py-6 text-lg">
            Masuk
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Auth;