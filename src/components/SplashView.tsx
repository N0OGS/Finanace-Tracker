import React from 'react';
import * as motion from 'motion/react-client';
import { Wallet } from 'lucide-react';

export function SplashView() {
  return (
    <div className="h-full w-full bg-blue-600 flex flex-col items-center justify-center p-6 text-white relative z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-2xl mb-6">
          <Wallet className="w-12 h-12 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">My Finances</h1>
        <p className="text-blue-200 font-medium tracking-wide">Take control of your money</p>
      </motion.div>
    </div>
  );
}
