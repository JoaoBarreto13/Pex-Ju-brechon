import React, { useState } from 'react';
import type { Product, StorageLocation } from '../../types';
import { LocationBadge } from './LocationBadges';
import { ProductFormModal } from './ProductFormModal';
import { LocationManagerModal } from './LocationManagerModal';
import { storage } from '../../services/storage';
import { formatCurrency } from '../../services/bagCalculator';
import {
  Package,
  Plus,
  Search,
  MapPin,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  Check,
} from 'lucide-react';

interface ProductListProps {
  products: Product[];
  locations: StorageLocation[];
  onRefresh: () => void;
}

export const ProductList: React.FC<ProductListProps> = ({
  products,
  locations,
  onRefresh,
}) => {
  const [selectedLocationId, setSelectedLocationId] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLocationsModalOpen, setIsLocationsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  // Mapeamento de id do local para o objeto
  const locationMap = new Map(locations.map((l) => [l.id, l]));

  // Contagem de produtos por local
  const locationCounts = locations.map((loc) => ({
    location: loc,
    count: products.filter((p) => p.storage_location_id === loc.id && p.status !== 'sold').length,
  }));

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.size.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedLocationId !== 'all' && product.storage_location_id !== selectedLocationId) {
      return false;
    }

    if (selectedStatus !== 'all' && product.status !== selectedStatus) {
      return false;
    }

    if (selectedCategory !== 'all' && product.category !== selectedCategory) {
      return false;
    }

    return true;
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta peça do estoque?')) {
      try {
        storage.deleteProduct(id);
        onRefresh();
      } catch (err: unknown) {
        if (err instanceof Error) {
          alert(err.message);
        }
      }
    }
  };

  const getStatusBadge = (status: Product['status']) => {
    switch (status) {
      case 'available':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="h-3 w-3" />
            Disponível
          </span>
        );
      case 'reserved_bag':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-pink-50 px-2 py-0.5 text-xs font-semibold text-pink-800 border border-pink-200">
            <Clock className="h-3 w-3" />
            Na Sacolinha
          </span>
        );
      case 'sold':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2 py-0.5 text-xs font-semibold text-stone-600 border border-stone-200">
            <Check className="h-3 w-3" />
            Vendida
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="rounded-2xl border border-pink-200/60 bg-white/75 px-5 py-4 backdrop-blur-sm shadow-xs">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-stone-900">
              Controle de Estoque & Localização
            </h1>
            <span className="rounded-full bg-pink-100 px-2.5 py-0.5 text-xs font-semibold text-pink-800">
              Mapeamento Físico
            </span>
          </div>
          <p className="mt-1 text-sm font-medium text-zinc-800">
            Saiba instantaneamente onde cada peça está guardada na casa (Box da cama, caixas organizadoras).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsLocationsModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 shadow-xs"
          >
            <MapPin className="h-3.5 w-3.5 text-pink-600" />
            <span>Gerenciar Caixas/Locais</span>
          </button>
          <button
            onClick={() => {
              setProductToEdit(null);
              setIsAddModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-pink-500 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-pink-600 transition"
          >
            <Plus className="h-4 w-4" />
            <span>Nova Peça</span>
          </button>
        </div>
      </div>

      {/* Carrossel / Cards de Locais Físicos */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
            Filtrar por Local de Armazenamento na Casa
          </span>
          {selectedLocationId !== 'all' && (
            <button
              onClick={() => setSelectedLocationId('all')}
              className="text-xs font-semibold text-pink-600 hover:text-pink-700 underline"
            >
              Ver todos os locais
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-7">
          <button
            onClick={() => setSelectedLocationId('all')}
            className={`flex flex-col rounded-xl border p-2.5 text-left transition ${
              selectedLocationId === 'all'
                ? 'border-pink-500 bg-pink-50 shadow-xs'
                : 'border-stone-200 bg-white hover:border-stone-300'
            }`}
          >
            <span className="text-xs font-bold text-stone-900 truncate">Todos os Locais</span>
            <span className="text-[11px] text-stone-500 mt-0.5">
              {products.filter((p) => p.status !== 'sold').length} ativas
            </span>
          </button>

          {locationCounts.map(({ location, count }) => (
            <button
              key={location.id}
              onClick={() => setSelectedLocationId(location.id)}
              className={`flex flex-col rounded-xl border p-2.5 text-left transition ${
                selectedLocationId === location.id
                  ? 'border-pink-500 bg-pink-50 shadow-xs'
                  : 'border-stone-200 bg-white hover:border-stone-300'
              }`}
            >
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-bold text-stone-900 truncate">{location.name}</span>
                <span className="rounded-full bg-stone-100 px-1.5 py-0.2 text-[10px] font-bold text-stone-600">
                  {count}
                </span>
              </div>
              <span className="text-[10px] text-stone-500 truncate mt-0.5">{location.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Filtros Secundários e Barra de Busca */}
      <div className="flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white p-3 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {/* Status */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs text-stone-800 focus:border-pink-500 focus:outline-hidden"
          >
            <option value="all">Status: Todos</option>
            <option value="available">Disponíveis</option>
            <option value="reserved_bag">Na Sacolinha (Reservados)</option>
            <option value="sold">Vendidos</option>
          </select>

          {/* Categorias */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs text-stone-800 focus:border-pink-500 focus:outline-hidden"
          >
            <option value="all">Categoria: Todas</option>
            <option value="Vestido">Vestidos</option>
            <option value="Blusa">Blusas</option>
            <option value="Calça">Calças</option>
            <option value="Saia">Saias</option>
            <option value="Sapato">Sapatos</option>
            <option value="Bolsa">Bolsas</option>
            <option value="Casaco">Casacos</option>
            <option value="Acessório">Acessórios</option>
          </select>
        </div>

        {/* Busca por texto */}
        <div className="relative min-w-[220px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Buscar peça, tamanho..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-stone-200 bg-stone-50 pl-8.5 pr-3 py-1.5 text-xs text-stone-800 placeholder-stone-400 focus:border-pink-500 focus:bg-white focus:outline-hidden"
          />
        </div>
      </div>

      {/* Tabela de Produtos */}
      {filteredProducts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-200 bg-white p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-pink-500 mb-3">
            <Package className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-stone-800 text-base">Nenhuma peça encontrada</h3>
          <p className="mt-1 text-xs text-stone-500 max-w-sm mx-auto">
            {searchTerm || selectedLocationId !== 'all' || selectedStatus !== 'all'
              ? 'Tente alterar os filtros de busca ou localização física.'
              : 'Cadastre sua primeira peça com a caixa ou local onde ela está guardada.'}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-stone-200 bg-stone-50 text-[11px] font-bold uppercase tracking-wider text-stone-600">
                <tr>
                  <th className="px-4 py-3">Peça / Descrição</th>
                  <th className="px-3 py-3">Categoria</th>
                  <th className="px-3 py-3">Tamanho</th>
                  <th className="px-3 py-3">Localização Física</th>
                  <th className="px-3 py-3">Preço</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredProducts.map((p) => {
                  const loc = locationMap.get(p.storage_location_id);
                  return (
                    <tr key={p.id} className="hover:bg-stone-50 transition">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-stone-900">{p.name}</div>
                        {p.notes && <div className="text-[11px] text-stone-600 truncate max-w-xs">{p.notes}</div>}
                      </td>
                      <td className="px-3 py-3 text-stone-600">{p.category}</td>
                      <td className="px-3 py-3 font-medium text-stone-700">{p.size}</td>
                      <td className="px-3 py-3">
                        <LocationBadge location={loc} />
                      </td>
                      <td className="px-3 py-3 font-bold text-stone-900">
                        {formatCurrency(p.sale_price)}
                      </td>
                      <td className="px-3 py-3">{getStatusBadge(p.status)}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setProductToEdit(p);
                              setIsAddModalOpen(true);
                            }}
                            className="rounded-lg p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
                            title="Editar peça"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="rounded-lg p-1 text-stone-400 hover:bg-rose-50 hover:text-rose-600"
                            title="Excluir peça"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modais */}
      <ProductFormModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setProductToEdit(null);
        }}
        locations={locations}
        onProductSaved={onRefresh}
        productToEdit={productToEdit}
      />

      <LocationManagerModal
        isOpen={isLocationsModalOpen}
        onClose={() => setIsLocationsModalOpen(false)}
        locations={locations}
        onLocationsUpdated={onRefresh}
      />
    </div>
  );
};


