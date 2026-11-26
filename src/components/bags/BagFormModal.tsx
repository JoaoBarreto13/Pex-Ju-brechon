import React, { useState } from 'react';
import type { Customer } from '../../types';
import { storage } from '../../services/storage';
import { X, ShoppingBag, PlusCircle, Calendar } from 'lucide-react';
import { formatDateBR } from '../../services/bagCalculator';

interface BagFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  customers: Customer[];
  onBagCreated: () => void;
}

export const BagFormModal: React.FC<BagFormModalProps> = ({
  isOpen,
  onClose,
  customers,
  onBagCreated,
}) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [notes, setNotes] = useState('');
  const [isCreatingNewCustomer, setIsCreatingNewCustomer] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerPhone, setNewCustomerPhone] = useState('');
  const [newCustomerInstagram, setNewCustomerInstagram] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const today = new Date().toISOString();
  const estimatedClosing = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      let customerIdToUse = selectedCustomerId;

      if (isCreatingNewCustomer) {
        if (!newCustomerName.trim() || !newCustomerPhone.trim()) {
          setErrorMessage('Informe pelo menos o nome e o telefone da cliente.');
          return;
        }
        const created = storage.saveCustomer({
          name: newCustomerName.trim(),
          phone: newCustomerPhone.trim(),
          instagram: newCustomerInstagram.trim() || undefined,
        });
        customerIdToUse = created.id;
      }

      if (!customerIdToUse) {
        setErrorMessage('Selecione ou cadastre uma cliente para abrir a sacolinha.');
        return;
      }

      storage.createBag(customerIdToUse, notes.trim() || undefined);
      onBagCreated();
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Erro ao criar sacolinha.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 p-4 backdrop-blur-xs dark:bg-black/75">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl border border-stone-200 overflow-hidden dark:bg-zinc-900 dark:border-zinc-800">
        <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-pink-500 text-white shadow-xs">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-stone-900 dark:text-zinc-100">Abrir Nova Sacolinha</h2>
              <p className="text-xs text-stone-500 dark:text-zinc-400">Inicia contagem do prazo de 30 dias</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:border-rose-900/50 dark:text-rose-300">
              {errorMessage}
            </div>
          )}

          {/* Banner da Regra dos 30 dias */}
          <div className="rounded-xl bg-pink-50 p-3.5 border border-pink-200/80 text-xs text-pink-900 dark:bg-pink-950/30 dark:border-pink-900/40 dark:text-pink-200">
            <div className="flex items-center gap-1.5 font-bold mb-1 text-pink-950 dark:text-pink-100">
              <Calendar className="h-4 w-4 text-pink-600 dark:text-pink-400" />
              <span>Regra de Prazo Automático</span>
            </div>
            <p>
              Início: <strong>{formatDateBR(today)}</strong> • Fechamento previsto: <strong>{formatDateBR(estimatedClosing)}</strong> (30 dias).
            </p>
          </div>

          {!isCreatingNewCustomer ? (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-stone-700 dark:text-zinc-300">Selecione a Cliente:</label>
                <button
                  type="button"
                  onClick={() => setIsCreatingNewCustomer(true)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-pink-600 hover:text-pink-700 dark:text-pink-400 dark:hover:text-pink-300"
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  Cadastrar nova cliente
                </button>
              </div>
              <select
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-800 focus:border-pink-500 focus:outline-hidden focus:ring-2 focus:ring-pink-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              >
                <option value="">-- Escolha uma cliente cadastrada --</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.phone}) {c.instagram ? `- ${c.instagram}` : ''}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="space-y-3 rounded-xl border border-stone-200 bg-stone-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/60">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-800 dark:text-zinc-200">Dados da Nova Cliente:</span>
                <button
                  type="button"
                  onClick={() => setIsCreatingNewCustomer(false)}
                  className="text-xs text-stone-500 hover:text-stone-800 underline dark:text-zinc-400 dark:hover:text-zinc-200"
                >
                  Voltar à lista existente
                </button>
              </div>
              <div>
                <label className="text-xs font-medium text-stone-600 dark:text-zinc-300">Nome completo *</label>
                <input
                  type="text"
                  placeholder="Ex: Amanda Silva"
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 focus:border-pink-500 focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-medium text-stone-600 dark:text-zinc-300">WhatsApp / Telefone *</label>
                  <input
                    type="text"
                    placeholder="(11) 99999-9999"
                    value={newCustomerPhone}
                    onChange={(e) => setNewCustomerPhone(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 focus:border-pink-500 focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-stone-600 dark:text-zinc-300">Instagram (opcional)</label>
                  <input
                    type="text"
                    placeholder="@amanda.moda"
                    value={newCustomerInstagram}
                    onChange={(e) => setNewCustomerInstagram(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 focus:border-pink-500 focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                  />
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-stone-700 dark:text-zinc-300">Observações da Sacolinha (opcional):</label>
            <textarea
              rows={2}
              placeholder="Ex: Cliente aguardando peças de inverno para fechar o frete..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-stone-300 bg-white p-3 text-sm text-stone-800 focus:border-pink-500 focus:outline-hidden focus:ring-2 focus:ring-pink-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-xl bg-pink-500 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-pink-600 transition"
            >
              Criar Sacolinha
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


