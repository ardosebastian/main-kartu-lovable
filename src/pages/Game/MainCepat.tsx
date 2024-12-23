import React, { useState, useEffect } from "react";
import Card from "@/components/game/Card"; 
import type { Question, LevelInfo } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/common/Header";
import { toast } from "sonner";
import { Progress } from "@/components/common/progress";
import { questions } from "@/lib/data/questions";
import { levels } from "@/lib/data/levels";
import { BottomNavigation } from "@/components/common/BottomNavigation";
import { supabase } from '@/integrations/supabase/client';
import { FirstLoginModal } from '@/components/common/FirstLoginModal';
import { TurnSelectionModal } from "@/components/game/TurnSelectionModal";

// Tambahkan style untuk animasi
const fadeAnimation = `
  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .animate-fade-out {
    animation: fadeOut 0.3s ease-out forwards;
  }

  .animate-fade-in {
    animation: fadeIn 0.3s ease-out forwards;
  }
`;

const slideAnimation = `
  @keyframes slideOutLeft {
    from { 
      transform: translateX(0);
      opacity: 1;
    }
    to { 
      transform: translateX(-100%);
      opacity: 0;
    }
  }

  @keyframes slideInRight {
    from { 
      transform: translateX(100%);
      opacity: 0;
    }
    to { 
      transform: translateX(0);
      opacity: 1;
    }
  }

  .animate-slide-out {
    animation: slideOutLeft 0.5s ease-out forwards;
  }

  .animate-slide-in {
    animation: slideInRight 0.5s ease-out forwards;
  }

  .turn-text-container {
    position: relative;
    width: 100%;
    height: 2rem;
    overflow: hidden;
  }

  .turn-text {
    position: absolute;
    width: 100%;
    left: 0;
  }
`;

const turnAnimation = `
  @keyframes fadeInUp {
    from { 
      opacity: 0;
      transform: translateY(20px);
    }
    to { 
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeOutDown {
    from { 
      opacity: 1;
      transform: translateY(0);
    }
    to { 
      opacity: 0;
      transform: translateY(20px);
    }
  }

  .animate-fade-in-up {
    animation: fadeInUp 0.5s ease-out forwards;
  }

  .animate-fade-out-down {
    animation: fadeOutDown 0.5s ease-out forwards;
  }

  .turn-text-container {
    position: relative;
    width: 100%;
    height: 2rem;
    overflow: hidden;
  }

  .turn-text {
    position: absolute;
    width: 100%;
    left: 0;
  }
`;

