import React, { useState } from 'react';
import type { Bag, Product } from '../../types';
import { storage } from '../../services/storage';
import { formatCurrency, formatDateBR } from '../../services/bagCalculator';
import { BagCountdownBadge } from './BagCountdownBadge';
import {
  X,
  Plus,
  Trash2,
  Calendar,
  Phone,
  MessageCircle,
  Truck,
  MapPin,
  Check,
  ShoppingBag,
} from 'lucide-react';

interface BagDetailModalProps {
  bag: Bag | null;
  isOpen: boolean;
  onClose: () => void;
  availableProducts: Product[];
  onBagUpdated: () => void;
}

export const BagDetailModal: React.FC<BagDetailModalProps> = ({
  bag,
  isOpen,
  onClose,
  availableProducts,
  onBagUpdated,
}) => {
  const [selectedProductId, setSelectedProductId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Pix' | 'Cartão' | 'Dinheiro'>('Pix');
  const [isShipping, setIsShipping] = useState(false);
  const [copiedReceipt, setCopiedReceipt] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen || !bag) return null;

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!selectedProductId) return;

    try {
      storage.addItemToBag(bag.id, selectedProductId);
      setSelectedProductId('');
      onBagUpdated();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      }
    }
  };

  const handleRemoveItem = (itemId: string) => {
    if (window.confirm('Deseja retirar este item da sacolinha? Ele voltará a ficar disponível no estoque.')) {
      try {
        storage.removeItemFromBag(bag.id, itemId);
        onBagUpdated();
      } catch (err: unknown) {
        if (err instanceof Error) {
          setErrorMessage(err.message);
        }
      }
    }
  };

  const handleConfirmShipment = () => {
    if (bag.items.length === 0) {
      alert('Adicione pelo menos um item à sacolinha antes de enviar.');
      return;
    }
    try {
      storage.markBagAsShipped(bag.id, paymentMethod);
      setIsShipping(false);
      onBagUpdated();
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      }
    }
  };

  const cleanPhone = bag.customer_phone.replace(/\D/g, '');
  const itemsText = bag.items
    .map((i, index) => `${index + 1}. ${i.product_name} (${i.size}) - ${formatCurrency(i.unit_price)}`)
    .join('\n');
  const receiptMessage = `*Jú Brechó — Resumo da Sacolinha*\nCliente: ${bag.customer_name}\nData de Abertura: ${formatDateBR(
    bag.opened_at
  )}\nPrevisão Fechamento: ${formatDateBR(bag.closing_date)}\n\n*Peças Reservadas:*\n${
    itemsText || 'Nenhuma peça no momento'
  }\n\n*Total Acumulado:* ${formatCurrency(bag.total_amount)}\n\nObrigada pela confiança no consumo consciente! ✨`;

  const handleCopyReceipt = () => {
    navigator.clipboard.writeText(receiptMessage);
    setCopiedReceipt(true);
    setTimeout(() => setCopiedReceipt(false), 2500);
  };

  const whatsappUrl = `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(receiptMessage)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 p-4 backdrop-blur-xs">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-2xl border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 bg-stone-50 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500 text-white shadow-xs">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-stone-900 text-lg">{bag.customer_name}</h2>
                <BagCountdownBadge
                  openedAt={bag.opened_at}
                  closingDate={bag.closing_date}
                  status={bag.status}
                />
              </div>
              <p className="flex items-center gap-1.5 text-xs text-stone-500 mt-0.5">
                <Phone className="h-3 w-3 text-stone-400" />
                {bag.customer_phone}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Informações de Prazo e Contato */}
        <div className="border-b border-stone-100 bg-pink-50 px-6 py-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-4 text-stone-600">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-stone-400" />
                Aberta em: <strong>{formatDateBR(bag.opened_at)}</strong>
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-pink-600" />
                Fecha em: <strong>{formatDateBR(bag.closing_date)}</strong> (30 dias)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyReceipt}
                className="inline-flex items-center gap-1 rounded-lg border border-stone-200 bg-white px-2.5 py-1 text-xs font-medium text-stone-700 hover:bg-stone-50 shadow-xs"
              >
                {copiedReceipt ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Copiado!</span>
                  </>
                ) : (
                  <span>Copiar Resumo</span>
                )}
              </button>
              {cleanPhone && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-emerald-700 shadow-xs"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  <span>Enviar no WhatsApp</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Conteúdo rolável */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {errorMessage && (
            <div className="rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-700 border border-rose-200">
              {errorMessage}
            </div>
          )}

          {/* Adicionar peça à sacolinha */}
          {bag.status !== 'shipped' && (
            <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                Adicionar Peça do Estoque
              </h3>
              <form onSubmit={handleAddItem} className="flex gap-2">
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="flex-1 rounded-xl border border-stone-300 bg-white px-3 py-2 text-xs text-stone-800 focus:border-pink-500 focus:outline-hidden"
                >
                  <option value="">-- Selecione uma peça disponível no estoque --</option>
                  {availableProducts.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.category} • Tam {p.size}) — {formatCurrency(p.sale_price)}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  disabled={!selectedProductId}
                  className="flex items-center gap-1.5 rounded-xl bg-pink-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-pink-600 disabled:opacity-50 shadow-xs"
                >
                  <Plus className="h-4 w-4" />
                  <span>Incluir</span>
                </button>
              </form>
              {availableProducts.length === 0 && (
                <p className="mt-2 text-[11px] text-stone-600">
                  Não há mais produtos disponíveis no estoque para inclusão. Cadastre novos produtos.
                </p>
              )}
            </div>
          )}

          {/* Lista de Itens na Sacolinha */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-stone-800 text-sm">
                Itens na Sacolinha ({bag.items.length})
              </h3>
              <span className="text-base font-extrabold text-pink-800">
                Total: {formatCurrency(bag.total_amount)}
              </span>
            </div>

            {bag.items.length === 0 ? (
              <div className="rounded-xl border border-dashed border-stone-200 p-8 text-center text-xs text-stone-500">
                Esta sacolinha está vazia. Adicione produtos acima para acumular compras.
              </div>
            ) : (
              <div className="divide-y divide-stone-100 rounded-xl border border-stone-200 bg-white overflow-hidden">
                {bag.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3.5 hover:bg-stone-50 transition"
                  >
                    <div>
                      <div className="font-semibold text-stone-800 text-sm">{item.product_name}</div>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-stone-500">
                        <span className="rounded-md bg-stone-100 px-2 py-0.5 font-medium text-stone-700">
                          {item.category}
                        </span>
                        <span className="rounded-md bg-stone-100 px-2 py-0.5 text-stone-700">
                          Tam: {item.size}
                        </span>
                        <span className="flex items-center gap-1 rounded-md bg-pink-50 px-2 py-0.5 font-medium text-pink-800 border border-pink-200/50">
                          <MapPin className="h-3 w-3 text-pink-600" />
                          {item.storage_location_name || 'Estoque'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-bold text-stone-900 text-sm">
                        {formatCurrency(item.unit_price)}
                      </span>
                      {bag.status !== 'shipped' && (
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="rounded-lg p-1.5 text-stone-400 hover:bg-rose-50 hover:text-rose-600 transition"
                          title="Remover peça da sacolinha"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Modal/Seção de Fechamento e Envio */}
          {isShipping && (
            <div className="rounded-xl border-2 border-emerald-500 bg-emerald-50/30 p-4 space-y-3">
              <h4 className="font-bold text-emerald-900 text-sm">
                Confirmar Pagamento e Envio da Sacolinha
              </h4>
              <p className="text-xs text-emerald-800">
                Ao marcar como enviada, todas as peças desta sacolinha serão marcadas como vendidas e uma
                venda de <strong>{formatCurrency(bag.total_amount)}</strong> será registrada no módulo financeiro.
              </p>
              <div>
                <label className="text-xs font-semibold text-stone-700">Forma de Pagamento:</label>
                <div className="mt-1 flex gap-2">
                  {(['Pix', 'Cartão', 'Dinheiro'] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`flex-1 rounded-lg py-2 text-xs font-semibold border ${
                        paymentMethod === method
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsShipping(false)}
                  className="rounded-lg px-3 py-1.5 text-xs font-medium text-stone-600 hover:bg-stone-100"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmShipment}
                  className="rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs"
                >
                  Confirmar Envio
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-stone-100 bg-stone-50 px-6 py-3.5">
          <div className="text-xs text-stone-500">
            {bag.status === 'shipped' ? (
              <span className="font-semibold text-emerald-600">✓ Sacolinha finalizada e enviada</span>
            ) : (
              <span>Prazo de 30 dias para fechamento</span>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100"
            >
              Fechar
            </button>
            {bag.status !== 'shipped' && !isShipping && (
              <button
                onClick={() => setIsShipping(true)}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition shadow-xs"
              >
                <Truck className="h-4 w-4" />
                <span>Finalizar & Marcar como Enviada</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};



