import React from 'react';
import { motion } from 'framer-motion';

const Tutorial: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-2xl font-bold mb-6 text-center">Tutorial Kartu Kikuk-Kikuk</h1>
      
      <div className="space-y-4 max-w-xl mx-auto">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">🃏 Cara Bermain</h2>
          <p className="text-gray-600">
            Selamat datang di Kartu Kikuk-Kikuk! Permainan ini menguji kemampuan logika dan kecepatan Anda.
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">🏆 Mode Permainan</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Main Cepat: Jawab pertanyaan secepat mungkin</li>
            <li>Main Bertahap: Tingkatkan level secara bertahap</li>
          </ul>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">💡 Tips</h2>
          <p className="text-gray-600">
            Fokus, teliti, dan jangan terburu-buru. Setiap kartu memiliki tantangan tersendiri!
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Tutorial;
