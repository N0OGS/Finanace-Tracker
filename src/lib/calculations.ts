import { Income, Deduction, Expense, ViewPeriod, Frequency } from '../types';

const freqMultipliers: Record<Frequency, number> = {
  annual: 1,
  monthly: 12,
  'bi-weekly': 26,
  weekly: 52,
};

const viewDivisors: Record<ViewPeriod, number> = {
  annual: 1,
  monthly: 12,
  weekly: 52,
};

export const calculateAnnual = (amount: number, freq: Frequency) => {
  return amount * freqMultipliers[freq];
};

export const convertToPeriod = (annualAmount: number, period: ViewPeriod) => {
  return annualAmount / viewDivisors[period];
};

export const calculateFinances = (
  incomes: Income[],
  deductions: Deduction[],
  expenses: Expense[] = [],
  period: ViewPeriod
) => {
  // 1. Calculate Annual Gross
  const annualGross = incomes.reduce(
    (sum, inc) => sum + calculateAnnual(inc.amount, inc.frequency),
    0
  );

  // 2. Calculate Annual Deductions
  const annualDeductionsList = deductions.map((ded) => {
    let annualAmount = 0;
    if (ded.type === 'percentage') {
      annualAmount = annualGross * ((ded.value || 0) / 100);
    } else if (ded.type === 'fixed' && ded.frequency) {
      annualAmount = calculateAnnual(ded.value || 0, ded.frequency);
    } else if (ded.type === 'progressive' && ded.brackets) {
      let remaining = annualGross;
      for (const bracket of ded.brackets) {
        if (remaining > bracket.min) {
          const taxableInThisBracket = bracket.max ? Math.min(remaining - bracket.min, bracket.max - bracket.min) : remaining - bracket.min;
          annualAmount += taxableInThisBracket * (bracket.rate / 100);
        }
      }
    }
    return { ...ded, annualAmount };
  });

  const totalAnnualDeductions = annualDeductionsList.reduce(
    (sum, ded) => sum + ded.annualAmount,
    0
  );

  // 3. Calculate Annual Expenses
  const annualExpensesList = expenses.map((exp) => {
    return { ...exp, annualAmount: calculateAnnual(exp.amount, exp.frequency) };
  });

  const totalAnnualExpenses = annualExpensesList.reduce(
    (sum, exp) => sum + exp.annualAmount,
    0
  );

  // 4. Calculate Annual Net and Disposable Income
  const annualNet = annualGross - totalAnnualDeductions;
  const annualDisposable = annualNet - totalAnnualExpenses;

  // 5. Convert to requested period
  return {
    gross: convertToPeriod(annualGross, period),
    net: convertToPeriod(annualNet, period),
    disposable: convertToPeriod(annualDisposable, period),
    totalTaxes: convertToPeriod(totalAnnualDeductions, period),
    totalExpenses: convertToPeriod(totalAnnualExpenses, period),
    deductionsBreakdown: annualDeductionsList.map((d) => ({
      name: d.name,
      amount: convertToPeriod(d.annualAmount, period),
    })),
    expensesBreakdown: annualExpensesList.map((e) => ({
      name: e.name,
      amount: convertToPeriod(e.annualAmount, period),
    })),
  };
};

export const formatCurrency = (amount: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};
