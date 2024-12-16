import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        localStorage.setItem("isAuthenticated", "true");
        navigate("/game");
        toast({
          title: "Login berhasil",
          description: "Selamat datang kembali!",
        });
      }
    });
  }, [navigate, toast]);

  return (
    <div 
      className="w-full min-h-screen flex items-center justify-center p-4"
      style={{
        background: "linear-gradient(225deg, #FFE29F 0%, #FFA99F 48%, #FF719A 100%)",
      }}
    >
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Masuk</h1>
        <SupabaseAuth 
          supabaseClient={supabase}
          appearance={{ 
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#FF719A',
                  brandAccent: '#FFA99F',
                }
              }
            }
          }}
          providers={[]}
          view="sign_in"
          showLinks={false}
          localization={{
            variables: {
              sign_in: {
                email_label: 'Email anda',
                password_label: 'Password',
                button_label: 'Masuk',
              }
            }
          }}
          additionalData={{
            persistSession: true // Ini akan mengaktifkan fitur "Ingat Saya"
          }}
        />
      </div>
    </div>
  );
};

export default Auth;