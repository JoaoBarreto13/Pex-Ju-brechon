import React from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  DollarSign,
  BarChart3,
  X,
  Clock,
  AlertTriangle,
} from 'lucide-react';

export type ActiveTab = 'dashboard' | 'bags' | 'inventory' | 'customers' | 'finance' | 'polls';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  openBagsCount: number;
  closingSoonCount: number;
  availableProductsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
  openBagsCount,
  closingSoonCount,
  availableProductsCount,
}) => {
  const navItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Painel Geral',
      icon: LayoutDashboard,
    },
    {
      id: 'bags' as ActiveTab,
      label: 'Sacolinhas',
      icon: ShoppingBag,
      badge: openBagsCount > 0 ? openBagsCount : undefined,
      warningBadge: closingSoonCount > 0 ? closingSoonCount : undefined,
    },
    {
      id: 'inventory' as ActiveTab,
      label: 'Estoque & Locais',
      icon: Package,
      badge: availableProductsCount > 0 ? availableProductsCount : undefined,
    },
    {
      id: 'customers' as ActiveTab,
      label: 'Clientes',
      icon: Users,
    },
    {
      id: 'finance' as ActiveTab,
      label: 'Controle Financeiro',
      icon: DollarSign,
    },
    {
      id: 'polls' as ActiveTab,
      label: 'Enquetes & Engajamento',
      icon: BarChart3,
    },
  ];

  const handleSelect = (tab: ActiveTab) => {
    onSelectTab(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Backdrop mobile */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-stone-900/50 backdrop-blur-xs md:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-stone-200 bg-white transition-transform duration-200 ease-in-out dark:border-zinc-800/80 dark:bg-[#140e13]/95 md:static md:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-stone-200 px-6 dark:border-zinc-800 md:hidden">
          <span className="font-bold text-stone-900 dark:text-zinc-100">Menu Principal</span>
          <button
            onClick={onCloseMobile}
            className="rounded-lg p-1.5 text-stone-500 hover:bg-stone-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          <div className="rounded-xl bg-pink-50 p-3.5 border border-pink-100 dark:bg-pink-950/30 dark:border-pink-900/40">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-pink-900 dark:text-pink-300">
              <Clock className="h-3.5 w-3.5 text-pink-700 dark:text-pink-400" />
              <span>Regra de Sacolinhas</span>
            </div>
            <p className="mt-1.5 text-xs text-pink-800/90 leading-relaxed dark:text-pink-200/80">
              Até <strong>30 dias</strong> para juntar compras e consolidar o envio do frete.
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`group flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-pink-500 text-white shadow-sm shadow-pink-200 dark:shadow-pink-950/40'
                    : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900 dark:text-zinc-300 dark:hover:bg-zinc-800/70 dark:hover:text-zinc-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4.5 w-4.5 ${
                      isActive ? 'text-white' : 'text-stone-400 group-hover:text-stone-700 dark:text-zinc-500 dark:group-hover:text-zinc-300'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                <div className="flex shrink-0 items-center gap-1.5">
                  {item.warningBadge !== undefined && (
                    <span
                      title={`${item.warningBadge} sacolinhas próximas do prazo de 30 dias`}
                      className={`inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-bold ${
                        isActive
                          ? 'bg-pink-300 text-pink-950'
                          : 'bg-pink-100 text-pink-800 dark:bg-pink-500/20 dark:text-pink-300'
                      }`}
                    >
                      <AlertTriangle className="h-3 w-3 shrink-0" />
                      <span>{item.warningBadge}</span>
                    </span>
                  )}
                  {item.badge !== undefined && item.warningBadge === undefined && (
                    <span
                      className={`shrink-0 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-semibold ${
                        isActive
                          ? 'bg-pink-600 text-pink-50'
                          : 'bg-stone-100 text-stone-600 dark:bg-zinc-800 dark:text-zinc-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </nav>

        <div className="border-t border-stone-200 p-4 dark:border-zinc-800">
          <div className="text-xs text-stone-600 dark:text-zinc-400 space-y-1">
            <p className="font-semibold text-stone-700 dark:text-zinc-200">Jú Brechó Online</p>
            <p>Moda sustentável e circular</p>
          </div>
        </div>
      </aside>
    </>
  );
};



