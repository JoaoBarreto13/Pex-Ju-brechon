import React, { useState } from 'react';
import type { StorageLocation } from '../../types';
import { storage } from '../../services/storage';
import { LocationBadge } from './LocationBadges';
import { X, Plus, MapPin } from 'lucide-react';

interface LocationManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  locations: StorageLocation[];
  onLocationsUpdated: () => void;
}

export const LocationManagerModal: React.FC<LocationManagerModalProps> = ({
  isOpen,
  onClose,
  locations,
  onLocationsUpdated,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<StorageLocation['type']>('caixa_roupas');
  const [isAdding, setIsAdding] = useState(false);

  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    storage.saveLocation({
      name: name.trim(),
      description: description.trim() || 'Local residencial de armazenamento',
      type,
    });

    setName('');
    setDescription('');
    setIsAdding(false);
    onLocationsUpdated();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 p-4 backdrop-blur-xs dark:bg-black/75">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl border border-stone-200 overflow-hidden dark:bg-zinc-900 dark:border-zinc-800">
        <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-pink-500 text-white shadow-xs">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-stone-900 dark:text-zinc-100">Locais Físicos de Estoque</h2>
              <p className="text-xs text-stone-500 dark:text-zinc-400">Mapeamento de caixas e espaços na casa</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-zinc-400">
              Locais Cadastrados ({locations.length})
            </span>
            {!isAdding && (
              <button
                onClick={() => setIsAdding(true)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-pink-600 hover:text-pink-700 dark:text-pink-400 dark:hover:text-pink-300"
              >
                <Plus className="h-3.5 w-3.5" />
                Novo Local / Caixa
              </button>
            )}
          </div>

          {isAdding && (
            <form onSubmit={handleAdd} className="rounded-xl border border-pink-300 bg-pink-50 p-4 space-y-3 dark:border-pink-900/60 dark:bg-pink-950/30">
              <h4 className="font-bold text-stone-900 dark:text-zinc-100 text-xs">Adicionar Novo Local</h4>
              <div>
                <label className="text-xs font-medium text-stone-700 dark:text-zinc-300">Nome do Local / Caixa *</label>
                <input
                  type="text"
                  placeholder="Ex: Caixa R03 ou Gaveteiro Quarto 2"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-xs text-stone-800 focus:border-pink-500 focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium text-stone-700 dark:text-zinc-300">Tipo de Armazenamento</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as StorageLocation['type'])}
                  className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-xs text-stone-800 focus:border-pink-500 focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                >
                  <option value="caixa_roupas">Caixa Organizadora de Roupas</option>
                  <option value="caixa_sapatos">Caixa Organizadora de Sapatos</option>
                  <option value="box">Box da Cama</option>
                  <option value="arara">Arara / Cabideiro</option>
                  <option value="outro">Outro Espaço</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-stone-700 dark:text-zinc-300">Descrição / O que vai dentro?</label>
                <input
                  type="text"
                  placeholder="Ex: Roupas de banho e biquínis vintage"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-xs text-stone-800 focus:border-pink-500 focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="rounded-lg px-3 py-1.5 text-xs font-medium text-stone-600 hover:bg-stone-200 dark:text-zinc-400 dark:hover:bg-zinc-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-pink-500 px-4 py-1.5 text-xs font-bold text-white hover:bg-pink-600 shadow-xs"
                >
                  Salvar Local
                </button>
              </div>
            </form>
          )}

          <div className="divide-y divide-stone-100 rounded-xl border border-stone-200 bg-white overflow-hidden dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
            {locations.map((loc) => (
              <div key={loc.id} className="flex items-center justify-between p-3">
                <div>
                  <LocationBadge location={loc} />
                  <p className="mt-1 text-xs text-stone-500 dark:text-zinc-400">{loc.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end border-t border-stone-100 bg-stone-50 px-6 py-3 dark:border-zinc-800 dark:bg-zinc-800/70">
          <button
            onClick={onClose}
            className="rounded-xl bg-stone-800 px-4 py-2 text-xs font-semibold text-white hover:bg-stone-900 dark:bg-zinc-700 dark:hover:bg-zinc-600"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};


