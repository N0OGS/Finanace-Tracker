import React, { useState, useRef, useEffect } from 'react';
import { UserPlus, ArrowLeft, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';

import { Frequency } from '../types';

interface ProfileSetupViewProps {
  onAddProfile: (name: string, country: string, currency: string, initialIncome: number, frequency: Frequency) => void;
  canCancel: boolean;
  onCancel: () => void;
}

const COUNTRIES = [
  { name: 'United States', currency: 'USD', symbol: '$' },
  { name: 'Philippines', currency: 'PHP', symbol: '₱' },
  { name: 'Australia', currency: 'AUD', symbol: '$' },
  { name: 'Brazil', currency: 'BRL', symbol: 'R$' },
  { name: 'Canada', currency: 'CAD', symbol: '$' },
  { name: 'China', currency: 'CNY', symbol: '¥' },
  { name: 'France', currency: 'EUR', symbol: '€' },
  { name: 'Germany', currency: 'EUR', symbol: '€' },
  { name: 'Hong Kong', currency: 'HKD', symbol: 'HK$' },
  { name: 'India', currency: 'INR', symbol: '₹' },
  { name: 'Indonesia', currency: 'IDR', symbol: 'Rp' },
  { name: 'Japan', currency: 'JPY', symbol: '¥' },
  { name: 'Malaysia', currency: 'MYR', symbol: 'RM' },
  { name: 'Mexico', currency: 'MXN', symbol: '$' },
  { name: 'Nigeria', currency: 'NGN', symbol: '₦' },
  { name: 'Singapore', currency: 'SGD', symbol: 'S$' },
  { name: 'South Africa', currency: 'ZAR', symbol: 'R' },
  { name: 'South Korea', currency: 'KRW', symbol: '₩' },
  { name: 'Taiwan', currency: 'TWD', symbol: 'NT$' },
  { name: 'Thailand', currency: 'THB', symbol: '฿' },
  { name: 'United Kingdom', currency: 'GBP', symbol: '£' },
  { name: 'Vietnam', currency: 'VND', symbol: '₫' },
];

export function ProfileSetupView({ onAddProfile, canCancel, onCancel }: ProfileSetupViewProps) {
  const [name, setName] = useState('');
  const [countryIndex, setCountryIndex] = useState(0);
  const [incomeAmount, setIncomeAmount] = useState('');
  const [incomeFrequency, setIncomeFrequency] = useState<Frequency>('annual');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFreqDropdownOpen, setIsFreqDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const freqDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (freqDropdownRef.current && !freqDropdownRef.current.contains(event.target as Node)) {
        setIsFreqDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && incomeAmount) {
      const country = COUNTRIES[countryIndex];
      onAddProfile(name.trim(), country.name, country.currency, parseFloat(incomeAmount), incomeFrequency);
    }
  };

  const selectedCountry = COUNTRIES[countryIndex];

  return (
    <div className="h-full w-full flex flex-col p-6 pt-2 bg-white dark:bg-[#0a0a0a] overflow-y-auto">
      {canCancel && (
        <button 
          onClick={onCancel}
          className="self-start p-2 -ml-2 mb-4 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
      )}
      
      <div className="flex-1 flex flex-col items-center justify-center -mt-8 space-y-8">
        <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
          <UserPlus className="w-10 h-10 ml-1" />
        </div>
        
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Create Profile</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Enter details to start tracking your income.</p>
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 pl-1">Profile Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Personal, Freelance, 2024"
              className="w-full p-4 bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-[#272727] rounded-2xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600"
              autoFocus
            />
          </div>

          <div className="space-y-1.5 relative" ref={dropdownRef}>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 pl-1">Country of Income</label>
            <div 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={cn(
                "w-full p-4 bg-gray-50 dark:bg-[#121212] border rounded-2xl cursor-pointer flex items-center justify-between transition-all font-medium text-gray-900 dark:text-gray-100",
                isDropdownOpen ? "border-blue-500 ring-1 ring-blue-500" : "border-gray-200 dark:border-[#272727]"
              )}
            >
              <span>{selectedCountry.name} ({selectedCountry.currency})</span>
              <ChevronDown className={cn("w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform", isDropdownOpen && "rotate-180")} />
            </div>
            
            {isDropdownOpen && (
              <div className="absolute z-10 top-full left-0 right-0 mt-2 bg-white dark:bg-[#121212] border border-gray-200 dark:border-[#272727] rounded-2xl shadow-xl max-h-48 overflow-y-auto overflow-x-hidden">
                {COUNTRIES.map((c, i) => (
                  <div
                    key={c.name}
                    onClick={() => {
                      setCountryIndex(i);
                      setIsDropdownOpen(false);
                    }}
                    className={cn(
                      "px-4 py-3 cursor-pointer transition-colors text-sm font-medium",
                      i === countryIndex ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400" : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    )}
                  >
                    {c.name} ({c.currency})
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <div className="space-y-1.5 flex-1 relative" ref={freqDropdownRef}>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 pl-1">Frequency</label>
              <div 
                onClick={() => setIsFreqDropdownOpen(!isFreqDropdownOpen)}
                className={cn(
                  "w-full p-4 bg-gray-50 dark:bg-[#121212] border rounded-2xl cursor-pointer flex items-center justify-between transition-all font-medium text-gray-900 dark:text-gray-100 capitalize",
                  isFreqDropdownOpen ? "border-blue-500 ring-1 ring-blue-500" : "border-gray-200 dark:border-[#272727]"
                )}
              >
                <span>{incomeFrequency}</span>
                <ChevronDown className={cn("w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform", isFreqDropdownOpen && "rotate-180")} />
              </div>
              
              {isFreqDropdownOpen && (
                <div className="absolute z-10 top-full left-0 right-0 mt-2 bg-white dark:bg-[#121212] border border-gray-200 dark:border-[#272727] rounded-2xl shadow-xl overflow-hidden">
                  {(['annual', 'monthly', 'bi-weekly', 'weekly'] as Frequency[]).map((f) => (
                    <div
                      key={f}
                      onClick={() => {
                        setIncomeFrequency(f);
                        setIsFreqDropdownOpen(false);
                      }}
                      className={cn(
                        "px-4 py-3 cursor-pointer transition-colors text-sm font-medium capitalize",
                        f === incomeFrequency ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400" : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                      )}
                    >
                      {f}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-1.5 flex-[2]">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 pl-1">Salary Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-[18px] text-gray-500 dark:text-gray-400 font-medium">{selectedCountry.symbol}</span>
                <input
                  type="number"
                  value={incomeAmount}
                  onChange={(e) => setIncomeAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full p-4 pl-10 bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-[#272727] rounded-2xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={!name.trim() || !incomeAmount}
            className="w-full p-4 bg-blue-600 text-white font-semibold rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed active:bg-blue-700 transition-colors shadow-sm pt-4"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
