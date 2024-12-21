import React, { useState } from 'react';
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
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  const handleResetGame = () => {
    console.log('Reset Game');
    setIsResetDialogOpen(false);
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      alert('Password tidak cocok');
      return;
    }
    console.log('Ganti Password');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex-1 bg-gradient-to-br from-pink-50 to-white px-6 pt-20 pb-24 overflow-y-auto h-[calc(100vh-4rem)]"
    >
      <div className="max-w-md mx-auto space-y-6">
        <ProfileCard title="Profil Pasangan" icon={UserIcon}>
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-pink-800">
                Nama Panggilan Suami
              </label>
              <Input 
                value={husbandNickname}
                onChange={(e) => setHusbandNickname(e.target.value)}
                placeholder="Masukkan nama panggilan suami"
                className="bg-pink-50/50 border-pink-200 focus:ring-pink-300"
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
                className="bg-pink-50/50 border-pink-200 focus:ring-pink-300"
              />
            </div>
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
                className="bg-pink-50/50 border-pink-200 focus:ring-pink-300 pr-10"
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
                className="bg-pink-50/50 border-pink-200 focus:ring-pink-300"
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
                className="bg-pink-50/50 border-pink-200 focus:ring-pink-300"
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
