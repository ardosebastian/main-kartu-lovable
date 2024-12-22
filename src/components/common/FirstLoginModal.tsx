import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { HeartIcon, SkipForwardIcon } from "lucide-react";

interface FirstLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FirstLoginModal: React.FC<FirstLoginModalProps> = ({ 
  isOpen, 
  onClose 
}) => {
  const [husbandNickname, setHusbandNickname] = useState('');
  const [wifeNickname, setWifeNickname] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveNicknames = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Debug log
        console.log('Husband Nickname:', husbandNickname);
        console.log('Wife Nickname:', wifeNickname);

        // Jika salah satu nickname kosong, set is_first_login kembali ke true
        const isFirstLogin = !husbandNickname.trim() || !wifeNickname.trim();
        console.log('Is First Login:', isFirstLogin);

        const { error } = await supabase
          .from('profiles')
          .update({ 
            husband_nickname: husbandNickname.trim() || null, 
            wife_nickname: wifeNickname.trim() || null,
            is_first_login: isFirstLogin 
          })
          .eq('id', user.id);

        if (error) throw error;

        if (!isFirstLogin) {
          toast.success('Nickname berhasil disimpan');
          onClose();
        } else {
          toast.warning('Silakan lengkapi nickname pasangan');
        }
      }
    } catch (error) {
      toast.error('Gagal menyimpan nickname');
      console.error('Error saving nicknames:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Jangan ubah is_first_login jika nickname kosong
        if (!husbandNickname.trim() && !wifeNickname.trim()) {
          toast.info('Silakan isi nickname pasangan');
          return;
        }

        const { error } = await supabase
          .from('profiles')
          .update({ 
            husband_nickname: husbandNickname.trim(), 
            wife_nickname: wifeNickname.trim(),
            is_first_login: husbandNickname.trim() && wifeNickname.trim() ? false : true 
          })
          .eq('id', user.id);

        if (error) throw error;

        if (husbandNickname.trim() && wifeNickname.trim()) {
          toast.info('Anda bisa mengubah nickname nanti di halaman profil');
          onClose();
        } else {
          toast.warning('Silakan lengkapi nickname pasangan');
        }
      }
    } catch (error) {
      toast.error('Terjadi kesalahan');
      console.error('Error skipping:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white/80 backdrop-blur-lg border border-pink-100/50 rounded-2xl">
        <DialogHeader className="bg-gradient-to-r from-pink-50 to-pink-100 p-4 -mx-6 -mt-6 rounded-t-2xl">
          <div className="flex items-center">
            <HeartIcon className="w-6 h-6 mr-3 text-pink-600" />
            <DialogTitle className="text-lg font-semibold text-pink-800">
              Selamat Datang, Pasangan!
            </DialogTitle>
          </div>
          <DialogDescription className="text-pink-600 mt-2">
            Isi nickname pasangan untuk pengalaman lebih personal
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="husbandNickname" className="text-right text-pink-800">
              Suami
            </Label>
            <Input
              id="husbandNickname"
              value={husbandNickname}
              onChange={(e) => setHusbandNickname(e.target.value)}
              className="col-span-3 border-pink-300 focus:ring-pink-500"
              placeholder="Nickname suami"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="wifeNickname" className="text-right text-pink-800">
              Istri
            </Label>
            <Input
              id="wifeNickname"
              value={wifeNickname}
              onChange={(e) => setWifeNickname(e.target.value)}
              className="col-span-3 border-pink-300 focus:ring-pink-500"
              placeholder="Nickname istri"
            />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <Button 
            variant="ghost" 
            onClick={handleSkip}
            className="text-pink-600 hover:bg-pink-100"
          >
            <SkipForwardIcon className="mr-2 h-4 w-4" />
            Isi Nanti
          </Button>
          <Button 
            onClick={handleSaveNicknames} 
            disabled={isLoading}
            className="bg-pink-600 hover:bg-pink-700 text-white"
          >
            {isLoading ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
