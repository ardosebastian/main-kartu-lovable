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
    // Check if user is already authenticated
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/main-cepat");
      }
    };
    
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        try {
          console.log('Session user:', session.user);
          
          // Sinkronisasi username dengan email
          const { data: existingProfile } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', session.user.id)
            .maybeSingle();

          console.log('Existing profile:', existingProfile);

          if (!existingProfile || existingProfile.username !== session.user.email) {
            const { error: updateError } = await supabase
              .from('profiles')
              .update({ username: session.user.email })
              .eq('id', session.user.id);

            console.log('Update error:', updateError);
          }

          navigate("/main-cepat");
          toast({
            title: "Login berhasil",
            description: "Selamat datang kembali!",
          });
        } catch (error) {
          console.error("Error sinkronisasi username:", error);
          toast({
            title: "Gagal sinkronisasi",
            description: "Terjadi masalah saat sinkronisasi profil",
            variant: "destructive"
          });
        }
      }
    });

    return () => subscription.unsubscribe();
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
            persistSession: true
          }}
        />
      </div>
    </div>
  );
};

export default Auth;