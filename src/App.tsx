import React, { useState, useEffect } from 'react';
import { useStore } from './lib/store';
import { DashboardView } from './components/DashboardView';
import { IncomeView } from './components/IncomeView';
import { TaxesView } from './components/TaxesView';
import { ExpensesView } from './components/ExpensesView';
import { SavingsView } from './components/SavingsView';
import { ProfileSetupView } from './components/ProfileSetupView';
import { ProfileSelectView } from './components/ProfileSelectView';
import { SplashView } from './components/SplashView';
import { PieChart, Wallet, Receipt, CreditCard, Target, Moon, Sun } from 'lucide-react';
import { cn } from './lib/utils';
import { AnimatePresence } from 'motion/react';
import * as motion from 'motion/react-client';
import { calculateFinances } from './lib/calculations';

type Tab = 'dashboard' | 'income' | 'taxes' | 'expenses' | 'savings';

export default function App() {
  const store = useStore();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('ios_app_dark_mode');
    return saved ? JSON.parse(saved) : true; // Default dark mode to true for new features
  });

  useEffect(() => {
    localStorage.setItem('ios_app_dark_mode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const finances = store.activeProfile ? calculateFinances(store.incomes, store.deductions, store.expenses, store.period) : null;

  let content = null;

  if (store.profiles.length === 0 || isCreatingProfile) {
    content = (
      <ProfileSetupView 
        onAddProfile={(name, country, currency, initialIncome, frequency) => {
          store.addProfile(name, country, currency, initialIncome, frequency);
          setIsCreatingProfile(false);
        }} 
        canCancel={store.profiles.length > 0}
        onCancel={() => setIsCreatingProfile(false)}
      />
    );
  } else if (!store.activeProfileId) {
    content = (
      <ProfileSelectView 
        profiles={store.profiles}
        onSelect={store.setActiveProfileId}
        onAdd={() => setIsCreatingProfile(true)}
        onRemove={store.removeProfile}
        onRename={store.renameProfile}
      />
    );
  } else {
    content = (
      <>
        {/* Main Content Area - Scrollable */}
        <div className="flex-1 overflow-y-auto ios-scroll-hide relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              {activeTab === 'dashboard' && (
                <DashboardView 
                  incomes={store.incomes}
                  deductions={store.deductions}
                  expenses={store.expenses}
                  period={store.period}
                  setPeriod={store.setPeriod}
                  currency={store.activeProfile?.currency}
                />
              )}
              {activeTab === 'income' && (
                <IncomeView 
                  incomes={store.incomes}
                  currency={store.activeProfile?.currency}
                  onAdd={store.addIncome}
                  onRemove={store.removeIncome}
                />
              )}
              {activeTab === 'taxes' && (
                <TaxesView 
                  deductions={store.deductions}
                  currency={store.activeProfile?.currency}
                  onAdd={store.addDeduction}
                  onRemove={store.removeDeduction}
                />
              )}
              {activeTab === 'expenses' && (
                <ExpensesView 
                  expenses={store.expenses}
                  currency={store.activeProfile?.currency}
                  onAdd={store.addExpense}
                  onRemove={store.removeExpense}
                  onUpdate={store.updateExpense}
                />
              )}
              {activeTab === 'savings' && (
                <SavingsView 
                  savingsGoals={store.savingsGoals}
                  disposableIncome={finances?.disposable || 0}
                  period={store.period}
                  currency={store.activeProfile?.currency}
                  onAdd={store.addSavingsGoal}
                  onRemove={store.removeSavingsGoal}
                  onUpdate={store.updateSavingsGoal}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Tab Bar (iOS Style) */}
        <div className="absolute pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)] bottom-0 w-full bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl border-t border-gray-200 dark:border-[#1f1f1f] shadow-[0_-4px_16px_rgba(0,0,0,0.02)] z-10">
          <div className="flex justify-around items-center h-20 px-2 pb-2">
            <TabButton 
              active={activeTab === 'dashboard'} 
              onClick={() => setActiveTab('dashboard')}
              icon={<PieChart className="w-6 h-6 mb-1" />}
              label="Overview"
            />
            <TabButton 
              active={activeTab === 'income'} 
              onClick={() => setActiveTab('income')}
              icon={<Wallet className="w-6 h-6 mb-1" />}
              label="Income"
            />
            <TabButton 
              active={activeTab === 'taxes'} 
              onClick={() => setActiveTab('taxes')}
              icon={<Receipt className="w-6 h-6 mb-1" />}
              label="Taxes"
            />
            <TabButton 
              active={activeTab === 'expenses'} 
              onClick={() => setActiveTab('expenses')}
              icon={<CreditCard className="w-6 h-6 mb-1" />}
              label="Expenses"
            />
            <TabButton 
              active={activeTab === 'savings'} 
              onClick={() => setActiveTab('savings')}
              icon={<Target className="w-6 h-6 mb-1" />}
              label="Savings"
            />
          </div>
        </div>
      </>
    );
  }

  return (
    <div className={cn("min-h-screen flex justify-center text-gray-900 dark:text-gray-100", darkMode ? "bg-[#0a0a0a]" : "bg-slate-50 selection:bg-blue-100")}>
      {/* Mobile constraint container for "iOS App" feel */}
      <div className={cn("w-full sm:max-w-md h-screen relative flex flex-col sm:border-x overflow-hidden sm:shadow-2xl font-sans", darkMode ? "bg-[#0a0a0a] border-[#1f1f1f]" : "bg-white border-gray-200")}>
        
        {!showSplash && (
          <div className="w-full flex items-center justify-between px-6 pt-6 pb-2 z-50 shrink-0 bg-transparent">
            {store.activeProfile && (activeTab !== 'setup' && activeTab !== 'select') ? (
              <div className="flex flex-col">
                <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">Active Profile</p>
                <button 
                  onClick={() => store.setActiveProfileId(null)}
                  className="flex items-center gap-2 group focus:outline-none"
                >
                  <span className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight group-hover:opacity-80 transition-opacity">
                    {store.activeProfile.name}
                  </span>
                  <div className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider group-active:scale-95 transition-transform">
                    Switch
                  </div>
                </button>
              </div>
            ) : <div />}
            
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 bg-white dark:bg-[#121212] border border-gray-200 dark:border-[#1f1f1f] rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors active:scale-95 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        )}

        <AnimatePresence mode="wait">
          {showSplash && (
            <motion.div
              key="splash"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 z-50 h-full w-full"
            >
              <SplashView />
            </motion.div>
          )}
        </AnimatePresence>

        {!showSplash && content}
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center w-full h-full pt-1 transition-colors active:scale-95",
        active ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
      )}
    >
      {icon}
      <span className="text-[10px] font-medium tracking-wide">{label}</span>
    </button>
  );
}
