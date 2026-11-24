import React, { useState } from 'react';
import type { Product, StorageLocation } from '../../types';
import { storage } from '../../services/storage';
import { X, PackagePlus } from 'lucide-react';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  locations: StorageLocation[];
  onProductSaved: () => void;
  productToEdit?: Product | null;
}

const CATEGORIES: Product['category'][] = [
  'Vestido',
  'Blusa',
  'Calça',
  'Saia',
  'Sapato',
  'Bolsa',
  'Acessório',
  'Casaco',
];

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  locations,
  onProductSaved,
  productToEdit,
}) => {
  const [name, setName] = useState(productToEdit?.name || '');
  const [category, setCategory] = useState<Product['category']>(productToEdit?.category || 'Vestido');
  const [size, setSize] = useState(productToEdit?.size || 'M');
  const [salePrice, setSalePrice] = useState(productToEdit?.sale_price?.toString() || '');
  const [purchasePrice, setPurchasePrice] = useState(productToEdit?.purchase_price?.toString() || '');
  const [storageLocationId, setStorageLocationId] = useState(
    productToEdit?.storage_location_id || (locations[0]?.id || '')
  );
  const [notes, setNotes] = useState(productToEdit?.notes || '');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Informe o nome ou descrição da peça.');
      return;
    }

    const price = parseFloat(salePrice.replace(',', '.'));
    if (isNaN(price) || price <= 0) {
      setErrorMessage('Informe um preço de venda válido.');
      return;
    }

    const cost = purchasePrice ? parseFloat(purchasePrice.replace(',', '.')) : undefined;

    try {
      storage.saveProduct(
        {
          name: name.trim(),
          category,
          size: size.trim(),
          sale_price: price,
          purchase_price: cost,
          status: productToEdit?.status || 'available',
          storage_location_id: storageLocationId,
          notes: notes.trim() || undefined,
        },
        productToEdit?.id
      );

      onProductSaved();
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 p-4 backdrop-blur-xs dark:bg-black/75">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl border border-stone-200 overflow-hidden dark:bg-zinc-900 dark:border-zinc-800">
        <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-pink-500 text-white shadow-xs">
              <PackagePlus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-stone-900 dark:text-zinc-100">
                {productToEdit ? 'Editar Peça' : 'Cadastrar Nova Peça no Estoque'}
              </h2>
              <p className="text-xs text-stone-500 dark:text-zinc-400">Mapeamento de peça e localização física residencial</p>
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

          <div>
            <label className="text-xs font-semibold text-stone-700 dark:text-zinc-300">Nome / Descrição da Peça *</label>
            <input
              type="text"
              placeholder="Ex: Vestido floral midi vintage anos 90"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-800 focus:border-pink-500 focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-stone-700 dark:text-zinc-300">Categoria *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Product['category'])}
                className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-800 focus:border-pink-500 focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-stone-700 dark:text-zinc-300">Tamanho / Numeração *</label>
              <input
                type="text"
                placeholder="Ex: M (38/40) ou 37"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-800 focus:border-pink-500 focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
                required
              />
            </div>
          </div>

          {/* Localização Física - Ponto crítico do Jú Brechó */}
          <div>
            <label className="text-xs font-semibold text-stone-700 dark:text-zinc-300 flex items-center justify-between">
              <span>Localização Física (Onde está guardada?) *</span>
              <span className="text-[11px] font-normal text-pink-700 dark:text-pink-400">
                Evita perda de peças na residência
              </span>
            </label>
            <select
              value={storageLocationId}
              onChange={(e) => setStorageLocationId(e.target.value)}
              className="mt-1 w-full rounded-xl border-2 border-pink-300 bg-pink-50 px-3.5 py-2.5 text-sm font-medium text-stone-900 focus:border-pink-500 focus:outline-hidden dark:border-pink-500/50 dark:bg-pink-950/40 dark:text-zinc-100"
            >
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name} — {loc.description}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-stone-700 dark:text-zinc-300">Preço de Venda (R$) *</label>
              <input
                type="text"
                placeholder="Ex: 65,00"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-stone-800 focus:border-pink-500 focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-stone-700 dark:text-zinc-300">Preço de Custo (R$) - Opcional</label>
              <input
                type="text"
                placeholder="Ex: 25,00"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(e.target.value)}
                className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-800 focus:border-pink-500 focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-700 dark:text-zinc-300">Detalhes / Estado da Peça (opcional)</label>
            <textarea
              rows={2}
              placeholder="Ex: Sem marcas de uso, tecido 100% algodão, botões originais..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1 w-full rounded-xl border border-stone-300 bg-white p-3 text-xs text-stone-800 focus:border-pink-500 focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
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
              Salvar Peça no Estoque
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


