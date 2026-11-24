import React, { useState } from 'react';
import type { Sale, Expense, FinancialSummaryData } from '../../types';
import { ExpenseModal } from './ExpenseModal';
import { GoalModal } from './GoalModal';
import { storage } from '../../services/storage';
import { formatCurrency, formatDateBR } from '../../services/bagCalculator';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Target,
  Plus,
  Edit,
  Trash2,
} from 'lucide-react';

interface FinancialSummaryProps {
  sales: Sale[];
  expenses: Expense[];
  summary: FinancialSummaryData;
  onRefresh: () => void;
}

export const FinancialSummary: React.FC<FinancialSummaryProps> = ({
  sales,
  expenses,
  summary,
  onRefresh,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'sales' | 'expenses'>('sales');
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);

  const handleDeleteExpense = (id: string) => {
    if (window.confirm('Deseja excluir o registro desta despesa?')) {
      storage.deleteExpense(id);
      onRefresh();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-stone-900">
              Controle Financeiro
            </h1>
            <span className="rounded-full bg-pink-100 px-2.5 py-0.5 text-xs font-semibold text-pink-800">
              Gestão Simplificada
            </span>
          </div>
          <p className="text-sm text-stone-600 mt-0.5">
            Acompanhe o faturamento com vendas de sacolinhas, despesas operacionais e a meta mensal.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsGoalModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 shadow-xs"
          >
            <Target className="h-3.5 w-3.5 text-pink-600" />
            <span>Ajustar Meta</span>
          </button>
          <button
            onClick={() => setIsExpenseModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-rose-700 transition"
          >
            <Plus className="h-4 w-4" />
            <span>Nova Despesa</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Receita Bruta */}
        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Faturamento Bruto
            </span>
            <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-extrabold text-stone-900">
            {formatCurrency(summary.grossRevenue)}
          </div>
          <div className="mt-1 text-xs text-stone-500">
            {summary.totalSalesCount} {summary.totalSalesCount === 1 ? 'venda registrada' : 'vendas registradas'}
          </div>
        </div>

        {/* Despesas */}
        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Total de Despesas
            </span>
            <div className="rounded-xl bg-rose-50 p-2 text-rose-600">
              <TrendingDown className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-extrabold text-stone-900">
            {formatCurrency(summary.totalExpenses)}
          </div>
          <div className="mt-1 text-xs text-stone-500">
            {expenses.length} despesas lançadas
          </div>
        </div>

        {/* Resultado Simplificado */}
        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Resultado Simplificado
            </span>
            <div
              className={`rounded-xl p-2 ${
                summary.netResult >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
              }`}
            >
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div
            className={`mt-3 text-2xl font-extrabold ${
              summary.netResult >= 0 ? 'text-emerald-700' : 'text-rose-700'
            }`}
          >
            {formatCurrency(summary.netResult)}
          </div>
          <div className="mt-1 text-xs text-stone-500">
            Estimativa líquida operacional
          </div>
        </div>

        {/* Ticket Médio */}
        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Ticket Médio
            </span>
            <div className="rounded-xl bg-pink-50 p-2 text-pink-600">
              <ShoppingBag className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-extrabold text-stone-900">
            {formatCurrency(summary.averageTicket)}
          </div>
          <div className="mt-1 text-xs text-stone-500">
            Média por pedido / sacolinha
          </div>
        </div>
      </div>

      {/* Meta Mensal Card */}
      <div className="rounded-2xl border border-pink-200/90 bg-gradient-to-r from-pink-500/10 via-pink-500/5 to-white p-6 shadow-xs">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500 text-white shadow-xs">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base">Meta de Vendas do Mês</h3>
              <p className="text-xs text-stone-600">
                Alvo: <strong>{formatCurrency(summary.monthlyGoal)}</strong> • Atingido:{' '}
                <strong>{formatCurrency(summary.grossRevenue)}</strong> ({summary.goalProgressPercent}%)
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsGoalModalOpen(true)}
            className="inline-flex items-center gap-1 self-start text-xs font-bold text-pink-800 hover:text-pink-900 underline sm:self-center"
          >
            <Edit className="h-3.5 w-3.5" />
            Modificar Alvo
          </button>
        </div>

        {/* Barra de Progresso */}
        <div className="mt-4">
          <div className="h-3 w-full overflow-hidden rounded-full bg-stone-200">
            <div
              className="h-full rounded-full bg-gradient-to-r from-pink-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${summary.goalProgressPercent}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-xs text-stone-500">
            <span>R$ 0,00</span>
            <span className="font-semibold text-stone-700">
              {summary.goalProgressPercent >= 100
                ? '🎉 Meta mensal batida com sucesso!'
                : `Faltam ${formatCurrency(Math.max(0, summary.monthlyGoal - summary.grossRevenue))}`}
            </span>
            <span>{formatCurrency(summary.monthlyGoal)}</span>
          </div>
        </div>
      </div>

      {/* Tabelas de Vendas e Despesas */}
      <div className="space-y-4">
        <div className="flex border-b border-stone-200">
          <button
            onClick={() => setActiveSubTab('sales')}
            className={`border-b-2 px-4 py-2.5 text-xs font-bold transition ${
              activeSubTab === 'sales'
                ? 'border-pink-500 text-pink-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Histórico de Vendas ({sales.length})
          </button>
          <button
            onClick={() => setActiveSubTab('expenses')}
            className={`border-b-2 px-4 py-2.5 text-xs font-bold transition ${
              activeSubTab === 'expenses'
                ? 'border-rose-500 text-rose-700'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Histórico de Despesas ({expenses.length})
          </button>
        </div>

        {activeSubTab === 'sales' ? (
          <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xs">
            {sales.length === 0 ? (
              <p className="p-8 text-center text-xs text-stone-500">Nenhuma venda registrada ainda.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-stone-200 bg-stone-50 text-[11px] font-bold uppercase text-stone-500">
                    <tr>
                      <th className="px-4 py-3">Data</th>
                      <th className="px-3 py-3">Cliente</th>
                      <th className="px-3 py-3">Resumo dos Itens</th>
                      <th className="px-3 py-3">Pagamento</th>
                      <th className="px-4 py-3 text-right">Valor Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {sales.map((sale) => (
                      <tr key={sale.id} className="hover:bg-stone-50">
                        <td className="px-4 py-3 text-stone-500 font-medium">
                          {formatDateBR(sale.sale_date)}
                        </td>
                        <td className="px-3 py-3 font-semibold text-stone-900">
                          {sale.customer_name}
                        </td>
                        <td className="px-3 py-3 text-stone-600 max-w-xs truncate">
                          {sale.items_summary || 'Sacolinha despachada'}
                        </td>
                        <td className="px-3 py-3">
                          <span className="rounded-md bg-stone-100 px-2 py-0.5 text-[11px] font-semibold text-stone-700">
                            {sale.payment_method}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-emerald-700">
                          {formatCurrency(sale.total_amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xs">
            {expenses.length === 0 ? (
              <p className="p-8 text-center text-xs text-stone-500">Nenhuma despesa registrada.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-stone-200 bg-stone-50 text-[11px] font-bold uppercase text-stone-500">
                    <tr>
                      <th className="px-4 py-3">Data</th>
                      <th className="px-3 py-3">Descrição da Despesa</th>
                      <th className="px-3 py-3">Categoria</th>
                      <th className="px-3 py-3 text-right">Valor</th>
                      <th className="px-4 py-3 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {expenses.map((expense) => (
                      <tr key={expense.id} className="hover:bg-stone-50">
                        <td className="px-4 py-3 text-stone-500 font-medium">
                          {formatDateBR(expense.expense_date)}
                        </td>
                        <td className="px-3 py-3 font-semibold text-stone-900">
                          {expense.description}
                        </td>
                        <td className="px-3 py-3">
                          <span className="rounded-md bg-stone-100 px-2 py-0.5 text-[11px] font-semibold text-stone-700">
                            {expense.category}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-right font-bold text-rose-700">
                          {formatCurrency(expense.amount)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => handleDeleteExpense(expense.id)}
                            className="rounded-lg p-1 text-stone-400 hover:bg-rose-50 hover:text-rose-600"
                            title="Excluir"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Disclaimer de escopo acadêmico/MVP da regra 158 */}
      <p className="text-center text-[11px] text-stone-600 italic">
        * Nota de Gestão: Este painel apresenta estimativas simplificadas para acompanhamento operacional do brechó, não constituindo contabilidade formal.
      </p>

      {/* Modais */}
      <ExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        onExpenseAdded={onRefresh}
      />
      <GoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        currentGoal={summary.monthlyGoal}
        onGoalUpdated={onRefresh}
      />
    </div>
  );
};


