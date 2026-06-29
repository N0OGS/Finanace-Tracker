import React from 'react';
import { motion } from 'motion/react';
import { Wallet } from 'lucide-react';

export function SplashView() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-[#0a0a0a] relative overflow-hidden z-50">
      
      {/* Decorative background blurs */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute top-0 right-0 w-64 h-64 bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
        className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-400/20 dark:bg-indigo-500/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"
      />

      <motion.div 
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ 
          type: "spring",
          stiffness: 260,
          damping: 20,
          duration: 1 
        }}
        className="relative z-10"
      >
        <div className="w-28 h-28 bg-white/60 dark:bg-white/10 backdrop-blur-xl border border-white/40 dark:border-white/20 rounded-[2rem] flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2)] mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-white/40 dark:from-white/20 to-transparent rounded-[2rem] opacity-50" />
          <Wallet className="w-14 h-14 text-blue-600 dark:text-white drop-shadow-sm dark:drop-shadow-lg relative z-10" strokeWidth={1.5} />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="text-center relative z-10"
      >
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight drop-shadow-sm">Financially</h1>
        <p className="text-gray-500 dark:text-blue-200/70 text-lg font-medium tracking-wide drop-shadow-sm">Your Personal Wealth Manager</p>
      </motion.div>
    </div>
  );
}
