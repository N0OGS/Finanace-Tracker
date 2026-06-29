import React, { useState } from 'react';
import { Deduction, Frequency } from '../types';
import { Plus, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { formatCurrency } from '../lib/calculations';

interface TaxesViewProps {
  deductions: Deduction[];
  currency?: string;
  onAdd: (deduction: Omit<Deduction, 'id'>) => void;
  onRemove: (id: string) => void;
}

const getSymbol = (currency: string) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).formatToParts(0).find(p => p.type === 'currency')?.value || currency;
};

export function TaxesView({ deductions, currency = 'USD', onAdd, onRemove }: TaxesViewProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState<'percentage' | 'fixed'>('percentage');
  const [value, setValue] = useState('');
  const [frequency, setFrequency] = useState<Frequency>('monthly');

  const handleAdd = () => {
    if (!name || !value) return;
    onAdd({
      name,
      type,
      value: parseFloat(value),
      ...(type === 'fixed' ? { frequency } : {}),
    });
    setName('');
    setValue('');
    setType('percentage');
    setFrequency('monthly');
    setIsAdding(false);
  };

  const symbol = getSymbol(currency);

  return (
    <div className="pb-24 pt-4 px-6 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100 tracking-tight">Withholdings</h1>
      
      <div className="space-y-3">
        {deductions.map((deduction) => (
          <div key={deduction.id} className="bg-white dark:bg-[#121212] p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-[#1f1f1f] flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100">{deduction.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                {deduction.type === 'percentage' 
                  ? 'Percentage of Gross' 
                  : deduction.type === 'progressive' ? 'Progressive Brackets' : `Fixed ${deduction.frequency} Deduction`}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {deduction.type === 'percentage' 
                  ? `${deduction.value}%` 
                  : deduction.type === 'progressive' ? 'Varies' : formatCurrency(deduction.value || 0, currency)}
              </p>
              <button 
                onClick={() => onRemove(deduction.id)}
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
            Add Tax or Deduction
          </button>
        )}

        {isAdding && (
          <div className="bg-white dark:bg-[#121212] p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-[#1f1f1f] space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Deduction Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. State Income Tax"
                className="w-full p-3 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#3f3f46] rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all dark:text-gray-100"
              />
            </div>
            
            <div className="flex bg-gray-100 dark:bg-[#1a1a1a] p-1 rounded-xl">
              <button
                onClick={() => setType('percentage')}
                className={cn(
                  "flex-1 py-2 text-sm font-medium rounded-lg transition-all",
                  type === 'percentage' ? "bg-white dark:bg-[#272727] shadow-sm text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400"
                )}
              >
                Percentage
              </button>
              <button
                onClick={() => setType('fixed')}
                className={cn(
                  "flex-1 py-2 text-sm font-medium rounded-lg transition-all",
                  type === 'fixed' ? "bg-white dark:bg-[#272727] shadow-sm text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400"
                )}
              >
                Fixed Amount
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className={cn(!type || type === 'percentage' ? 'col-span-2' : '')}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {type === 'percentage' ? 'Percentage (%)' : `Amount (${symbol})`}
                </label>
                <div className="relative">
                  {type === 'fixed' && <span className="absolute left-3 top-3 text-gray-500 dark:text-gray-400">{symbol}</span>}
                  <input 
                    type="number" 
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="0.00"
                    className={cn(
                      "w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-[#3f3f46] rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all dark:text-gray-100",
                      type === 'fixed' && "pl-7"
                    )}
                  />
                  {type === 'percentage' && <span className="absolute right-4 top-3 text-gray-500 dark:text-gray-400">%</span>}
                </div>
              </div>
              
              {type === 'fixed' && (
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
              )}
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
                disabled={!name || !value}
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
