import { describe, it, expect } from 'vitest';
import {
  calculateClosingDate,
  getDaysRemaining,
  evaluateBagStatus,
  formatCurrency,
  formatDateBR,
} from './bagCalculator';

describe('Regras de Negócio do Jú Brechó — Controle de Sacolinhas e Prazos', () => {
  it('deve calcular a data de fechamento adicionando exatamente 30 dias à data de abertura', () => {
    const openedAt = '2026-11-01T10:00:00.000Z';
    const closingDate = calculateClosingDate(openedAt);
    const openedDate = new Date(openedAt);
    const resultDate = new Date(closingDate);

    const diffDays = Math.round((resultDate.getTime() - openedDate.getTime()) / (1000 * 60 * 60 * 24));
    expect(diffDays).toBe(30);
  });

  it('deve calcular corretamente os dias restantes', () => {
    const today = new Date();
    const in10Days = new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString();
    const remaining = getDaysRemaining(in10Days);
    expect(remaining).toBeGreaterThanOrEqual(9);
    expect(remaining).toBeLessThanOrEqual(11);
  });

  it('deve identificar sacolinha com status "shipped" como concluída', () => {
    const openedAt = new Date().toISOString();
    const closingDate = calculateClosingDate(openedAt);
    const evalStatus = evaluateBagStatus(openedAt, closingDate, 'shipped');

    expect(evalStatus.status).toBe('shipped');
    expect(evalStatus.urgencyLevel).toBe('completed');
    expect(evalStatus.label).toContain('Enviada');
  });

  it('deve classificar como "open" quando restar mais de 7 dias', () => {
    const openedAt = new Date().toISOString();
    const in20Days = new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString();
    const evalStatus = evaluateBagStatus(openedAt, in20Days);

    expect(evalStatus.status).toBe('open');
    expect(evalStatus.urgencyLevel).toBe('normal');
  });

  it('deve classificar como "closing_soon" quando restar entre 1 e 7 dias', () => {
    const openedAt = new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString();
    const in5Days = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString();
    const evalStatus = evaluateBagStatus(openedAt, in5Days);

    expect(evalStatus.status).toBe('closing_soon');
    expect(evalStatus.urgencyLevel).toBe('warning');
    expect(evalStatus.label).toContain('Fecha em');
  });

  it('deve alertar "Fecha hoje!" quando restar 0 dias', () => {
    const openedAt = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const todayClose = new Date().toISOString();
    const evalStatus = evaluateBagStatus(openedAt, todayClose);

    expect(evalStatus.status).toBe('closing_soon');
    expect(evalStatus.urgencyLevel).toBe('warning');
    expect(evalStatus.label).toBe('Fecha hoje!');
  });

  it('deve classificar como "closed" (vencida) quando o prazo de 30 dias tiver expirado', () => {
    const openedAt = new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString();
    const expiredClose = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString();
    const evalStatus = evaluateBagStatus(openedAt, expiredClose);

    expect(evalStatus.status).toBe('closed');
    expect(evalStatus.urgencyLevel).toBe('critical');
    expect(evalStatus.label).toContain('Vencida');
  });

  it('deve formatar moedas em BRL adequadamente', () => {
    const formatted = formatCurrency(65);
    expect(formatted).toContain('65,00');
  });

  it('deve formatar datas para o padrão brasileiro DD/MM/AAAA', () => {
    const formatted = formatDateBR('2026-11-22T10:00:00.000Z');
    expect(formatted).toMatch(/\d{2}\/\d{2}\/2026/);
  });
});
