import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface TurnSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  husbandNickname: string;
  wifeNickname: string;
  onTurnSelected: (player: string) => void;
}

export const TurnSelectionModal = ({
  isOpen,
  onClose,
  husbandNickname,
  wifeNickname,
  onTurnSelected,
}: TurnSelectionModalProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentPlayers, setCurrentPlayers] = useState([
    husbandNickname, 
    wifeNickname
  ]);

  console.log('Turn Selection Modal rendered:', { isOpen, husbandNickname, wifeNickname });

  const randomizeTurn = () => {
    setIsAnimating(true);
    const finalPlayer = Math.random() < 0.5 ? husbandNickname : wifeNickname;
    
    let count = 0;
    const maxFlips = 20;
    const flipInterval = setInterval(() => {
      count++;
      
      setCurrentPlayers(prev => {
        const shuffled = [...prev].sort(() => Math.random() - 0.5);
        return shuffled;
      });
      
      if (count >= maxFlips) {
        clearInterval(flipInterval);
        setCurrentPlayers([
          finalPlayer, 
          finalPlayer === husbandNickname ? wifeNickname : husbandNickname
        ]);
        setIsAnimating(false);
        onTurnSelected(finalPlayer);
      }
    }, 80);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-md w-[90vw] max-w-[350px] rounded-3xl overflow-hidden flex items-center justify-center border-none outline-none focus:outline-none focus:ring-0 hover:border-none [&>button.absolute]:hidden"
        style={{
          background: "linear-gradient(135deg, #2C2C2C 0%, #3A3A3A 48%, #4A4A4A 100%)",
        }}
      >
        <VisuallyHidden>
          <DialogTitle>Tap Tombol Acak Giliran</DialogTitle>
          <DialogDescription>Tekan tombol untuk mengacak giliran bermain</DialogDescription>
        </VisuallyHidden>
        
        <div className="text-center space-y-2 p-4 w-full flex flex-col items-center justify-center">
          <h2 className="text-lg font-semibold text-white whitespace-nowrap">
            Siapa yang Mulai Duluan? 🎲
          </h2>
          
          <div className="my-2 min-h-[70px] w-full flex flex-col items-center justify-center">
            <AnimatePresence>
              {currentPlayers.map((player, index) => (
                <motion.div
                  key={player}
                  initial={{ opacity: 0, scale: 1, y: 20 }}
                  animate={{ 
                    opacity: 1,
                    scale: index === 0 && !isAnimating ? 1.3 : 1,
                    y: 0
                  }}
                  exit={{ opacity: 0, scale: 1, y: -20 }}
                  transition={{ 
                    duration: 0.3,
                    type: "spring",
                    stiffness: 300,
                    damping: 15
                  }}
                  className={`font-bold text-gray-500 ${
                    index === 0 && !isAnimating 
                      ? 'text-white text-xl' 
                      : 'text-lg'
                  }`}
                >
                  {player}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <Button
            onClick={randomizeTurn}
            disabled={isAnimating}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white rounded-full"
          >
            {isAnimating ? "Mengacak..." : "Acak Giliran"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
