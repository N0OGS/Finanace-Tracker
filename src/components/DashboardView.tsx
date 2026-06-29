import React from 'react';
import { ViewPeriod, Income, Deduction, Expense, Profile } from '../types';
import { calculateFinances, formatCurrency } from '../lib/calculations';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { cn } from '../lib/utils';

interface DashboardViewProps {
  incomes: Income[];
  deductions: Deduction[];
  expenses: Expense[];
  period: ViewPeriod;
  setPeriod: (period: ViewPeriod) => void;
  currency?: string;
}

const COLORS = ['#60a5fa', '#f87171', '#fb923c', '#facc15', '#a3e635', '#22d3ee', '#a78bfa', '#f472b6'];

export function DashboardView({ incomes, deductions, expenses, period, setPeriod, currency = 'USD' }: DashboardViewProps) {
  const finances = calculateFinances(incomes, deductions, expenses, period);

  
  const chartData = [
    { name: 'Disposable Income', value: Math.max(0, finances.disposable), color: '#3b82f6' }, // Blue
    ...finances.deductionsBreakdown.map((d, i) => ({
      name: d.name,
      value: d.amount,
      color: COLORS[i % COLORS.length]
    })),
    ...finances.expensesBreakdown.map((e, i) => ({
      name: e.name,
      value: e.amount,
      color: COLORS[(finances.deductionsBreakdown.length + i) % COLORS.length]
    }))
  ].filter(d => d.value > 0);

  return (
    <div className="pb-24 pt-4 px-6 space-y-6 dark:text-gray-100">
      <div className="flex justify-between items-end mb-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Overview</h1>
        
        <select 
          value={period}
          onChange={(e) => setPeriod(e.target.value as ViewPeriod)}
          className="bg-transparent text-sm font-medium text-blue-600 dark:text-blue-400 outline-none cursor-pointer p-1"
        >
          <option value="annual">Yearly</option>
          <option value="monthly">Monthly</option>
          <option value="weekly">Weekly</option>
        </select>
      </div>

      <div className="bg-gradient-to-br from-gray-900 to-black dark:from-[#111] dark:to-black border border-transparent dark:border-[#272727] rounded-[2rem] p-7 text-white shadow-xl space-y-5 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <div className="w-48 h-48 bg-white rounded-full blur-3xl absolute -top-10 -right-10" />
        </div>
        
        <div className="relative z-10">
          <p className="text-gray-300 font-medium tracking-widest text-[10px] uppercase mb-1">Disposable {period}</p>
          <p className="text-4xl font-bold tracking-tight">{formatCurrency(finances.disposable, currency)}</p>
        </div>
        <div className="w-full h-px bg-gradient-to-r from-gray-700/50 via-gray-700/30 to-transparent relative z-10" />
        <div className="grid grid-cols-2 gap-y-5 gap-x-4 relative z-10">
          <div>
            <p className="text-gray-400 text-[10px] uppercase tracking-widest mb-1">Gross</p>
            <p className="font-semibold text-lg">{formatCurrency(finances.gross, currency)}</p>
          </div>
          <div>
            <p className="text-gray-400 text-[10px] uppercase tracking-widest mb-1">Net Income</p>
            <p className="font-semibold text-lg text-white">{formatCurrency(finances.net, currency)}</p>
          </div>
          <div>
            <p className="text-gray-400 text-[10px] uppercase tracking-widest mb-1">Taxes</p>
            <p className="font-semibold text-lg text-white">{formatCurrency(finances.totalTaxes, currency)}</p>
          </div>
          <div>
            <p className="text-gray-400 text-[10px] uppercase tracking-widest mb-1">Expenses</p>
            <p className="font-semibold text-lg text-white">{formatCurrency(finances.totalExpenses, currency)}</p>
          </div>
        </div>
      </div>

      {finances.gross > 0 && (
        <div className="bg-white dark:bg-[#121212] rounded-[2rem] p-7 shadow-sm border border-gray-100 dark:border-[#1f1f1f]">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6 tracking-tight">Breakdown</h2>
          <div className="h-48 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie
                   data={chartData}
                   cx="50%"
                   cy="50%"
                   innerRadius={50}
                   outerRadius={80}
                   paddingAngle={2}
                   dataKey="value"
                   stroke="none"
                 >
                   {chartData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={entry.color} />
                   ))}
                 </Pie>
                 <Tooltip 
                   formatter={(value: number) => formatCurrency(value, currency)}
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: '#fff', color: '#000' }}
                 />
               </PieChart>
             </ResponsiveContainer>
          </div>
          
          <div className="space-y-3 mt-4">
            {chartData.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400 truncate max-w-[180px]">{item.name}</span>
                </div>
                <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 ml-4">
                  {formatCurrency(item.value, currency)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {finances.gross > 0 && (
         <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-500/10 dark:to-blue-500/10 rounded-[2rem] p-7 border border-indigo-100 dark:border-indigo-500/20">
            <h2 className="text-lg font-bold text-indigo-900 dark:text-indigo-200 mb-4 tracking-tight">Smart Insights</h2>
            <div className="space-y-4">
              {(() => {
                const savingsRate = finances.net > 0 ? (finances.disposable / finances.net) * 100 : 0;
                const expenseRatio = finances.net > 0 ? (finances.totalExpenses / finances.net) * 100 : 0;
                const insights = [];
                
                if (finances.disposable < 0) {
                  insights.push({ id: 'deficit', text: "Alert: You are running a deficit! Your expenses exceed your net income.", color: "text-red-700 dark:text-red-400" });
                } else if (savingsRate > 20) {
                  insights.push({ id: 'saving', text: `Great job! You have a surplus of ${savingsRate.toFixed(1)}% of your net income to save or invest.`, color: "text-green-700 dark:text-green-400" });
                }

                if (expenseRatio > 80) {
                  insights.push({ id: 'high-expense', text: `Warning: Your expenses consume ${expenseRatio.toFixed(1)}% of your net income, leaving little room for savings.`, color: "text-amber-700 dark:text-amber-400" });
                } else if (expenseRatio > 0 && expenseRatio < 50) {
                  insights.push({ id: 'low-expense', text: `Excellent cost control. Your expenses are less than 50% of your net income.`, color: "text-blue-700 dark:text-blue-400" });
                }

                if (insights.length === 0) {
                  insights.push({ id: 'neutral', text: "Your budget is balanced and within typical ranges.", color: "text-indigo-700 dark:text-indigo-400" });
                }

                return insights.map(insight => (
                  <div key={insight.id} className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0 bg-current opacity-70" />
                    <p className={`text-sm font-medium leading-relaxed ${insight.color}`}>
                      {insight.text}
                    </p>
                  </div>
                ));
              })()}
            </div>
         </div>
      )}
    </div>
  );
}