const MainCepat = () => {
  console.log('MainCepat component rendered');
  console.log('Questions:', questions);
  console.log('Levels:', levels);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentLevel, setCurrentLevel] = useState<1 | 2 | 3>(1);
  const [questionsCompleted, setQuestionsCompleted] = useState(0);
  const [isFirstLoginModalOpen, setIsFirstLoginModalOpen] = useState(false);
  const [showTurnSelection, setShowTurnSelection] = useState(false);
  const [currentTurn, setCurrentTurn] = useState<string | null>(null);
  const [playerData, setPlayerData] = useState<{
    husbandNickname: string | null;
    wifeNickname: string | null;
  }>({ 
    husbandNickname: null, 
    wifeNickname: null
  });

  useEffect(() => {
    console.log('MainCepat useEffect triggered');
    const welcomeTimer = setTimeout(() => {
      console.log('Welcome timer completed');
      console.log('Setting showWelcome to false');
      setShowWelcome(false);
    }, 100);

    return () => clearTimeout(welcomeTimer);
  }, []);

  useEffect(() => {
    const checkFirstLogin = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data, error } = await supabase
            .from('profiles')
            .select('is_first_login')
            .eq('id', user.id)
            .single();

          if (error) throw error;

          if (data?.is_first_login) {
            setIsFirstLoginModalOpen(true);
          }
        }
      } catch (error) {
        console.error('Error checking first login:', error);
      }
    };

    checkFirstLogin();
  }, []);

  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from('profiles')
            .select('husband_nickname, wife_nickname')
            .eq('id', user.id)
            .single();

          if (error) throw error;

          setPlayerData({
            husbandNickname: data.husband_nickname,
            wifeNickname: data.wife_nickname
          });
          
          // Tampilkan modal pemilihan giliran setelah data dimuat
          if (data.husband_nickname && data.wife_nickname) {
            setShowTurnSelection(true);
          }
        }
      } catch (error) {
        console.error('Error fetching player data:', error);
        toast.error('Gagal memuat data pemain');
      }
    };

    fetchPlayerData();
  }, []);

  const handleNext = () => {
    console.log('handleNext called');
    const nextQuestionIndex = (currentQuestion + 1) % questions.length;
    const questionsInCurrentLevel = questions.filter(q => q.level === currentLevel);
    const completedInLevel = questionsCompleted + 1;
    
    console.log('Next question index:', nextQuestionIndex);
    console.log('Questions in current level:', questionsInCurrentLevel);
    
    // Check if we should level up
    if (completedInLevel >= questionsInCurrentLevel.length && currentLevel < 3) {
      const nextLevel = (currentLevel + 1) as 1 | 2 | 3;
      const nextLevelInfo = levels.find(l => l.id === nextLevel);
      
      toast.success(`Level Up! Selamat datang di level "${nextLevelInfo?.name}"`, {
        description: nextLevelInfo?.description,
        duration: 5000,
      });
      
      setCurrentLevel(nextLevel);
      setQuestionsCompleted(0);
    } else {
      setQuestionsCompleted(completedInLevel);
    }
    
    setCurrentQuestion(nextQuestionIndex);
  };

  const handleTurnSelected = (player: string) => {
    setCurrentTurn(player);
    setTimeout(() => {
      setShowTurnSelection(false);
    }, 2000);
  };

  const handleCardClick = (isFlipping: boolean) => {
    if (isFlipping) {
      // Saat kartu diflip ke belakang, fade out status giliran
      const turnElement = document.querySelector('.turn-text');
      if (turnElement) {
        turnElement.classList.add('animate-fade-out-down');
      }
    }
  };

  const handleTurnChange = () => {
    setTimeout(() => {
      setCurrentTurn(prev => {
        if (!prev) return prev;
        return prev === playerData.husbandNickname 
          ? playerData.wifeNickname 
          : playerData.husbandNickname;
      });

      // Reset class dan tambahkan animasi fade in up
      const turnElement = document.querySelector('.turn-text');
      if (turnElement) {
        turnElement.classList.remove('animate-fade-out-down');
        turnElement.classList.add('animate-fade-in-up');
        
        // Hapus class fade in setelah animasi selesai
        setTimeout(() => {
          turnElement.classList.remove('animate-fade-in-up');
        }, 500);
      }
    }, 500); // Dipercepat dari 1000 menjadi 500ms
  };

  return (
    <div>
      <style>{fadeAnimation}</style>
      <style>{slideAnimation}</style>
      <style>{turnAnimation}</style>
      <FirstLoginModal 
        isOpen={isFirstLoginModalOpen} 
        onClose={() => setIsFirstLoginModalOpen(false)} 
      />
      {playerData.husbandNickname && playerData.wifeNickname && (
        <TurnSelectionModal
          isOpen={showTurnSelection}
          onClose={() => setShowTurnSelection(false)}
          husbandNickname={playerData.husbandNickname}
          wifeNickname={playerData.wifeNickname}
          onTurnSelected={handleTurnSelected}
        />
      )}
      <div 
        className="w-full min-h-[100dvh] flex items-center justify-center pt-20"
        style={{
          background: "linear-gradient(225deg, #FFE29F 0%, #FFA99F 48%, #FF719A 100%)",
        }}
      >
        <div className="w-full max-w-md px-4 py-8 flex flex-col items-center">
          {currentTurn && (
            <div className="turn-text-container -mt-2">
              <p className="text-pink-500 font-bold text-xl turn-text text-center">
                {currentTurn} buka kartunya
              </p>
            </div>
          )}
          <AnimatePresence>
            {!showWelcome && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center gap-0 px-4 -mt-2 md:-mt-4 md:mt-2"
              >
                <Card 
                  onNext={handleNext} 
                  question={questions[currentQuestion]}
                  onTurnChange={handleTurnChange}
                  onCardFlip={handleCardClick}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default MainCepat;
