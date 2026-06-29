import React, { useState } from 'react';
import { SavingsGoal } from '../types';
import { Plus, Trash2, Target, Edit2, Calendar } from 'lucide-react';
import { cn } from '../lib/utils';
import { formatCurrency } from '../lib/calculations';

interface SavingsViewProps {
  savingsGoals: SavingsGoal[];
  disposableIncome: number;
  period: string;
  currency?: string;
  onAdd: (goal: Omit<SavingsGoal, 'id'>) => void;
  onRemove: (id: string) => void;
  onUpdate?: (id: string, updated: Omit<SavingsGoal, 'id'>) => void;
}

const getSymbol = (currency: string) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).formatToParts(0).find(p => p.type === 'currency')?.value || currency;
};

export function SavingsView({ savingsGoals, disposableIncome, period, currency = 'USD', onAdd, onRemove, onUpdate }: SavingsViewProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('0');

  const [editingId, setEditingId] = useState<string | null>(null);

  const symbol = getSymbol(currency);

  const startEdit = (goal: SavingsGoal) => {
    setEditingId(goal.id);
    setName(goal.name);
    setTargetAmount(goal.targetAmount.toString());
    setCurrentAmount(goal.currentAmount.toString());
    setIsAdding(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setName('');
    setTargetAmount('');
    setCurrentAmount('0');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !targetAmount) return;

    if (editingId && onUpdate) {
      onUpdate(editingId, {
        name: name.trim(),
        targetAmount: parseFloat(targetAmount),
        currentAmount: parseFloat(currentAmount) || 0,
      });
      cancelEdit();
    } else {
      onAdd({
        name: name.trim(),
        targetAmount: parseFloat(targetAmount),
        currentAmount: parseFloat(currentAmount) || 0,
      });
      setName('');
      setTargetAmount('');
      setCurrentAmount('0');
      setIsAdding(false);
    }
  };

  const calculateProjectedDate = (periodsToGoal: number | null) => {
    if (periodsToGoal === null) return null;
    const now = new Date();
    if (period === 'monthly') now.setMonth(now.getMonth() + periodsToGoal);
    else if (period === 'annual') now.setFullYear(now.getFullYear() + periodsToGoal);
    else if (period === 'weekly') now.setDate(now.getDate() + (periodsToGoal * 7));
    else if (period === 'bi-weekly') now.setDate(now.getDate() + (periodsToGoal * 14));
    
    return now.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="pb-24 pt-4 px-6 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100 tracking-tight">Savings Goals</h1>
      
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-3xl p-5 mb-8 border border-blue-100 dark:border-blue-800/30">
        <p className="text-sm text-blue-800 dark:text-blue-300 font-medium mb-1">Available to Save ({period})</p>
        <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
          {formatCurrency(disposableIncome, currency)}
        </p>
        {disposableIncome <= 0 && (
          <p className="text-xs text-red-500 mt-2 font-medium">You do not have disposable income to save.</p>
        )}
      </div>

      <div className="space-y-4 mb-8">
        {savingsGoals.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 dark:bg-[#121212] rounded-3xl border border-dashed border-gray-200 dark:border-[#1f1f1f]">
            <p className="text-gray-500 dark:text-gray-400 font-medium">No savings goals added yet.</p>
          </div>
        ) : (
          savingsGoals.map((goal) => {
            const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);
            const canSave = disposableIncome > 0;
            const periodsToGoal = canSave ? Math.ceil(remaining / disposableIncome) : null;
            const progress = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
            const projectedDate = calculateProjectedDate(periodsToGoal);

            return (
              <div key={goal.id} className="bg-white dark:bg-[#121212] p-5 rounded-3xl border border-gray-100 dark:border-[#1f1f1f] shadow-sm flex flex-col gap-4 group">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                      <Target className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-gray-100">{goal.name}</p>
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-0.5">Target: {formatCurrency(goal.targetAmount, currency)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {onUpdate && (
                      <button 
                        onClick={() => startEdit(goal)}
                        className="text-gray-400 hover:text-blue-500 p-2 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                    <button 
                      onClick={() => onRemove(goal.id)}
                      className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2 font-medium">
                    <span className="text-gray-600 dark:text-gray-400">{formatCurrency(goal.currentAmount, currency)}</span>
                    <span className="text-indigo-600 dark:text-indigo-400">{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-[#1a1a1a] rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-indigo-500 h-3 rounded-full transition-all duration-500" 
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-[#1a1a1a]/50 rounded-2xl p-4 flex flex-col gap-3 text-sm mt-1 border border-gray-100 dark:border-[#272727]">
                   <div className="flex justify-between items-center">
                     <p className="text-gray-500 dark:text-gray-400 font-medium">Remaining to Save</p>
                     <p className="font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(remaining, currency)}</p>
                   </div>
                   
                   {remaining > 0 && (
                     <>
                        <div className="w-full h-px bg-gray-200 dark:bg-[#272727]" />
                        <div className="flex justify-between items-center bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-xl">
                          <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
                             <Calendar className="w-4 h-4" />
                             <p className="font-semibold text-xs tracking-wider uppercase">Projected Date</p>
                          </div>
                          <p className="font-bold text-indigo-900 dark:text-indigo-100">
                             {projectedDate ? projectedDate : 'Unknown'}
                          </p>
                        </div>
                        {periodsToGoal !== null && (
                          <p className="text-[10px] text-gray-400 dark:text-gray-500 text-right italic -mt-1">
                            approx. {periodsToGoal} {period}s at current surplus
                          </p>
                        )}
                     </>
                   )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {(isAdding || editingId) ? (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-[#121212] p-5 rounded-3xl border border-gray-100 dark:border-[#1f1f1f] shadow-md space-y-4 mb-6">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Goal Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Vacation, New Car"
                className="w-full p-3 bg-gray-50 dark:bg-[#1a1a1a] border-none rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow dark:text-gray-100"
                autoFocus
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-gray-500 dark:text-gray-400">{symbol}</span>
                  <input 
                    type="number" 
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full p-3 pl-8 bg-gray-50 dark:bg-gray-800 border-none rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow dark:text-gray-100"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Saved So Far</label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-gray-500 dark:text-gray-400">{symbol}</span>
                  <input 
                    type="number" 
                    value={currentAmount}
                    onChange={(e) => setCurrentAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full p-3 pl-8 bg-gray-50 dark:bg-gray-800 border-none rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow dark:text-gray-100"
                  />
                </div>
              </div>
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
              disabled={!name.trim() || !targetAmount}
              className="flex-1 p-3 text-white font-medium bg-indigo-600 rounded-xl active:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {editingId ? 'Update Goal' : 'Save Goal'}
            </button>
          </div>
        </form>
      ) : (
        <button 
          onClick={() => {
            setIsAdding(true);
            setEditingId(null);
            setName('');
            setTargetAmount('');
            setCurrentAmount('0');
          }}
          className="w-full p-4 bg-gray-50 dark:bg-[#121212] border-2 border-dashed border-gray-200 dark:border-[#272727] text-gray-600 dark:text-gray-400 font-medium rounded-3xl flex items-center justify-center gap-2 hover:bg-gray-100 dark:hover:bg-[#1a1a1a] active:bg-gray-200 transition-all"
        >
          <Plus className="w-5 h-5" />
          Add New Goal
        </button>
      )}
    </div>
  );
}
