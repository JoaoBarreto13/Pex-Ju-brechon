import React from 'react';
import type { Bag, Product, FinancialSummaryData } from '../../types';
import type { ActiveTab } from '../layout/Sidebar';
import { BagCountdownBadge } from '../bags/BagCountdownBadge';
import { formatCurrency, formatDateBR, evaluateBagStatus } from '../../services/bagCalculator';
import {
  ShoppingBag,
  Package,
  TrendingUp,
  AlertTriangle,
  Clock,
  ArrowRight,
  Plus,
  Target,
  Sparkles,
} from 'lucide-react';

interface DashboardOverviewProps {
  bags: Bag[];
  products: Product[];
  financialSummary: FinancialSummaryData;
  onNavigateTab: (tab: ActiveTab) => void;
  onOpenBagDetail: (bag: Bag) => void;
  onOpenCreateBag: () => void;
  onOpenCreateProduct: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  bags,
  products,
  financialSummary,
  onNavigateTab,
  onOpenBagDetail,
  onOpenCreateBag,
  onOpenCreateProduct,
}) => {
  // Sacolinhas ativas
  const activeBags = bags.filter((b) => b.status !== 'shipped');
  const openBags = activeBags.filter((b) => evaluateBagStatus(b.opened_at, b.closing_date, b.status).status === 'open');
  const closingSoonBags = activeBags.filter((b) => {
    const status = evaluateBagStatus(b.opened_at, b.closing_date, b.status).status;
    return status === 'closing_soon' || status === 'closed';
  });

  // Produtos disponíveis
  const availableProducts = products.filter((p) => p.status === 'available');

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-3xl border border-pink-200 bg-gradient-to-br from-pink-50 via-white to-pink-100 p-6 md:p-8 shadow-xs dark:border-pink-900/40 dark:from-[#1c1219] dark:via-[#140e14] dark:to-[#1a0f17]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-pink-500 text-white shadow-xs">
                <Sparkles className="h-3.5 w-3.5" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-pink-900 dark:text-pink-300">
                Painel Operacional
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-black tracking-tight text-stone-900 dark:text-zinc-100 md:text-3xl">
              Olá, Jú! Bem-vinda ao seu sistema.
            </h1>
            <p className="mt-1 text-sm font-medium text-zinc-800 dark:text-zinc-300 max-w-xl">
              Aqui está o resumo das suas sacolinhas em andamento, localização do estoque residencial e saúde financeira do brechó.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenCreateBag}
              className="flex items-center gap-1.5 rounded-xl bg-pink-500 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-pink-600 transition"
            >
              <Plus className="h-4 w-4" />
              <span>Nova Sacolinha</span>
            </button>
            <button
              onClick={onOpenCreateProduct}
              className="flex items-center gap-1.5 rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-xs font-semibold text-stone-700 shadow-xs hover:bg-stone-50 transition dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
            >
              <Plus className="h-4 w-4" />
              <span>Cadastrar Peça</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Sacolinhas Abertas */}
        <div
          onClick={() => onNavigateTab('bags')}
          className="group cursor-pointer rounded-2xl border border-stone-200 bg-white p-5 shadow-xs transition hover:border-pink-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/90 dark:hover:border-pink-500/30"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 dark:text-zinc-400 uppercase tracking-wider">
              Sacolinhas Abertas
            </span>
            <div className="rounded-xl bg-sky-50 dark:bg-sky-950/50 p-2 text-sky-600 dark:text-sky-400 group-hover:scale-110 transition">
              <ShoppingBag className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-stone-900 dark:text-zinc-100">{activeBags.length}</div>
          <div className="mt-1 flex items-center justify-between text-xs text-stone-500 dark:text-zinc-400">
            <span>{openBags.length} com prazo tranquilo</span>
            <ArrowRight className="h-3 w-3 text-stone-400 dark:text-zinc-500 group-hover:translate-x-1 transition" />
          </div>
        </div>

        {/* Sacolinhas Próximas ao Prazo */}
        <div
          onClick={() => onNavigateTab('bags')}
          className="group cursor-pointer rounded-2xl border border-stone-200 bg-white p-5 shadow-xs transition hover:border-pink-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/90 dark:hover:border-pink-500/30"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 dark:text-zinc-400 uppercase tracking-wider">
              A Vencer / Fechadas
            </span>
            <div className="rounded-xl bg-pink-500 p-2 text-white group-hover:scale-110 transition">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-stone-900 dark:text-zinc-100">{closingSoonBags.length}</div>
          <div className="mt-1 flex items-center justify-between text-xs text-stone-500 dark:text-zinc-400">
            <span>≤ 7 dias ou expiradas</span>
            <ArrowRight className="h-3 w-3 text-stone-400 dark:text-zinc-500 group-hover:translate-x-1 transition" />
          </div>
        </div>

        {/* Peças Disponíveis no Estoque */}
        <div
          onClick={() => onNavigateTab('inventory')}
          className="group cursor-pointer rounded-2xl border border-stone-200 bg-white p-5 shadow-xs transition hover:border-pink-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/90 dark:hover:border-pink-500/30"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 dark:text-zinc-400 uppercase tracking-wider">
              Peças Disponíveis
            </span>
            <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950/50 p-2 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition">
              <Package className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-stone-900 dark:text-zinc-100">{availableProducts.length}</div>
          <div className="mt-1 flex items-center justify-between text-xs text-stone-500 dark:text-zinc-400">
            <span>{products.length} peças totais no cadastro</span>
            <ArrowRight className="h-3 w-3 text-stone-400 dark:text-zinc-500 group-hover:translate-x-1 transition" />
          </div>
        </div>

        {/* Faturamento do Mês */}
        <div
          onClick={() => onNavigateTab('finance')}
          className="group cursor-pointer rounded-2xl border border-stone-200 bg-white p-5 shadow-xs transition hover:border-pink-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/90 dark:hover:border-pink-500/30"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 dark:text-zinc-400 uppercase tracking-wider">
              Faturamento do Mês
            </span>
            <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/50 p-2 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-emerald-700 dark:text-emerald-400">
            {formatCurrency(financialSummary.grossRevenue)}
          </div>
          <div className="mt-1 flex items-center justify-between text-xs text-stone-500 dark:text-zinc-400">
            <span>{financialSummary.goalProgressPercent}% da meta mensal</span>
            <ArrowRight className="h-3 w-3 text-stone-400 dark:text-zinc-500 group-hover:translate-x-1 transition" />
          </div>
        </div>
      </div>

      {/* Seção Crítica: Sacolinhas que Exigem Atenção Imediata */}
      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/90">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-pink-100 dark:bg-pink-950/50 text-pink-700 dark:text-pink-400">
              <Clock className="h-4 w-4" />
            </div>
            <h2 className="font-bold text-stone-900 dark:text-zinc-100 text-base">
              Sacolinhas que Exigem Atenção (Próximas do Fechamento)
            </h2>
          </div>
          <button
            onClick={() => onNavigateTab('bags')}
            className="text-xs font-semibold text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 underline"
          >
            Ver todas as sacolinhas
          </button>
        </div>

        {closingSoonBags.length === 0 ? (
          <div className="rounded-xl border border-dashed border-stone-200 dark:border-zinc-800 p-6 text-center text-xs text-stone-500 dark:text-zinc-400">
            ✓ Nenhuma sacolinha está com prazo crítico no momento! Todas as clientes ativas possuem mais de 7 dias restantes.
          </div>
        ) : (
          <div className="divide-y divide-stone-100 dark:divide-zinc-800">
            {closingSoonBags.map((bag) => (
              <div
                key={bag.id}
                className="flex flex-col gap-3 py-3.5 sm:flex-row sm:items-center sm:justify-between hover:bg-stone-50 dark:hover:bg-zinc-800/50 rounded-xl px-2 transition"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-bold text-stone-900 dark:text-zinc-100 text-sm">{bag.customer_name}</span>
                    <BagCountdownBadge
                      openedAt={bag.opened_at}
                      closingDate={bag.closing_date}
                      status={bag.status}
                    />
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-stone-500 dark:text-zinc-400">
                    <span>{bag.items.length} peça(s)</span>
                    <span>•</span>
                    <span>Total: <strong className="text-stone-800 dark:text-zinc-200">{formatCurrency(bag.total_amount)}</strong></span>
                    <span>•</span>
                    <span>Fecha em: {formatDateBR(bag.closing_date)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onOpenBagDetail(bag)}
                    className="rounded-xl bg-pink-500 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-pink-600 transition shadow-xs"
                  >
                    Gerenciar & Cobrar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Meta Mensal & Estoque Rápido */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Progresso da Meta */}
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/90">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-stone-900 dark:text-zinc-100 text-sm flex items-center gap-2">
              <Target className="h-4 w-4 text-pink-500" />
              <span>Meta Mensal de Vendas</span>
            </h3>
            <span className="text-xs font-bold text-pink-800 dark:text-pink-300">
              {financialSummary.goalProgressPercent}%
            </span>
          </div>

          <div className="h-2.5 w-full overflow-hidden rounded-full bg-stone-100 dark:bg-zinc-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-pink-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${financialSummary.goalProgressPercent}%` }}
            />
          </div>

          <div className="mt-3 flex justify-between text-xs text-stone-500 dark:text-zinc-400">
            <span>Faturado: {formatCurrency(financialSummary.grossRevenue)}</span>
            <span>Meta: {formatCurrency(financialSummary.monthlyGoal)}</span>
          </div>
        </div>

        {/* Resumo Rápido de Estoque */}
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/90">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-stone-900 dark:text-zinc-100 text-sm flex items-center gap-2">
              <Package className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
              <span>Onde estão as peças disponíveis?</span>
            </h3>
            <button
              onClick={() => onNavigateTab('inventory')}
              className="text-xs font-semibold text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300"
            >
              Ver estoque completo
            </button>
          </div>

          <p className="text-xs text-stone-600 dark:text-zinc-300 leading-relaxed">
            Você possui <strong className="text-stone-900 dark:text-zinc-100">{availableProducts.length} peças disponíveis</strong> para novos pedidos e sacolinhas. O cadastro de localização física permite encontrar rapidamente cada peça guardada no box da cama ou caixas organizadoras.
          </p>
        </div>
      </div>
    </div>
  );
};


