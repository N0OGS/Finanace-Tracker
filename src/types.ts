export type Frequency = 'annual' | 'monthly' | 'bi-weekly' | 'weekly';

export interface Income {
  id: string;
  name: string;
  amount: number;
  frequency: Frequency;
}

export interface TaxBracket {
  min: number;
  max: number | null;
  rate: number;
}

export interface Deduction {
  id: string;
  name: string;
  type: 'percentage' | 'fixed' | 'progressive'; 
  value?: number; 
  brackets?: TaxBracket[];
  frequency?: Frequency; 
}

export type ExpenseCategory = 'Housing' | 'Food' | 'Transport' | 'Utilities' | 'Entertainment' | 'Health' | 'Debt' | 'Education' | 'Other';

export interface Expense {
  id: string;
  name: string;
  amount: number;
  frequency: Frequency;
  category?: ExpenseCategory | string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
}

export type ViewPeriod = 'annual' | 'monthly' | 'weekly';

export interface Profile {
  id: string;
  name: string;
  country: string;
  currency: string;
  incomes: Income[];
  deductions: Deduction[];
  expenses: Expense[];
  savingsGoals: SavingsGoal[];
  period: ViewPeriod;
}
