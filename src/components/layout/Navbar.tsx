import React from 'react';
import { RefreshCw, Menu, Sun, Moon } from 'lucide-react';
import { storage } from '../../services/storage';
import { useTheme } from '../../context/ThemeContext';

interface NavbarProps {
  onToggleMobileMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileMenu }) => {
  const { toggleTheme, isDark } = useTheme();

  const handleResetData = () => {
    if (window.confirm('Deseja restaurar os dados de demonstração iniciais do Jú Brechó? Isso recarregará clientes, peças e sacolinhas de teste.')) {
      storage.resetToDefaults();
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-stone-200 bg-white/95 px-4 backdrop-blur dark:border-zinc-800/80 dark:bg-[#140e13]/95 md:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="rounded-lg p-2 text-stone-600 hover:bg-stone-100 dark:text-zinc-400 dark:hover:bg-zinc-800 md:hidden"
          aria-label="Abrir menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <img
            src="/logo-ju-brecho.png"
            alt="Logo Jú Brechó"
            className="h-9 w-9 rounded-full object-cover border border-pink-200 dark:border-pink-500/30 shadow-xs shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-stone-900 tracking-tight text-lg dark:text-zinc-100">Jú Brechó</span>
              <span className="rounded-full bg-pink-100 px-2 py-0.5 text-xs font-medium text-pink-800 dark:bg-pink-500/15 dark:border dark:border-pink-500/30 dark:text-pink-300">
                Gestão Online
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-zinc-400 hidden sm:block">
              Controle de Sacolinhas & Estoque Residencial
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          onClick={toggleTheme}
          title={isDark ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-600 transition hover:bg-stone-50 hover:text-stone-900 dark:border-zinc-800 dark:bg-zinc-900/90 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 shadow-xs"
          aria-label={isDark ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
        >
          {isDark ? (
            <Sun className="h-4 w-4 text-pink-400 transition-transform hover:rotate-45" />
          ) : (
            <Moon className="h-4 w-4 text-stone-600 transition-transform hover:-rotate-12" />
          )}
        </button>

        <button
          onClick={handleResetData}
          title="Restaurar dados de teste"
          className="flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-600 transition hover:bg-stone-50 hover:text-stone-900 dark:border-zinc-800 dark:bg-zinc-900/90 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 shadow-xs"
        >
          <RefreshCw className="h-3.5 w-3.5 text-stone-400 dark:text-zinc-500" />
          <span className="hidden sm:inline">Restaurar Dados Demo</span>
        </button>
      </div>
    </header>
  );
};


