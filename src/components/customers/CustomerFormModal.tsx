import React, { useState } from 'react';
import type { Customer } from '../../types';
import { storage } from '../../services/storage';
import { X, UserPlus } from 'lucide-react';

interface CustomerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCustomerSaved: () => void;
  customerToEdit?: Customer | null;
}

export const CustomerFormModal: React.FC<CustomerFormModalProps> = ({
  isOpen,
  onClose,
  onCustomerSaved,
  customerToEdit,
}) => {
  const [name, setName] = useState(customerToEdit?.name || '');
  const [phone, setPhone] = useState(customerToEdit?.phone || '');
  const [instagram, setInstagram] = useState(customerToEdit?.instagram || '');
  const [notes, setNotes] = useState(customerToEdit?.notes || '');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Informe o nome da cliente.');
      return;
    }
    if (!phone.trim()) {
      setErrorMessage('Informe o telefone ou WhatsApp para contato.');
      return;
    }

    try {
      storage.saveCustomer(
        {
          name: name.trim(),
          phone: phone.trim(),
          instagram: instagram.trim() || undefined,
          notes: notes.trim() || undefined,
        },
        customerToEdit?.id
      );

      onCustomerSaved();
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl border border-stone-200 overflow-hidden">
        <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-pink-500 text-white">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-stone-900">
                {customerToEdit ? 'Editar Cliente' : 'Cadastrar Cliente'}
              </h2>
              <p className="text-xs text-stone-500">Dados para envio e sacolinhas</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-700 border border-rose-200">
              {errorMessage}
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-stone-700">Nome Completo *</label>
            <input
              type="text"
              placeholder="Ex: Mariana Souza"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2 text-sm text-stone-800 focus:border-pink-500 focus:outline-hidden"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-700">WhatsApp / Telefone *</label>
            <input
              type="text"
              placeholder="(11) 98765-4321"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2 text-sm text-stone-800 focus:border-pink-500 focus:outline-hidden"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-700">Instagram (opcional)</label>
            <input
              type="text"
              placeholder="@mari.souza"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2 text-sm text-stone-800 focus:border-pink-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-700">Observações (opcional)</label>
            <textarea
              rows={2}
              placeholder="Ex: Preferência por vestidos, envios via Jadlog, etc."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1 w-full rounded-xl border border-stone-300 bg-white p-3 text-xs text-stone-800 focus:border-pink-500 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-xl bg-pink-500 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-pink-600 transition"
            >
              Salvar Cliente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

