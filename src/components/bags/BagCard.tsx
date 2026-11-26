import React from 'react';
import type { Bag } from '../../types';
import { BagCountdownBadge } from './BagCountdownBadge';
import { formatCurrency, formatDateBR } from '../../services/bagCalculator';
import { Calendar, Package, ExternalLink, MessageCircle } from 'lucide-react';

interface BagCardProps {
  bag: Bag;
  onOpenDetail: (bag: Bag) => void;
}

export const BagCard: React.FC<BagCardProps> = ({ bag, onOpenDetail }) => {
  // Gera mensagem limpa para WhatsApp
  const cleanPhone = bag.customer_phone.replace(/\D/g, '');
  const itemsText = bag.items.map((i) => `• ${i.product_name} (${formatCurrency(i.unit_price)})`).join('%0A');
  const whatsappUrl = `https://wa.me/55${cleanPhone}?text=Ol%C3%A1%2C+${encodeURIComponent(
    bag.customer_name
  )}%21+Aqui+%C3%A9+do+J%C3%BA+Brech%C3%B3.+Sua+sacolinha+est%C3%A1+com+${
    bag.items.length
  }+pe%C3%A7as+acumuladas+%28Total%3A+${encodeURIComponent(
    formatCurrency(bag.total_amount)
  )}%29%3A%0A${itemsText}%0A%0AQualquer+d%C3%BAvida+estou+%C3%A0+disposi%C3%A7%C3%A3o%21`;

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-stone-200 bg-white p-5 shadow-xs transition hover:border-pink-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/90 dark:hover:border-pink-500/30">
      <div>
        {/* Topo: Status Badge alinhada e destacada */}
        <div className="flex items-center justify-between gap-2 border-b border-stone-100 pb-3 mb-3 dark:border-zinc-800">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 dark:text-zinc-500">
            Sacolinha 30 dias
          </span>
          <BagCountdownBadge
            openedAt={bag.opened_at}
            closingDate={bag.closing_date}
            status={bag.status}
          />
        </div>

        {/* Cliente & Contato */}
        <div>
          <h3 className="font-bold text-stone-900 dark:text-zinc-100 text-lg leading-tight truncate" title={bag.customer_name}>
            {bag.customer_name}
          </h3>
          <div className="mt-1.5 flex items-center justify-between gap-2 text-xs">
            <span className="font-medium whitespace-nowrap text-stone-600 dark:text-zinc-400">{bag.customer_phone}</span>
            {cleanPhone && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-700 hover:bg-emerald-100 transition whitespace-nowrap dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-900/50"
                title="Conversar no WhatsApp"
              >
                <MessageCircle className="h-3 w-3 shrink-0" />
                <span>WhatsApp</span>
              </a>
            )}
          </div>
        </div>

        {/* Datas de Abertura e Fechamento */}
        <div className="mt-3.5 grid grid-cols-2 gap-2 rounded-xl bg-stone-50 p-3 text-xs dark:bg-zinc-800/60">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 dark:text-zinc-400">Abertura</span>
            <div className="mt-1 flex items-center gap-1.5 font-semibold text-stone-800 dark:text-zinc-200 whitespace-nowrap">
              <Calendar className="h-3.5 w-3.5 shrink-0 text-stone-400 dark:text-zinc-500" />
              <span>{formatDateBR(bag.opened_at)}</span>
            </div>
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 dark:text-zinc-400">Fechamento</span>
            <div className="mt-1 flex items-center gap-1.5 font-semibold text-stone-800 dark:text-zinc-200 whitespace-nowrap">
              <Calendar className="h-3.5 w-3.5 shrink-0 text-pink-500 dark:text-pink-400" />
              <span>{formatDateBR(bag.closing_date)}</span>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
            <span>Peças na Sacolinha ({bag.items.length})</span>
            <span className="text-pink-800 dark:text-pink-300 font-bold">{formatCurrency(bag.total_amount)}</span>
          </div>

          {bag.items.length === 0 ? (
            <p className="rounded-lg border border-dashed border-stone-200 dark:border-zinc-800 p-3 text-center text-xs text-stone-600 dark:text-zinc-400">
              Nenhuma peça adicionada ainda
            </p>
          ) : (
            <ul className="space-y-1.5 max-h-36 overflow-y-auto pr-1 text-xs">
              {bag.items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between rounded-lg bg-stone-50 px-2.5 py-1.5 border border-stone-100 dark:bg-zinc-800/60 dark:border-zinc-800"
                >
                  <div className="truncate mr-2">
                    <span className="font-medium text-stone-800 dark:text-zinc-200">{item.product_name}</span>
                    <span className="ml-1.5 text-[11px] text-stone-600 dark:text-zinc-400">
                      ({item.size} • {item.storage_location_name || 'Estoque'})
                    </span>
                  </div>
                  <span className="font-semibold text-stone-700 dark:text-zinc-300 shrink-0">
                    {formatCurrency(item.unit_price)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {bag.notes && (
          <p className="mt-3 rounded-lg bg-pink-50 p-2 text-xs text-pink-900 italic dark:bg-pink-950/30 dark:text-pink-200 dark:border dark:border-pink-900/40">
            "{bag.notes}"
          </p>
        )}
      </div>

      <div className="mt-5 border-t border-stone-100 pt-3 dark:border-zinc-800">
        <button
          onClick={() => onOpenDetail(bag)}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-pink-500 py-2.5 text-sm font-semibold text-white transition hover:bg-pink-600 shadow-xs shadow-pink-200 dark:shadow-pink-950/40"
        >
          <Package className="h-4 w-4" />
          <span>Gerenciar Sacolinha</span>
          <ExternalLink className="h-3.5 w-3.5 ml-1 opacity-70" />
        </button>
      </div>
    </div>
  );
};



