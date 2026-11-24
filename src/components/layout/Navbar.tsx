import React from 'react';
import { ShoppingBag, RefreshCw, Menu } from 'lucide-react';
import { storage } from '../../services/storage';

interface NavbarProps {
  onToggleMobileMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileMenu }) => {
  const handleResetData = () => {
    if (window.confirm('Deseja restaurar os dados de demonstração iniciais do Jú Brechó? Isso recarregará clientes, peças e sacolinhas de teste.')) {
      storage.resetToDefaults();
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-stone-200 bg-white px-4 backdrop-blur md:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="rounded-lg p-2 text-stone-600 hover:bg-stone-100 md:hidden"
          aria-label="Abrir menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500 text-white shadow-sm shadow-pink-200">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-stone-900 tracking-tight text-lg">Jú Brechó</span>
              <span className="rounded-full bg-pink-100 px-2 py-0.5 text-xs font-medium text-pink-800">
                Gestão Online
              </span>
            </div>
            <p className="text-xs text-stone-500 hidden sm:block">
              Controle de Sacolinhas & Estoque Residencial
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleResetData}
          title="Restaurar dados de teste"
          className="flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-600 transition hover:bg-stone-50 hover:text-stone-900"
        >
          <RefreshCw className="h-3.5 w-3.5 text-stone-400" />
          <span className="hidden sm:inline">Restaurar Dados Demo</span>
        </button>
      </div>
    </header>
  );
};


