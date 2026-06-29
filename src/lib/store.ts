import { useState, useEffect } from 'react';
import { Income, Deduction, Expense, SavingsGoal, ViewPeriod, Profile, Frequency } from '../types';
import { getTaxesForCountry } from './countryTaxes';

const defaultIncomes: Income[] = [
  { id: '1', name: 'Salary', amount: 80000, frequency: 'annual' },
];

const defaultDeductions: Deduction[] = [
  { id: '1', name: 'Federal Tax', type: 'percentage', value: 12 },
  { id: '2', name: 'Social Security', type: 'percentage', value: 6.2 },
  { id: '3', name: 'Medicare', type: 'percentage', value: 1.45 },
];

export const useStore = () => {
  const [profiles, setProfiles] = useState<Profile[]>(() => {
    const saved = localStorage.getItem('ios_app_profiles');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Migrate old profiles to ensure they have expenses and savings goals
      return parsed.map((p: any) => ({
        ...p,
        expenses: p.expenses || [],
        savingsGoals: p.savingsGoals || []
      }));
    }
    
    // migrate old data if exists
    const oldIncomes = localStorage.getItem('ios_app_incomes');
    const oldDeductions = localStorage.getItem('ios_app_deductions');
    if (oldIncomes || oldDeductions) {
        return [{
            id: 'legacy-profile',
            name: 'My Profile',
            country: 'US',
            currency: 'USD',
            incomes: oldIncomes ? JSON.parse(oldIncomes) : defaultIncomes,
            deductions: oldDeductions ? JSON.parse(oldDeductions) : defaultDeductions,
            expenses: [],
            savingsGoals: [],
            period: 'monthly' as ViewPeriod
        }];
    }
    
    return [];
  });

  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('ios_app_profiles', JSON.stringify(profiles));
  }, [profiles]);

  const activeProfile = profiles.find(p => p.id === activeProfileId);

  const addProfile = (name: string, country: string, currency: string, initialIncomeAmount: number, initialIncomeFrequency: Frequency) => {
    const initialIncomes: Income[] = [
      { id: Date.now().toString(), name: 'Salary', amount: initialIncomeAmount, frequency: initialIncomeFrequency }
    ];

    const initialTaxes = getTaxesForCountry(country).map((tax, index) => ({
      ...tax,
      id: `${Date.now()}-${index}`
    }));

    const newProfile: Profile = {
        id: Date.now().toString(),
        name,
        country,
        currency,
        incomes: initialIncomes,
        deductions: initialTaxes as Deduction[],
        expenses: [],
        savingsGoals: [],
        period: 'monthly'
    };
    setProfiles([...profiles, newProfile]);
    setActiveProfileId(newProfile.id);
  };

  const removeProfile = (id: string) => {
      setProfiles(profiles.filter(p => p.id !== id));
      if (activeProfileId === id) setActiveProfileId(null);
  };

  const updateActiveProfile = (updater: (prev: Profile) => Profile) => {
      if (!activeProfileId) return;
      setProfiles(profiles.map(p => p.id === activeProfileId ? updater(p) : p));
  };

  const renameProfile = (id: string, newName: string) => {
      setProfiles(profiles.map(p => p.id === id ? { ...p, name: newName } : p));
  };

  return {
    profiles,
    activeProfileId,
    setActiveProfileId,
    activeProfile,
    addProfile,
    removeProfile,
    renameProfile,
    
    // Fallback for missing active profile
    incomes: activeProfile?.incomes || [],
    deductions: activeProfile?.deductions || [],
    expenses: activeProfile?.expenses || [],
    savingsGoals: activeProfile?.savingsGoals || [],
    period: activeProfile?.period || 'monthly',

    setPeriod: (period: ViewPeriod) => updateActiveProfile(p => ({ ...p, period })),
    addIncome: (income: Omit<Income, 'id'>) => 
      updateActiveProfile(p => ({ ...p, incomes: [...p.incomes, { ...income, id: Date.now().toString() }] })),
    removeIncome: (id: string) => 
      updateActiveProfile(p => ({ ...p, incomes: p.incomes.filter(i => i.id !== id) })),
    updateIncome: (id: string, updated: Omit<Income, 'id'>) => 
      updateActiveProfile(p => ({ ...p, incomes: p.incomes.map(i => i.id === id ? { ...updated, id } : i) })),
    addDeduction: (deduction: Omit<Deduction, 'id'>) => 
      updateActiveProfile(p => ({ ...p, deductions: [...p.deductions, { ...deduction, id: Date.now().toString() }] })),
    removeDeduction: (id: string) => 
      updateActiveProfile(p => ({ ...p, deductions: p.deductions.filter(d => d.id !== id) })),
    updateDeduction: (id: string, updated: Omit<Deduction, 'id'>) => 
      updateActiveProfile(p => ({ ...p, deductions: p.deductions.map(d => d.id === id ? { ...updated, id } : d) })),
    addExpense: (expense: Omit<Expense, 'id'>) => 
      updateActiveProfile(p => ({ ...p, expenses: [...p.expenses, { ...expense, id: Date.now().toString() }] })),
    removeExpense: (id: string) => 
      updateActiveProfile(p => ({ ...p, expenses: p.expenses.filter(e => e.id !== id) })),
    updateExpense: (id: string, updated: Omit<Expense, 'id'>) =>
      updateActiveProfile(p => ({ ...p, expenses: p.expenses.map(e => e.id === id ? { ...updated, id } : e) })),
    addSavingsGoal: (goal: Omit<SavingsGoal, 'id'>) => 
      updateActiveProfile(p => ({ ...p, savingsGoals: [...p.savingsGoals, { ...goal, id: Date.now().toString() }] })),
    removeSavingsGoal: (id: string) => 
      updateActiveProfile(p => ({ ...p, savingsGoals: p.savingsGoals.filter(g => g.id !== id) })),
    updateSavingsGoal: (id: string, updated: Omit<SavingsGoal, 'id'>) => 
      updateActiveProfile(p => ({ ...p, savingsGoals: p.savingsGoals.map(g => g.id === id ? { ...updated, id } : g) })),
  };
};
