import React, { useState } from 'react';
import { Expense, Frequency, ExpenseCategory } from '../types';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { formatCurrency } from '../lib/calculations';

interface ExpensesViewProps {
  expenses: Expense[];
  currency?: string;
  onAdd: (expense: Omit<Expense, 'id'>) => void;
  onRemove: (id: string) => void;
  onUpdate?: (id: string, updated: Omit<Expense, 'id'>) => void;
}

const getSymbol = (currency: string) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).formatToParts(0).find(p => p.type === 'currency')?.value || currency;
};

const CATEGORIES: ExpenseCategory[] = ['Housing', 'Food', 'Transport', 'Utilities', 'Entertainment', 'Health', 'Debt', 'Education', 'Other'];

export function ExpensesView({ expenses, currency = 'USD', onAdd, onRemove, onUpdate }: ExpensesViewProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState<Frequency>('monthly');
  const [category, setCategory] = useState<ExpenseCategory | string>('Other');

  const [editingId, setEditingId] = useState<string | null>(null);

  const symbol = getSymbol(currency);

  const startEdit = (expense: Expense) => {
    setEditingId(expense.id);
    setName(expense.name);
    setAmount(expense.amount.toString());
    setFrequency(expense.frequency);
    setCategory(expense.category || 'Other');
    setIsAdding(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setName('');
    setAmount('');
    setFrequency('monthly');
    setCategory('Other');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !amount) return;

    if (editingId && onUpdate) {
      onUpdate(editingId, {
        name: name.trim(),
        amount: parseFloat(amount),
        frequency: frequency,
        category: category,
      });
      cancelEdit();
    } else {
      onAdd({
        name: name.trim(),
        amount: parseFloat(amount),
        frequency: frequency,
        category: category,
      });
      setName('');
      setAmount('');
      setIsAdding(false);
    }
  };

  return (
    <div className="pb-24 pt-4 px-6 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100 tracking-tight">Expenses</h1>
      
      <div className="space-y-4 mb-8">
        {expenses.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 dark:bg-[#121212] rounded-3xl border border-dashed border-gray-200 dark:border-[#1f1f1f]">
            <p className="text-gray-500 dark:text-gray-400 font-medium">No expenses added yet.</p>
          </div>
        ) : (
          expenses.map((expense) => (
            <div key={expense.id} className="bg-white dark:bg-[#121212] p-5 rounded-3xl border border-gray-100 dark:border-[#1f1f1f] shadow-sm flex items-center justify-between group">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{expense.name}</p>
                  {expense.category && expense.category !== 'Other' && (
                    <span className="bg-gray-100 dark:bg-[#1a1a1a] text-gray-600 dark:text-gray-400 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full">
                      {expense.category}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{expense.frequency}</p>
              </div>
              <div className="flex items-center gap-2">
                <p className="font-medium text-gray-900 dark:text-gray-100 mr-2">{formatCurrency(expense.amount, currency)}</p>
                {onUpdate && (
                   <button 
                     onClick={() => startEdit(expense)}
                     className="text-gray-400 hover:text-blue-500 p-2 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                   >
                     <Edit2 className="w-4 h-4" />
                   </button>
                )}
                <button 
                  onClick={() => onRemove(expense.id)}
                  className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {(isAdding || editingId) ? (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-[#121212] p-5 rounded-3xl border border-gray-100 dark:border-[#1f1f1f] shadow-md space-y-4 mb-6">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rent, Groceries"
                className="w-full p-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-shadow dark:text-gray-100"
                autoFocus
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-gray-500 dark:text-gray-400">{symbol}</span>
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full p-3 pl-8 bg-gray-50 dark:bg-gray-800 border-none rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-shadow dark:text-gray-100"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Frequency</label>
                <select 
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value as Frequency)}
                  className="w-full p-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-shadow dark:text-gray-100 capitalize"
                >
                  <option value="weekly">Weekly</option>
                  <option value="bi-weekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="annual">Annual</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-shadow dark:text-gray-100"
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex gap-3 pt-2">
            <button 
              type="button" 
              onClick={() => {
                setIsAdding(false);
                cancelEdit();
              }}
              className="flex-1 p-3 text-gray-600 dark:text-gray-300 font-medium bg-gray-50 dark:bg-gray-800 rounded-xl active:bg-gray-100 dark:active:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={!name.trim() || !amount}
              className="flex-1 p-3 text-white font-medium bg-blue-600 rounded-xl active:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {editingId ? 'Update Details' : 'Save Details'}
            </button>
          </div>
        </form>
      ) : (
        <button 
          onClick={() => {
            setIsAdding(true);
            setEditingId(null);
            setName('');
            setAmount('');
            setFrequency('monthly');
            setCategory('Other');
          }}
          className="w-full p-4 bg-gray-50 dark:bg-[#121212] border-2 border-dashed border-gray-200 dark:border-[#3f3f46] text-gray-600 dark:text-gray-400 font-medium rounded-3xl flex items-center justify-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 active:bg-gray-200 transition-all"
        >
          <Plus className="w-5 h-5" />
          Add New Expense
        </button>
      )}
    </div>
  );
}
