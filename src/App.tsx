import { useState, useEffect, useCallback } from 'react';
import { Layout } from './components/layout/Layout';
import type { ActiveTab } from './components/layout/Sidebar';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { BagList } from './components/bags/BagList';
import { ProductList } from './components/inventory/ProductList';
import { CustomerList } from './components/customers/CustomerList';
import { FinancialSummary } from './components/finance/FinancialSummary';
import { PollList } from './components/polls/PollList';
import { BagFormModal } from './components/bags/BagFormModal';
import { BagDetailModal } from './components/bags/BagDetailModal';
import { ProductFormModal } from './components/inventory/ProductFormModal';
import { storage } from './services/storage';
import { evaluateBagStatus } from './services/bagCalculator';
import type { Customer, StorageLocation, Product, Bag, Sale, Expense, Poll, FinancialSummaryData } from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // Dados centrais
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [locations, setLocations] = useState<StorageLocation[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [bags, setBags] = useState<Bag[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [financialSummary, setFinancialSummary] = useState<FinancialSummaryData>({
    grossRevenue: 0,
    totalExpenses: 0,
    netResult: 0,
    totalSalesCount: 0,
    averageTicket: 0,
    monthlyGoal: 2500,
    goalProgressPercent: 0,
  });

  // Modais acionados pelo Dashboard
  const [isCreateBagOpen, setIsCreateBagOpen] = useState(false);
  const [isCreateProductOpen, setIsCreateProductOpen] = useState(false);
  const [selectedBagForDetail, setSelectedBagForDetail] = useState<Bag | null>(null);

  const loadData = useCallback(() => {
    setCustomers(storage.getCustomers());
    setLocations(storage.getLocations());
    setProducts(storage.getProducts());
    setBags(storage.getBags());
    setSales(storage.getSales());
    setExpenses(storage.getExpenses());
    setPolls(storage.getPolls());
    setFinancialSummary(storage.getFinancialSummary());
  }, []);

  useEffect(() => {
    loadData();
    const unsubscribe = storage.subscribe(() => {
      loadData();
    });
    return () => unsubscribe();
  }, [loadData]);

  // Contadores para o menu lateral
  const activeBags = bags.filter((b) => b.status !== 'shipped');
  const openBagsCount = activeBags.filter(
    (b) => evaluateBagStatus(b.opened_at, b.closing_date, b.status).status === 'open'
  ).length;
  const closingSoonCount = activeBags.filter((b) => {
    const s = evaluateBagStatus(b.opened_at, b.closing_date, b.status).status;
    return s === 'closing_soon' || s === 'closed';
  }).length;
  const availableProductsCount = products.filter((p) => p.status === 'available').length;

  return (
    <Layout
      activeTab={activeTab}
      onSelectTab={setActiveTab}
      openBagsCount={openBagsCount}
      closingSoonCount={closingSoonCount}
      availableProductsCount={availableProductsCount}
    >
      {activeTab === 'dashboard' && (
        <DashboardOverview
          bags={bags}
          products={products}
          financialSummary={financialSummary}
          onNavigateTab={setActiveTab}
          onOpenBagDetail={(bag) => setSelectedBagForDetail(bag)}
          onOpenCreateBag={() => setIsCreateBagOpen(true)}
          onOpenCreateProduct={() => setIsCreateProductOpen(true)}
        />
      )}

      {activeTab === 'bags' && (
        <BagList
          bags={bags}
          customers={customers}
          products={products}
          onRefresh={loadData}
        />
      )}

      {activeTab === 'inventory' && (
        <ProductList
          products={products}
          locations={locations}
          onRefresh={loadData}
        />
      )}

      {activeTab === 'customers' && (
        <CustomerList
          customers={customers}
          bags={bags}
          onRefresh={loadData}
        />
      )}

      {activeTab === 'finance' && (
        <FinancialSummary
          sales={sales}
          expenses={expenses}
          summary={financialSummary}
          onRefresh={loadData}
        />
      )}

      {activeTab === 'polls' && (
        <PollList
          polls={polls}
          onRefresh={loadData}
        />
      )}

      {/* Modais Globais */}
      <BagFormModal
        isOpen={isCreateBagOpen}
        onClose={() => setIsCreateBagOpen(false)}
        customers={customers}
        onBagCreated={loadData}
      />

      <ProductFormModal
        isOpen={isCreateProductOpen}
        onClose={() => setIsCreateProductOpen(false)}
        locations={locations}
        onProductSaved={loadData}
      />

      <BagDetailModal
        bag={selectedBagForDetail}
        isOpen={!!selectedBagForDetail}
        onClose={() => setSelectedBagForDetail(null)}
        availableProducts={products.filter((p) => p.status === 'available')}
        onBagUpdated={() => {
          loadData();
          if (selectedBagForDetail) {
            const updated = storage.getBags().find((b) => b.id === selectedBagForDetail.id);
            setSelectedBagForDetail(updated || null);
          }
        }}
      />
    </Layout>
  );
}

export default App;
