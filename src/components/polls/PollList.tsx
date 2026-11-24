import React, { useState } from 'react';
import type { Poll } from '../../types';
import { PollFormModal } from './PollFormModal';
import { storage } from '../../services/storage';
import { formatDateBR } from '../../services/bagCalculator';
import { BarChart3, Plus, Trash2, Eye, ThumbsUp, Percent } from 'lucide-react';

interface PollListProps {
  polls: Poll[];
  onRefresh: () => void;
}

export const PollList: React.FC<PollListProps> = ({ polls, onRefresh }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = (id: string) => {
    if (window.confirm('Deseja excluir o registro desta enquete?')) {
      storage.deletePoll(id);
      onRefresh();
    }
  };

  const averageParticipation =
    polls.length > 0
      ? (
          polls.reduce((sum, p) => sum + (p.views > 0 ? (p.votes / p.views) * 100 : 0), 0) /
          polls.length
        ).toFixed(1)
      : '0.0';

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="rounded-2xl border border-pink-200/60 bg-white/75 px-5 py-4 backdrop-blur-sm shadow-xs">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-stone-900">
              Engajamento nas Redes Sociais
            </h1>
            <span className="rounded-full bg-pink-100 px-2.5 py-0.5 text-xs font-semibold text-pink-800">
              Taxa de Participação
            </span>
          </div>
          <p className="mt-1 text-sm font-medium text-zinc-800">
            Compare o engajamento das enquetes no Instagram para entender a aceitação dos drops e produtos.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-pink-500 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-pink-600 transition"
        >
          <Plus className="h-4 w-4" />
          <span>Registrar Nova Enquete</span>
        </button>
      </div>

      {/* KPI Card de Engajamento */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/90">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-500 dark:text-zinc-400 uppercase tracking-wider">
            <span>Enquetes Analisadas</span>
            <BarChart3 className="h-4 w-4 text-pink-500" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-stone-900 dark:text-zinc-100">{polls.length}</div>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/90">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-500 dark:text-zinc-400 uppercase tracking-wider">
            <span>Média de Participação</span>
            <Percent className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-emerald-700 dark:text-emerald-400">
            {averageParticipation}%
          </div>
          <div className="mt-1 text-xs text-stone-500 dark:text-zinc-400">Votos / Visualizações</div>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/90">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-500 dark:text-zinc-400 uppercase tracking-wider">
            <span>Fórmula Aplicada</span>
            <span className="text-[10px] bg-stone-100 dark:bg-zinc-800 rounded px-1.5 py-0.5 font-bold text-stone-600 dark:text-zinc-300">
              Automática
            </span>
          </div>
          <div className="mt-2 text-xs font-mono bg-stone-50 dark:bg-zinc-850 p-2 rounded-lg text-stone-700 dark:text-zinc-300 border border-stone-200 dark:border-zinc-700">
            (Votos ÷ Visualizações) × 100
          </div>
        </div>
      </div>

      {/* Tabela Comparativa de Enquetes */}
      {polls.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900/90">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 dark:bg-pink-950/40 text-pink-500 mb-3">
            <BarChart3 className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-stone-800 dark:text-zinc-100 text-base">Nenhuma enquete registrada</h3>
          <p className="mt-1 text-xs text-stone-500 dark:text-zinc-400 max-w-sm mx-auto">
            Lance as visualizações e votos de um story para calcular o engajamento do público.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900/90">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-stone-200 bg-stone-50 text-[11px] font-bold uppercase text-stone-500 dark:border-zinc-800 dark:bg-zinc-850/80 dark:text-zinc-400">
                <tr>
                  <th className="px-4 py-3">Data</th>
                  <th className="px-4 py-3">Tema da Enquete</th>
                  <th className="px-3 py-3 text-center">Visualizações</th>
                  <th className="px-3 py-3 text-center">Votos</th>
                  <th className="px-4 py-3 text-center">Taxa de Participação</th>
                  <th className="px-4 py-3">Observações</th>
                  <th className="px-3 py-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-zinc-800">
                {polls.map((poll) => {
                  const rate =
                    poll.views > 0 ? ((poll.votes / poll.views) * 100).toFixed(1) : '0.0';
                  return (
                    <tr key={poll.id} className="hover:bg-stone-50 dark:hover:bg-zinc-800/50 transition">
                      <td className="px-4 py-3 font-medium text-stone-500 dark:text-zinc-400">
                        {formatDateBR(poll.poll_date)}
                      </td>
                      <td className="px-4 py-3 font-semibold text-stone-900 dark:text-zinc-100">{poll.title}</td>
                      <td className="px-3 py-3 text-center font-medium text-stone-600 dark:text-zinc-300">
                        <span className="inline-flex items-center gap-1">
                          <Eye className="h-3 w-3 text-stone-400 dark:text-zinc-500" />
                          {poll.views}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center font-medium text-stone-600 dark:text-zinc-300">
                        <span className="inline-flex items-center gap-1">
                          <ThumbsUp className="h-3 w-3 text-pink-500" />
                          {poll.votes}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center rounded-full bg-pink-50 dark:bg-pink-950/40 px-2.5 py-0.5 text-xs font-bold text-pink-900 dark:text-pink-300 border border-pink-200 dark:border-pink-900/50">
                          {rate}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-stone-500 dark:text-zinc-400 max-w-xs truncate">
                        {poll.notes || '-'}
                      </td>
                      <td className="px-3 py-3 text-right">
                        <button
                          onClick={() => handleDelete(poll.id)}
                          className="rounded-lg p-1 text-stone-400 hover:bg-rose-50 hover:text-rose-600 dark:text-zinc-500 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
                          title="Excluir"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal de Cadastro */}
      <PollFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPollAdded={onRefresh}
      />
    </div>
  );
};


