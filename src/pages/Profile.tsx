import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  UserIcon, 
  KeyIcon, 
  RefreshCwIcon, 
  SaveIcon, 
  EyeIcon, 
  EyeOffIcon 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const ProfileCard: React.FC<{ 
  title: string, 
  icon: React.ElementType, 
  children: React.ReactNode 
}> = ({ title, icon: Icon, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-white/60 backdrop-blur-lg border border-pink-100/50 rounded-2xl shadow-xl mb-6 overflow-hidden"
  >
    <div className="bg-gradient-to-r from-pink-50 to-pink-100 p-4 flex items-center">
      <Icon className="w-6 h-6 mr-3 text-pink-600" />
      <h2 className="text-lg font-semibold text-pink-800">{title}</h2>
    </div>
    <div className="p-6">
      {children}
    </div>
  </motion.div>
);

const Profile: React.FC = () => {
  const [husbandNickname, setHusbandNickname] = useState('');
  const [wifeNickname, setWifeNickname] = useState('');
  const [username, setUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data, error } = await supabase
            .from('profiles')
            .select('husband_nickname, wife_nickname, username')
            .eq('id', user.id)
            .single();

          if (error) throw error;

          setHusbandNickname(data?.husband_nickname || '');
          setWifeNickname(data?.wife_nickname || '');
          setUsername(data?.username || '');
        }
      } catch (error) {
        toast.error('Gagal mengambil data profil');
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleSaveProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Cek apakah nickname kosong
        const isNicknameEmpty = !husbandNickname.trim() || !wifeNickname.trim();

        const { error } = await supabase
          .from('profiles')
          .update({ 
            husband_nickname: husbandNickname.trim() || null, 
            wife_nickname: wifeNickname.trim() || null,
            is_first_login: isNicknameEmpty
          })
          .eq('id', user.id);

        if (error) throw error;

        if (isNicknameEmpty) {
          toast.warning('Nickname pasangan kosong. Silakan lengkapi di halaman selanjutnya.');
        } else {
          toast.success('Profil berhasil diperbarui');
        }
      }
    } catch (error) {
      toast.error('Gagal memperbarui profil');
      console.error('Error updating profile:', error);
    }
  };

  const handleResetGame = () => {
    // Reset localStorage
    localStorage.removeItem('currentTurn');
    localStorage.removeItem('turnSelected');
    localStorage.removeItem('game_state');
    
    // Tutup dialog
    setIsResetDialogOpen(false);
    
    // Tampilkan notifikasi
    toast.success('Permainan berhasil direset');
    
    // Opsional: Redirect ke halaman game atau refresh
    // Misalnya: navigate('/game/main-cepat')
  };

  const handleChangePassword = async () => {
    // Validasi input
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.warning('Harap isi semua kolom password');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Konfirmasi password tidak cocok');
      return;
    }

    if (newPassword.length < 6) {
      toast.warning('Password minimal 6 karakter');
      return;
    }

    try {
      setIsLoading(true);

      // Ambil user terlebih dahulu
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast.error('Pengguna tidak terautentikasi');
        return;
      }

      // Coba login ulang untuk memverifikasi password saat ini
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: user.email || '',
        password: currentPassword
      });

      if (authError) {
        // Tangani error login spesifik
        switch (authError.message) {
          case 'Invalid login credentials':
            toast.error('Password saat ini salah');
            break;
          case 'Email not confirmed':
            toast.warning('Email belum dikonfirmasi');
            break;
          default:
            toast.error('Gagal memverifikasi akun');
        }
        return;
      }

      // Update password
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        // Tangani error update password spesifik
        switch (error.message) {
          case 'New password should be different from the current password':
            toast.warning('Password baru harus berbeda dari password saat ini');
            break;
          case 'Password does not meet complexity requirements':
            toast.warning('Password tidak memenuhi persyaratan keamanan');
            break;
          default:
            toast.error(`Gagal mengubah password: ${error.message}`);
        }
        return;
      }

      // Reset state
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      toast.success('Password berhasil diubah');
    } catch (error) {
      // Tangani error yang tidak terduga
      const errorMessage = error instanceof Error ? error.message : 'Kesalahan tidak dikenal';
      toast.error(`Terjadi kesalahan: ${errorMessage}`);
      console.error('Unexpected error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Memuat data...</div>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex-1 bg-gradient-to-br from-pink-50 to-white px-6 pt-20 pb-24 overflow-y-auto h-[calc(100vh-4rem)]"
    >
      <div className="max-w-md mx-auto space-y-6">
        <div className="bg-white/60 backdrop-blur-lg border border-pink-100/50 rounded-2xl shadow-xl mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-pink-50 to-pink-100 p-4 flex items-center">
            <UserIcon className="w-6 h-6 mr-3 text-pink-600" />
            <h2 className="text-lg font-semibold text-pink-800">Akun Saya</h2>
          </div>
          <div className="p-4">
            <div className="text-left">
              <p className="text-xs text-pink-600">Username</p>
              <h3 className="text-sm font-bold text-pink-800">{username}</h3>
            </div>
          </div>
        </div>

        <ProfileCard title="Nickname Pasangan" icon={UserIcon}>
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-pink-800">
                Nama Panggilan Suami
              </label>
              <Input 
                value={husbandNickname}
                onChange={(e) => setHusbandNickname(e.target.value)}
                placeholder="Masukkan nama panggilan suami"
                className="bg-pink-50/50 border-pink-200 focus:ring-pink-500 focus:border-pink-500"
                style={{ boxShadow: '0 0 0 2px rgba(244, 114, 182, 0.3)' }}
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-pink-800">
                Nama Panggilan Istri
              </label>
              <Input 
                value={wifeNickname}
                onChange={(e) => setWifeNickname(e.target.value)}
                placeholder="Masukkan nama panggilan istri"
                className="bg-pink-50/50 border-pink-200 focus:ring-pink-500 focus:border-pink-500"
                style={{ boxShadow: '0 0 0 2px rgba(244, 114, 182, 0.3)' }}
              />
            </div>
            <Button 
              onClick={handleSaveProfile}
              className="w-full bg-pink-500 hover:bg-pink-600 transition-colors"
            >
              <SaveIcon className="w-5 h-5 mr-2" /> Simpan
            </Button>
          </div>
        </ProfileCard>

        <ProfileCard title="Ganti Password" icon={KeyIcon}>
          <div className="space-y-4">
            <div className="relative">
              <label className="block mb-2 text-sm font-medium text-pink-800">
                Password Saat Ini
              </label>
              <Input 
                type={showPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Masukkan password saat ini"
                className="bg-pink-50/50 border-pink-200 focus:ring-pink-500 focus:border-pink-500 pr-10"
                style={{ boxShadow: '0 0 0 2px rgba(244, 114, 182, 0.3)' }}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-10 transform -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOffIcon className="w-5 h-5 text-pink-500" />
                ) : (
                  <EyeIcon className="w-5 h-5 text-pink-500" />
                )}
              </button>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-pink-800">
                Password Baru
              </label>
              <Input 
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Masukkan password baru"
                className="bg-pink-50/50 border-pink-200 focus:ring-pink-500 focus:border-pink-500"
                style={{ boxShadow: '0 0 0 2px rgba(244, 114, 182, 0.3)' }}
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-pink-800">
                Konfirmasi Password Baru
              </label>
              <Input 
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Konfirmasi password baru"
                className="bg-pink-50/50 border-pink-200 focus:ring-pink-500 focus:border-pink-500"
                style={{ boxShadow: '0 0 0 2px rgba(244, 114, 182, 0.3)' }}
              />
            </div>
            <Button 
              onClick={handleChangePassword}
              className="w-full bg-pink-500 hover:bg-pink-600 transition-colors"
            >
              <SaveIcon className="w-5 h-5 mr-2" /> Simpan Password
            </Button>
          </div>
        </ProfileCard>

        <ProfileCard title="Reset Permainan" icon={RefreshCwIcon}>
          <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="destructive" 
                className="w-full bg-red-500 hover:bg-red-600 transition-colors"
              >
                <RefreshCwIcon className="w-5 h-5 mr-2" /> Reset Seluruh Permainan
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Konfirmasi Reset Permainan</DialogTitle>
              </DialogHeader>
              <div className="text-center space-y-4">
                <p>Apakah Anda yakin ingin mereset seluruh permainan?</p>
                <div className="flex justify-center space-x-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsResetDialogOpen(false)}
                  >
                    Batal
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={handleResetGame}
                  >
                    Ya, Reset
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </ProfileCard>
      </div>
    </motion.div>
  );
};

export default Profile;
