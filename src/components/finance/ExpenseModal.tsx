import React, { useState } from 'react';
import type { Expense } from '../../types';
import { storage } from '../../services/storage';
import { X, Receipt } from 'lucide-react';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExpenseAdded: () => void;
}

const CATEGORIES: Expense['category'][] = [
  'Embalagens',
  'Frete/Envios',
  'Higienização',
  'Marketing',
  'Aquisição de Lotes',
  'Outros',
];

export const ExpenseModal: React.FC<ExpenseModalProps> = ({
  isOpen,
  onClose,
  onExpenseAdded,
}) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Expense['category']>('Embalagens');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!description.trim()) {
      setErrorMessage('Informe a descrição da despesa.');
      return;
    }

    const parsedAmount = parseFloat(amount.replace(',', '.'));
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setErrorMessage('Informe um valor válido maior que zero.');
      return;
    }

    storage.addExpense({
      description: description.trim(),
      amount: parsedAmount,
      expense_date: new Date().toISOString(),
      category,
    });

    onExpenseAdded();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 shadow-xl border border-stone-200 dark:border-zinc-800 overflow-hidden">
        <div className="flex items-center justify-between border-b border-stone-100 dark:border-zinc-800 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-500 text-white shadow-sm">
              <Receipt className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-stone-900 dark:text-zinc-100">Registrar Despesa</h2>
              <p className="text-xs text-stone-500 dark:text-zinc-400">Gastos operacionais do brechó</p>
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
          {errorMessage && (
            <div className="rounded-xl bg-rose-50 dark:bg-rose-950/40 p-3 text-xs font-semibold text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50">
              {errorMessage}
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-stone-700 dark:text-zinc-300">Descrição do Gasto *</label>
            <input
              type="text"
              placeholder="Ex: Compra de 50 caixas de envio e fita adesiva"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full rounded-xl border border-stone-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 px-3.5 py-2.5 text-sm text-stone-800 dark:text-zinc-100 placeholder:text-stone-400 dark:placeholder:text-zinc-500 focus:border-pink-500 focus:outline-hidden"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-700 dark:text-zinc-300">Valor da Despesa (R$) *</label>
            <input
              type="text"
              placeholder="Ex: 85,00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 w-full rounded-xl border border-stone-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 px-3.5 py-2.5 text-sm text-stone-800 dark:text-zinc-100 placeholder:text-stone-400 dark:placeholder:text-zinc-500 focus:border-pink-500 focus:outline-hidden"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-700 dark:text-zinc-300">Categoria da Despesa</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Expense['category'])}
              className="mt-1 w-full rounded-xl border border-stone-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 px-3.5 py-2.5 text-sm text-stone-800 dark:text-zinc-100 focus:border-pink-500 focus:outline-hidden"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="dark:bg-zinc-800 dark:text-zinc-100">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-sm font-medium text-stone-600 dark:text-zinc-400 hover:bg-stone-100 dark:hover:bg-zinc-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-xl bg-rose-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-700 transition"
            >
              Salvar Despesa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

