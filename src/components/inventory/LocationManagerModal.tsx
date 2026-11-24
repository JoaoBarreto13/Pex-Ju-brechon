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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl border border-stone-200 overflow-hidden">
        <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-pink-500 text-white">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-stone-900">Locais Físicos de Estoque</h2>
              <p className="text-xs text-stone-500">Mapeamento de caixas e espaços na casa</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Locais Cadastrados ({locations.length})
            </span>
            {!isAdding && (
              <button
                onClick={() => setIsAdding(true)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-pink-600 hover:text-pink-700"
              >
                <Plus className="h-3.5 w-3.5" />
                Novo Local / Caixa
              </button>
            )}
          </div>

          {isAdding && (
            <form onSubmit={handleAdd} className="rounded-xl border border-pink-300 bg-pink-50 p-4 space-y-3">
              <h4 className="font-bold text-stone-900 text-xs">Adicionar Novo Local</h4>
              <div>
                <label className="text-xs font-medium text-stone-700">Nome do Local / Caixa *</label>
                <input
                  type="text"
                  placeholder="Ex: Caixa R03 ou Gaveteiro Quarto 2"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-xs text-stone-800 focus:border-pink-500 focus:outline-hidden"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium text-stone-700">Tipo de Armazenamento</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as StorageLocation['type'])}
                  className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-xs text-stone-800 focus:border-pink-500 focus:outline-hidden"
                >
                  <option value="caixa_roupas">Caixa Organizadora de Roupas</option>
                  <option value="caixa_sapatos">Caixa Organizadora de Sapatos</option>
                  <option value="box">Box da Cama</option>
                  <option value="arara">Arara / Cabideiro</option>
                  <option value="outro">Outro Espaço</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-stone-700">Descrição / O que vai dentro?</label>
                <input
                  type="text"
                  placeholder="Ex: Roupas de banho e biquínis vintage"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-xs text-stone-800 focus:border-pink-500 focus:outline-hidden"
                />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="rounded-lg px-3 py-1.5 text-xs font-medium text-stone-600 hover:bg-stone-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-pink-500 px-4 py-1.5 text-xs font-bold text-white hover:bg-pink-600"
                >
                  Salvar Local
                </button>
              </div>
            </form>
          )}

          <div className="divide-y divide-stone-100 rounded-xl border border-stone-200 bg-white overflow-hidden">
            {locations.map((loc) => (
              <div key={loc.id} className="flex items-center justify-between p-3">
                <div>
                  <LocationBadge location={loc} />
                  <p className="mt-1 text-xs text-stone-500">{loc.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end border-t border-stone-100 bg-stone-50 px-6 py-3">
          <button
            onClick={onClose}
            className="rounded-xl bg-stone-800 px-4 py-2 text-xs font-semibold text-white hover:bg-stone-900"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};


