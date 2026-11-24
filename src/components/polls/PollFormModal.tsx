import React, { useState } from 'react';
import { storage } from '../../services/storage';
import { X, BarChart3, Calculator } from 'lucide-react';

interface PollFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPollAdded: () => void;
}

export const PollFormModal: React.FC<PollFormModalProps> = ({
  isOpen,
  onClose,
  onPollAdded,
}) => {
  const [title, setTitle] = useState('');
  const [views, setViews] = useState('');
  const [votes, setVotes] = useState('');
  const [notes, setNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const parsedViews = parseInt(views, 10);
  const parsedVotes = parseInt(votes, 10);
  const calculatedRate =
    !isNaN(parsedViews) && !isNaN(parsedVotes) && parsedViews > 0
      ? ((parsedVotes / parsedViews) * 100).toFixed(1)
      : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!title.trim()) {
      setErrorMessage('Informe o tema da enquete.');
      return;
    }

    if (isNaN(parsedViews) || parsedViews <= 0) {
      setErrorMessage('Informe a quantidade de visualizações.');
      return;
    }

    if (isNaN(parsedVotes) || parsedVotes < 0) {
      setErrorMessage('Informe a quantidade de votos recebidos.');
      return;
    }

    if (parsedVotes > parsedViews) {
      setErrorMessage('A quantidade de votos não pode ser maior que as visualizações.');
      return;
    }

    storage.addPoll({
      title: title.trim(),
      views: parsedViews,
      votes: parsedVotes,
      poll_date: new Date().toISOString(),
      notes: notes.trim() || undefined,
    });

    onPollAdded();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl border border-stone-200 overflow-hidden">
        <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-pink-500 text-white">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-stone-900">Registrar Enquete do Instagram</h2>
              <p className="text-xs text-stone-500">Métricas de participação dos seguidores</p>
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
            <label className="text-xs font-semibold text-stone-700">Tema da Enquete / Stories *</label>
            <input
              type="text"
              placeholder="Ex: Qual tamanho abrir no drop de amanhã? P, M ou G?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-800 focus:border-pink-500 focus:outline-hidden"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-stone-700">Visualizações dos Stories *</label>
              <input
                type="number"
                min="1"
                placeholder="Ex: 600"
                value={views}
                onChange={(e) => setViews(e.target.value)}
                className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2 text-sm text-stone-800 focus:border-pink-500 focus:outline-hidden"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-stone-700">Quantidade de Votos *</label>
              <input
                type="number"
                min="0"
                placeholder="Ex: 80"
                value={votes}
                onChange={(e) => setVotes(e.target.value)}
                className="mt-1 w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2 text-sm text-stone-800 focus:border-pink-500 focus:outline-hidden"
                required
              />
            </div>
          </div>

          {/* Prévia automática do cálculo */}
          {calculatedRate !== null && (
            <div className="flex items-center justify-between rounded-xl bg-pink-50 p-3.5 border border-pink-200">
              <div className="flex items-center gap-2 text-xs font-bold text-pink-900">
                <Calculator className="h-4 w-4 text-pink-600" />
                <span>Taxa de Participação Calculada:</span>
              </div>
              <span className="text-lg font-extrabold text-pink-800">{calculatedRate}%</span>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-stone-700">Conclusão / Preferência observada</label>
            <textarea
              rows={2}
              placeholder="Ex: Tamanho M teve 60% de preferência, focar na reposição desse tamanho."
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
              Salvar Enquete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

