import React, { useState } from 'react';
import { Income, Deduction, ViewPeriod, Frequency } from '../types';
import { Plus, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { formatCurrency } from '../lib/calculations';

interface IncomeViewProps {
  incomes: Income[];
  currency?: string;
  onAdd: (income: Omit<Income, 'id'>) => void;
  onRemove: (id: string) => void;
}

const getSymbol = (currency: string) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).formatToParts(0).find(p => p.type === 'currency')?.value || currency;
};

export function IncomeView({ incomes, currency = 'USD', onAdd, onRemove }: IncomeViewProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState<Frequency>('annual');

  const handleAdd = () => {
    if (!name || !amount) return;
    onAdd({
      name,
      amount: parseFloat(amount),
      frequency,
    });
    setName('');
    setAmount('');
    setFrequency('annual');
    setIsAdding(false);
  };

  const symbol = getSymbol(currency);

  return (
    <div className="pb-24 pt-4 px-6 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100 tracking-tight">Income</h1>
      
      <div className="space-y-3">
        {incomes.map((income) => (
          <div key={income.id} className="bg-white dark:bg-[#121212] p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-[#1f1f1f] flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100">{income.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{income.frequency} Income</p>
            </div>
            <div className="flex items-center gap-4">
              <p className="font-medium text-gray-900 dark:text-gray-100">{formatCurrency(income.amount, currency)}</p>
              <button 
                onClick={() => onRemove(income.id)}
                className="text-red-500 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 active:bg-red-100 transition-colors"
                aria-label="Delete"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}

        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="w-full py-4 flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400 font-medium active:bg-blue-50 dark:active:bg-blue-900/20 rounded-2xl transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Income Source
          </button>
        )}

        {isAdding && (
          <div className="bg-white dark:bg-[#121212] p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-[#1f1f1f] space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Source Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Real Estate"
                className="w-full p-3 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#3f3f46] rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-gray-500 dark:text-gray-400">{symbol}</span>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full p-3 pl-8 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#3f3f46] rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all dark:text-gray-100"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Frequency</label>
              <select 
                value={frequency} 
                onChange={(e) => setFrequency(e.target.value as Frequency)}
                className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all dark:text-gray-100"
              >
                <option value="annual">Annual</option>
                <option value="monthly">Monthly</option>
                <option value="bi-weekly">Bi-Weekly</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => setIsAdding(false)}
                className="flex-1 py-3 text-gray-600 dark:text-gray-400 font-medium active:bg-gray-100 dark:active:bg-[#1a1a1a] rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleAdd}
                className="flex-1 py-3 bg-blue-600 text-white font-medium rounded-xl active:bg-blue-700 transition-colors"
                disabled={!name || !amount}
              >
                Save
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
