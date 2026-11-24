import React, { useState } from 'react';
import type { Bag, Customer, Product } from '../../types';
import { BagCard } from './BagCard';
import { BagFormModal } from './BagFormModal';
import { BagDetailModal } from './BagDetailModal';
import { ShoppingBag, Plus, Search } from 'lucide-react';
import { evaluateBagStatus } from '../../services/bagCalculator';

interface BagListProps {
  bags: Bag[];
  customers: Customer[];
  products: Product[];
  onRefresh: () => void;
}

type BagFilter = 'all' | 'open' | 'closing_soon' | 'closed' | 'shipped';

export const BagList: React.FC<BagListProps> = ({
  bags,
  customers,
  products,
  onRefresh,
}) => {
  const [filter, setFilter] = useState<BagFilter>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedBag, setSelectedBag] = useState<Bag | null>(null);

  const availableProducts = products.filter((p) => p.status === 'available');

  const filteredBags = bags.filter((bag) => {
    // Busca por nome da cliente ou itens da sacolinha
    const matchesSearch =
      bag.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bag.customer_phone.includes(searchTerm) ||
      bag.items.some((i) => i.product_name.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    const evaluation = evaluateBagStatus(bag.opened_at, bag.closing_date, bag.status);

    if (filter === 'all') return true;
    if (filter === 'open') return evaluation.status === 'open';
    if (filter === 'closing_soon') return evaluation.status === 'closing_soon';
    if (filter === 'closed') return evaluation.status === 'closed';
    if (filter === 'shipped') return evaluation.status === 'shipped';

    return true;
  });

  // Contadores para as abas
  const countAll = bags.length;
  const countOpen = bags.filter((b) => evaluateBagStatus(b.opened_at, b.closing_date, b.status).status === 'open').length;
  const countClosingSoon = bags.filter((b) => evaluateBagStatus(b.opened_at, b.closing_date, b.status).status === 'closing_soon').length;
  const countClosed = bags.filter((b) => evaluateBagStatus(b.opened_at, b.closing_date, b.status).status === 'closed').length;
  const countShipped = bags.filter((b) => b.status === 'shipped').length;

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="rounded-2xl border border-pink-200/60 bg-white/75 px-5 py-4 backdrop-blur-sm shadow-xs">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-stone-900">
              Controle de Sacolinhas
            </h1>
            <span className="rounded-full bg-pink-100 px-2.5 py-0.5 text-xs font-semibold text-pink-800">
              Prazo de 30 dias
            </span>
          </div>
          <p className="mt-1 text-sm font-medium text-zinc-800">
            Gerencie o acúmulo de compras das clientes e acompanhe as datas limite de envio para economia no frete.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-pink-500 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-pink-600 transition"
        >
          <Plus className="h-4 w-4" />
          <span>Abrir Nova Sacolinha</span>
        </button>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white p-3 shadow-xs md:flex-row md:items-center md:justify-between">
        {/* Abas */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setFilter('all')}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
              filter === 'all'
                ? 'bg-pink-500 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Todas ({countAll})
          </button>
          <button
            onClick={() => setFilter('open')}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
              filter === 'open'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Em Aberto ({countOpen})
          </button>
          <button
            onClick={() => setFilter('closing_soon')}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
              filter === 'closing_soon'
                ? 'bg-pink-500 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            A Vencer ({countClosingSoon})
          </button>
          <button
            onClick={() => setFilter('closed')}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
              filter === 'closed'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Vencidas/Fechadas ({countClosed})
          </button>
          <button
            onClick={() => setFilter('shipped')}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
              filter === 'shipped'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Enviadas ({countShipped})
          </button>
        </div>

        {/* Input de Busca */}
        <div className="relative min-w-[220px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Buscar por cliente ou peça..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-stone-200 bg-stone-50 pl-8.5 pr-3 py-1.5 text-xs text-stone-800 placeholder-stone-400 focus:border-pink-500 focus:bg-white focus:outline-hidden"
          />
        </div>
      </div>

      {/* Grid de Sacolinhas */}
      {filteredBags.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-200 bg-white p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-pink-500 mb-3">
            <ShoppingBag className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-stone-800 text-base">Nenhuma sacolinha encontrada</h3>
          <p className="mt-1 text-xs text-stone-500 max-w-sm mx-auto">
            {searchTerm
              ? 'Tente ajustar sua busca ou limpar os filtros.'
              : 'Abra uma nova sacolinha para uma cliente começar a acumular compras.'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setIsCreateOpen(true)}
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-pink-500 px-4 py-2 text-xs font-bold text-white hover:bg-pink-600 shadow-xs"
            >
              <Plus className="h-4 w-4" />
              <span>Abrir Primeira Sacolinha</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredBags.map((bag) => (
            <BagCard
              key={bag.id}
              bag={bag}
              onOpenDetail={(b) => setSelectedBag(b)}
            />
          ))}
        </div>
      )}

      {/* Modais */}
      <BagFormModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        customers={customers}
        onBagCreated={onRefresh}
      />

      <BagDetailModal
        bag={selectedBag}
        isOpen={!!selectedBag}
        onClose={() => setSelectedBag(null)}
        availableProducts={availableProducts}
        onBagUpdated={() => {
          onRefresh();
          if (selectedBag) {
            // Atualiza a sacolinha selecionada no modal
            const updated = bags.find((b) => b.id === selectedBag.id);
            setSelectedBag(updated || null);
          }
        }}
      />
    </div>
  );
};


