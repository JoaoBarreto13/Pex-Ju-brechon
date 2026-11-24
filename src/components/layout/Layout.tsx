import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import type { ActiveTab } from './Sidebar';

interface LayoutProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  openBagsCount: number;
  closingSoonCount: number;
  availableProductsCount: number;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({
  activeTab,
  onSelectTab,
  openBagsCount,
  closingSoonCount,
  availableProductsCount,
  children,
}) => {
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar onToggleMobileMenu={() => setIsOpenMobile(true)} />
      <div className="flex flex-1">
        <Sidebar
          activeTab={activeTab}
          onSelectTab={onSelectTab}
          isOpenMobile={isOpenMobile}
          onCloseMobile={() => setIsOpenMobile(false)}
          openBagsCount={openBagsCount}
          closingSoonCount={closingSoonCount}
          availableProductsCount={availableProductsCount}
        />
        <main className="flex-1 overflow-x-hidden p-4 md:p-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
};
