import React, { useState } from 'react';
import { Profile } from '../types';
import { User, Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { formatCurrency, calculateFinances } from '../lib/calculations';

interface ProfileSelectViewProps {
  profiles: Profile[];
  onSelect: (id: string) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
  onRename: (id: string, newName: string) => void;
}

export function ProfileSelectView({ profiles, onSelect, onAdd, onRemove, onRename }: ProfileSelectViewProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const startEditing = (e: React.MouseEvent, profile: Profile) => {
    e.stopPropagation();
    setEditingId(profile.id);
    setEditName(profile.name);
  };

  const cancelEditing = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
    setEditName('');
  };

  const saveEditing = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (editName.trim()) {
      onRename(id, editName.trim());
    }
    setEditingId(null);
    setEditName('');
  };

  return (
    <div className="h-full w-full px-4 pt-6 pb-6 bg-gray-100 dark:bg-[#0a0a0a] overflow-y-auto">
      <div className="mb-8 px-2 space-y-1">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Profiles</h1>
        <p className="text-gray-500 dark:text-gray-400">Select a profile to view financial details</p>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-6">
        {profiles.map(profile => {
          // Calculate high-level summary for the profile card
          // Include expenses
          const finances = calculateFinances(profile.incomes, profile.deductions, profile.expenses || [], 'monthly');
          const isEditing = editingId === profile.id;
          
          return (
            <div 
              key={profile.id}
              className="bg-white dark:bg-[#121212] p-5 rounded-3xl shadow-sm border border-gray-200 dark:border-[#1f1f1f] flex flex-col gap-4 active:scale-[0.98] transition-transform cursor-pointer relative group"
              onClick={() => {
                if (!isEditing) onSelect(profile.id);
              }}
            >
              <div className="flex items-center gap-4 w-full">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center shrink-0">
                  <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                
                <div className="flex-1 min-w-0 pr-16 bg-transparent h-12 flex items-center">
                  {isEditing ? (
                    <input 
                      type="text"
                      className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-300 dark:border-[#272727] rounded-xl px-3 py-1 text-gray-900 dark:text-gray-100 text-lg font-bold outline-none focus:ring-2 focus:ring-blue-500"
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      onClick={e => e.stopPropagation()}
                      onKeyDown={e => {
                        if (e.key === 'Enter') saveEditing(e as any, profile.id);
                        if (e.key === 'Escape') cancelEditing(e as any);
                      }}
                      autoFocus
                    />
                  ) : (
                    <div className="flex flex-col flex-1 justify-center">
                      <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 truncate">{profile.name}</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Disposable: {formatCurrency(finances.disposable, profile.currency)}/mo</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {isEditing ? (
                  <>
                    <button 
                      onClick={(e) => cancelEditing(e)}
                      className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-[#1a1a1a] transition-colors"
                      aria-label="Cancel Edit"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={(e) => saveEditing(e, profile.id)}
                      className="p-2 text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 rounded-full hover:bg-gray-100 dark:hover:bg-[#1a1a1a] transition-colors"
                      aria-label="Save Name"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={(e) => startEditing(e, profile)}
                      className="hidden sm:group-hover:flex text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-2 rounded-full hover:bg-gray-50 dark:hover:bg-[#1a1a1a]"
                      aria-label="Edit Profile"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemove(profile.id);
                      }}
                      className="hidden sm:group-hover:flex text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors p-2 rounded-full hover:bg-gray-50 dark:hover:bg-[#1a1a1a]"
                      aria-label="Delete Profile"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    
                    {/* Mobile always visible buttons */}
                    <button 
                      onClick={(e) => startEditing(e, profile)}
                      className="sm:hidden flex text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-2 rounded-full active:bg-gray-50 dark:active:bg-[#1a1a1a]"
                      aria-label="Edit Profile"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemove(profile.id);
                      }}
                      className="sm:hidden flex text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors p-2 rounded-full active:bg-gray-50 dark:active:bg-[#1a1a1a]"
                      aria-label="Delete Profile"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={onAdd}
        className="w-full p-5 flex items-center justify-center gap-2 bg-gray-200 dark:bg-[#121212] border-2 border-dashed border-gray-300 dark:border-[#272727] text-gray-700 dark:text-gray-400 font-semibold rounded-3xl hover:dark:bg-[#1a1a1a] active:bg-gray-300 dark:active:bg-[#272727] transition-all"
      >
        <Plus className="w-5 h-5" />
        Add New Profile
      </button>
    </div>
  );
}
