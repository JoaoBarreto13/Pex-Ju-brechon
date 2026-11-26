import React, { useState } from 'react';
import type { Customer, Bag } from '../../types';
import { CustomerFormModal } from './CustomerFormModal';
import { storage } from '../../services/storage';
import { Users, Plus, Search, Phone, MessageCircle, Edit2, Trash2, ShoppingBag } from 'lucide-react';
import { formatDateBR } from '../../services/bagCalculator';

interface CustomerListProps {
  customers: Customer[];
  bags: Bag[];
  onRefresh: () => void;
  onOpenBagForCustomer?: (customerId: string) => void;
}

export const CustomerList: React.FC<CustomerListProps> = ({
  customers,
  bags,
  onRefresh,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState<Customer | null>(null);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      (c.instagram && c.instagram.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDelete = (id: string) => {
    if (window.confirm('Deseja excluir esta cliente do cadastro?')) {
      try {
        storage.deleteCustomer(id);
        onRefresh();
      } catch (err: unknown) {
        if (err instanceof Error) {
          alert(err.message);
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="rounded-2xl border border-pink-200/60 bg-white/75 px-5 py-4 backdrop-blur-sm shadow-xs dark:border-pink-500/20 dark:bg-zinc-900/80">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-zinc-100">
              Cadastro de Clientes
            </h1>
            <span className="rounded-full bg-pink-100 px-2.5 py-0.5 text-xs font-semibold text-pink-800 dark:bg-pink-500/15 dark:border dark:border-pink-500/30 dark:text-pink-300">
              {customers.length} cadastradas
            </span>
          </div>
          <p className="mt-1 text-sm font-medium text-zinc-800 dark:text-zinc-300">
            Gerencie contatos, perfis do Instagram e histórico de sacolinhas.
          </p>
        </div>

        <button
          onClick={() => {
            setCustomerToEdit(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-pink-500 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-pink-600 transition"
        >
          <Plus className="h-4 w-4" />
          <span>Nova Cliente</span>
        </button>
      </div>

      {/* Busca */}
      <div className="flex rounded-2xl border border-stone-200 bg-white p-3 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/90">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400 dark:text-zinc-500" />
          <input
            type="text"
            placeholder="Buscar por nome, WhatsApp ou @instagram..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-stone-200 bg-stone-50 pl-9 pr-3 py-2 text-xs text-stone-800 placeholder-stone-400 focus:border-pink-500 focus:bg-white focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:bg-zinc-900"
          />
        </div>
      </div>

      {/* Grid de Clientes */}
      {filteredCustomers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900/90">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 dark:bg-pink-950/40 text-pink-500 mb-3">
            <Users className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-stone-800 dark:text-zinc-100 text-base">Nenhuma cliente encontrada</h3>
          <p className="mt-1 text-xs text-stone-500 dark:text-zinc-400 max-w-sm mx-auto">
            {searchTerm ? 'Tente ajustar sua busca.' : 'Cadastre sua primeira cliente para abrir sacolinhas.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCustomers.map((customer) => {
            const customerBags = bags.filter((b) => b.customer_id === customer.id);
            const activeBag = customerBags.find((b) => b.status === 'open' || b.status === 'closing_soon');
            const cleanPhone = customer.phone.replace(/\D/g, '');

            return (
              <div
                key={customer.id}
                className="flex flex-col justify-between rounded-2xl border border-stone-200 bg-white p-5 shadow-xs transition hover:border-pink-300 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900/90 dark:hover:border-pink-500/30"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-stone-900 dark:text-zinc-100 text-base">{customer.name}</h3>
                      {customer.instagram && (
                        <span className="text-xs font-semibold text-pink-600 dark:text-pink-400">
                          {customer.instagram}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          setCustomerToEdit(customer);
                          setIsModalOpen(true);
                        }}
                        className="rounded-lg p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-700 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                        title="Editar cliente"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(customer.id)}
                        className="rounded-lg p-1 text-stone-400 hover:bg-rose-50 hover:text-rose-600 dark:text-zinc-500 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
                        title="Excluir cliente"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 space-y-1.5 text-xs text-stone-600 dark:text-zinc-300">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-stone-400 dark:text-zinc-500" />
                        {customer.phone}
                      </span>
                      {cleanPhone && (
                        <a
                          href={`https://wa.me/55${cleanPhone}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
                        >
                          <MessageCircle className="h-3.5 w-3.5" />
                          Conversar
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 pt-1 text-stone-500 dark:text-zinc-400">
                      <ShoppingBag className="h-3.5 w-3.5 text-stone-400 dark:text-zinc-500" />
                      <span>{customerBags.length} sacolinha(s) no histórico</span>
                    </div>

                    {activeBag && (
                      <div className="mt-2 rounded-lg bg-pink-50 p-2 text-[11px] font-semibold text-pink-900 border border-pink-200 dark:bg-pink-950/40 dark:text-pink-200 dark:border-pink-900/50">
                        ⚡ Possui sacolinha ativa em andamento!
                      </div>
                    )}

                    {customer.notes && (
                      <p className="mt-2 text-stone-500 dark:text-zinc-400 italic bg-stone-50 dark:bg-zinc-800/70 p-2 rounded-lg text-[11px]">
                        "{customer.notes}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4 border-t border-stone-100 pt-3 text-[11px] text-stone-400 dark:border-zinc-800 dark:text-zinc-500">
                  Cadastrada em {formatDateBR(customer.created_at)}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <CustomerFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setCustomerToEdit(null);
        }}
        onCustomerSaved={onRefresh}
        customerToEdit={customerToEdit}
      />
    </div>
  );
};


