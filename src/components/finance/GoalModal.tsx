import React, { useState } from 'react';
import { storage } from '../../services/storage';
import { X, Target } from 'lucide-react';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentGoal: number;
  onGoalUpdated: () => void;
}

export const GoalModal: React.FC<GoalModalProps> = ({
  isOpen,
  onClose,
  currentGoal,
  onGoalUpdated,
}) => {
  const [goal, setGoal] = useState(currentGoal.toString());

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(goal.replace(',', '.'));
    if (!isNaN(parsed) && parsed > 0) {
      storage.setMonthlyGoal(parsed);
      onGoalUpdated();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-zinc-900 shadow-xl border border-stone-200 dark:border-zinc-800 overflow-hidden">
        <div className="flex items-center justify-between border-b border-stone-100 dark:border-zinc-800 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-pink-500 text-white shadow-sm">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-stone-900 dark:text-zinc-100">Meta Mensal de Vendas</h2>
              <p className="text-xs text-stone-500 dark:text-zinc-400">Planejamento financeiro</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 dark:hover:bg-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-semibold text-stone-700 dark:text-zinc-300">Objetivo de Faturamento (R$):</label>
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="Ex: 3000,00"
              className="mt-1.5 w-full rounded-xl border border-stone-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 px-3.5 py-2.5 text-base font-bold text-stone-800 dark:text-zinc-100 placeholder:text-stone-400 dark:placeholder:text-zinc-500 focus:border-pink-500 focus:outline-hidden"
              required
            />
            <p className="mt-1 text-[11px] text-stone-500 dark:text-zinc-400">
              A barra de progresso acompanhará as vendas fechadas deste mês.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-sm font-medium text-stone-600 dark:text-zinc-400 hover:bg-stone-100 dark:hover:bg-zinc-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-xl bg-pink-500 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-pink-600 transition"
            >
              Salvar Meta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

