import type { BagStatus } from '../types';

/**
 * Adiciona exatamente 30 dias à data de abertura para definir a data prevista de fechamento.
 */
export function calculateClosingDate(openedAtISO: string): string {
  const date = new Date(openedAtISO);
  date.setDate(date.getDate() + 30);
  return date.toISOString();
}

/**
 * Calcula os dias restantes até a data prevista de fechamento.
 */
export function getDaysRemaining(closingDateISO: string): number {
  const now = new Date();
  // Zera horas para contagem precisa de dias civis
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const close = new Date(closingDateISO);
  const target = new Date(close.getFullYear(), close.getMonth(), close.getDate());

  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export interface BagStatusInfo {
  status: BagStatus;
  daysRemaining: number;
  label: string;
  badgeClass: string;
  dotColor: string;
  urgencyLevel: 'normal' | 'warning' | 'critical' | 'completed';
}

/**
 * Avalia o status e calcula indicadores da sacolinha.
 */
export function evaluateBagStatus(_openedAt: string, closingDate: string, manualStatus?: BagStatus): BagStatusInfo {
  if (manualStatus === 'shipped') {
    return {
      status: 'shipped',
      daysRemaining: 0,
      label: 'Enviada à cliente',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60',
      dotColor: 'bg-emerald-500',
      urgencyLevel: 'completed',
    };
  }

  const daysRemaining = getDaysRemaining(closingDate);

  if (daysRemaining < 0 || manualStatus === 'closed') {
    return {
      status: 'closed',
      daysRemaining: Math.abs(daysRemaining),
      label: daysRemaining < 0 ? `Vencida (${Math.abs(daysRemaining)}d atrás)` : 'Fechada',
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60',
      dotColor: 'bg-rose-500',
      urgencyLevel: 'critical',
    };
  }

  if (daysRemaining === 0) {
    return {
      status: 'closing_soon',
      daysRemaining: 0,
      label: 'Fecha hoje!',
      badgeClass: 'bg-pink-100 text-pink-800 border-pink-300 dark:bg-pink-950/60 dark:text-pink-200 dark:border-pink-800 font-semibold animate-pulse',
      dotColor: 'bg-pink-600',
      urgencyLevel: 'warning',
    };
  }

  if (daysRemaining <= 7) {
    return {
      status: 'closing_soon',
      daysRemaining,
      label: `Fecha em ${daysRemaining} ${daysRemaining === 1 ? 'dia' : 'dias'}`,
      badgeClass: 'bg-pink-50 text-pink-800 border-pink-200 dark:bg-pink-950/40 dark:text-pink-300 dark:border-pink-800/60',
      dotColor: 'bg-pink-500',
      urgencyLevel: 'warning',
    };
  }

  return {
    status: 'open',
    daysRemaining,
    label: `${daysRemaining} dias restantes`,
    badgeClass: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800/60',
    dotColor: 'bg-sky-500',
    urgencyLevel: 'normal',
  };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatDateBR(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return isoString;
  }
}

