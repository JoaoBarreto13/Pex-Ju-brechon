import type { Customer, StorageLocation, Product, Bag, Sale, Expense, Poll, FinancialSummaryData } from '../types';
import {
  INITIAL_CUSTOMERS,
  INITIAL_STORAGE_LOCATIONS,
  INITIAL_PRODUCTS,
  INITIAL_BAGS,
  INITIAL_SALES,
  INITIAL_EXPENSES,
  INITIAL_POLLS,
} from './seedData';
import { calculateClosingDate, evaluateBagStatus } from './bagCalculator';

const STORAGE_KEYS = {
  CUSTOMERS: 'ju_brecho_customers',
  LOCATIONS: 'ju_brecho_locations',
  PRODUCTS: 'ju_brecho_products',
  BAGS: 'ju_brecho_bags',
  SALES: 'ju_brecho_sales',
  EXPENSES: 'ju_brecho_expenses',
  POLLS: 'ju_brecho_polls',
  GOAL: 'ju_brecho_monthly_goal',
};

class MemoryStorage {
  private map = new Map<string, string>();

  getItem(key: string): string | null {
    return this.map.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.map.set(key, value);
  }

  removeItem(key: string): void {
    this.map.delete(key);
  }

  clear(): void {
    this.map.clear();
  }
}

const memoryFallback = new MemoryStorage();

function getStorageBackend(): Storage | MemoryStorage {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage;
    }
  } catch {
    // Fallback se localStorage estiver bloqueado
  }
  return memoryFallback;
}

class StorageService {
  private listeners: (() => void)[] = [];
  private backend: Storage | MemoryStorage;

  constructor() {
    this.backend = getStorageBackend();
    this.init();
  }

  private init() {
    if (!this.backend.getItem(STORAGE_KEYS.CUSTOMERS)) {
      this.resetToDefaults();
    } else {
      // Reavalia status das sacolinhas com base na data atual
      this.recalculateAllBags();
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  public resetToDefaults() {
    this.backend.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(INITIAL_CUSTOMERS));
    this.backend.setItem(STORAGE_KEYS.LOCATIONS, JSON.stringify(INITIAL_STORAGE_LOCATIONS));
    this.backend.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    this.backend.setItem(STORAGE_KEYS.BAGS, JSON.stringify(INITIAL_BAGS));
    this.backend.setItem(STORAGE_KEYS.SALES, JSON.stringify(INITIAL_SALES));
    this.backend.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(INITIAL_EXPENSES));
    this.backend.setItem(STORAGE_KEYS.POLLS, JSON.stringify(INITIAL_POLLS));
    this.backend.setItem(STORAGE_KEYS.GOAL, '2500');
    this.notify();
  }

  private recalculateAllBags() {
    const bags = this.getBags();
    let hasChanges = false;
    const updated = bags.map((b) => {
      const evaluation = evaluateBagStatus(b.opened_at, b.closing_date, b.status);
      if (b.status !== 'shipped' && b.status !== evaluation.status) {
        hasChanges = true;
        return { ...b, status: evaluation.status };
      }
      return b;
    });
    if (hasChanges) {
      this.backend.setItem(STORAGE_KEYS.BAGS, JSON.stringify(updated));
    }
  }

  // --- CLIENTES ---
  public getCustomers(): Customer[] {
    const raw = this.backend.getItem(STORAGE_KEYS.CUSTOMERS);
    return raw ? JSON.parse(raw) : [];
  }

  public saveCustomer(customer: Omit<Customer, 'id' | 'created_at'>, id?: string): Customer {
    const list = this.getCustomers();
    if (id) {
      const index = list.findIndex((c) => c.id === id);
      if (index !== -1) {
        list[index] = { ...list[index], ...customer };
        this.backend.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(list));
        this.notify();
        return list[index];
      }
    }
    const newCustomer: Customer = {
      ...customer,
      id: `cust-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    list.unshift(newCustomer);
    this.backend.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(list));
    this.notify();
    return newCustomer;
  }

  public deleteCustomer(id: string): boolean {
    const bags = this.getBags().filter((b) => b.customer_id === id && b.status !== 'shipped');
    if (bags.length > 0) {
      throw new Error('Não é possível excluir cliente com sacolinha ativa em andamento.');
    }
    const list = this.getCustomers().filter((c) => c.id !== id);
    this.backend.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(list));
    this.notify();
    return true;
  }

  // --- LOCAIS DE ESTOQUE ---
  public getLocations(): StorageLocation[] {
    const raw = this.backend.getItem(STORAGE_KEYS.LOCATIONS);
    return raw ? JSON.parse(raw) : INITIAL_STORAGE_LOCATIONS;
  }

  public saveLocation(location: Omit<StorageLocation, 'id'>, id?: string): StorageLocation {
    const list = this.getLocations();
    if (id) {
      const index = list.findIndex((l) => l.id === id);
      if (index !== -1) {
        list[index] = { ...list[index], ...location };
        this.backend.setItem(STORAGE_KEYS.LOCATIONS, JSON.stringify(list));
        this.notify();
        return list[index];
      }
    }
    const newLoc: StorageLocation = {
      ...location,
      id: `loc-${Date.now()}`,
    };
    list.push(newLoc);
    this.backend.setItem(STORAGE_KEYS.LOCATIONS, JSON.stringify(list));
    this.notify();
    return newLoc;
  }

  // --- PRODUTOS ---
  public getProducts(): Product[] {
    const raw = this.backend.getItem(STORAGE_KEYS.PRODUCTS);
    return raw ? JSON.parse(raw) : [];
  }

  public saveProduct(product: Omit<Product, 'id' | 'created_at'>, id?: string): Product {
    const list = this.getProducts();
    if (id) {
      const index = list.findIndex((p) => p.id === id);
      if (index !== -1) {
        list[index] = { ...list[index], ...product };
        this.backend.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(list));
        this.notify();
        return list[index];
      }
    }
    const newProduct: Product = {
      ...product,
      id: `prod-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    list.unshift(newProduct);
    this.backend.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(list));
    this.notify();
    return newProduct;
  }

  public deleteProduct(id: string): boolean {
    const product = this.getProducts().find((p) => p.id === id);
    if (product && product.status === 'reserved_bag') {
      throw new Error('Produto está reservado em uma sacolinha. Remova da sacolinha antes de excluir.');
    }
    const list = this.getProducts().filter((p) => p.id !== id);
    this.backend.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(list));
    this.notify();
    return true;
  }

  // --- SACOLINHAS ---
  public getBags(): Bag[] {
    const raw = this.backend.getItem(STORAGE_KEYS.BAGS);
    return raw ? JSON.parse(raw) : [];
  }

  public createBag(customerId: string, notes?: string): Bag {
    const customer = this.getCustomers().find((c) => c.id === customerId);
    if (!customer) throw new Error('Cliente não encontrada.');

    // Verifica se já existe uma sacolinha aberta para esta cliente
    const existingOpenBag = this.getBags().find(
      (b) => b.customer_id === customerId && (b.status === 'open' || b.status === 'closing_soon')
    );
    if (existingOpenBag) {
      throw new Error(`A cliente ${customer.name} já possui uma sacolinha em andamento.`);
    }

    const nowISO = new Date().toISOString();
    const closingISO = calculateClosingDate(nowISO);

    const newBag: Bag = {
      id: `bag-${Date.now()}`,
      customer_id: customer.id,
      customer_name: customer.name,
      customer_phone: customer.phone,
      opened_at: nowISO,
      closing_date: closingISO,
      status: 'open',
      items: [],
      total_amount: 0,
      notes,
      created_at: nowISO,
    };

    const bags = this.getBags();
    bags.unshift(newBag);
    this.backend.setItem(STORAGE_KEYS.BAGS, JSON.stringify(bags));
    this.notify();
    return newBag;
  }

  public addItemToBag(bagId: string, productId: string): Bag {
    const bags = this.getBags();
    const bagIndex = bags.findIndex((b) => b.id === bagId);
    if (bagIndex === -1) throw new Error('Sacolinha não encontrada.');

    const bag = bags[bagIndex];
    if (bag.status === 'shipped') {
      throw new Error('Não é possível adicionar produtos a uma sacolinha já enviada.');
    }

    const products = this.getProducts();
    const prodIndex = products.findIndex((p) => p.id === productId);
    if (prodIndex === -1) throw new Error('Produto não encontrado.');

    const product = products[prodIndex];
    if (product.status !== 'available') {
      throw new Error('Este produto não está disponível (já vendido ou reservado).');
    }

    const locations = this.getLocations();
    const location = locations.find((l) => l.id === product.storage_location_id);

    const newItem = {
      id: `item-${Date.now()}`,
      bag_id: bag.id,
      product_id: product.id,
      product_name: product.name,
      category: product.category,
      size: product.size,
      unit_price: product.sale_price,
      storage_location_id: product.storage_location_id,
      storage_location_name: location ? location.name : 'Não informado',
      added_at: new Date().toISOString(),
    };

    bag.items.push(newItem);
    bag.total_amount = bag.items.reduce((sum, item) => sum + item.unit_price, 0);

    // Atualiza status do produto para 'reserved_bag'
    products[prodIndex].status = 'reserved_bag';

    this.backend.setItem(STORAGE_KEYS.BAGS, JSON.stringify(bags));
    this.backend.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    this.notify();
    return bag;
  }

  public removeItemFromBag(bagId: string, itemId: string): Bag {
    const bags = this.getBags();
    const bagIndex = bags.findIndex((b) => b.id === bagId);
    if (bagIndex === -1) throw new Error('Sacolinha não encontrada.');

    const bag = bags[bagIndex];
    const itemIndex = bag.items.findIndex((i) => i.id === itemId);
    if (itemIndex === -1) throw new Error('Item não encontrado na sacolinha.');

    const item = bag.items[itemIndex];

    // Devolve o produto para 'available'
    const products = this.getProducts();
    const prodIndex = products.findIndex((p) => p.id === item.product_id);
    if (prodIndex !== -1) {
      products[prodIndex].status = 'available';
      this.backend.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    }

    bag.items.splice(itemIndex, 1);
    bag.total_amount = bag.items.reduce((sum, it) => sum + it.unit_price, 0);

    this.backend.setItem(STORAGE_KEYS.BAGS, JSON.stringify(bags));
    this.notify();
    return bag;
  }

  public markBagAsShipped(bagId: string, paymentMethod: 'Pix' | 'Cartão' | 'Dinheiro' = 'Pix'): Bag {
    const bags = this.getBags();
    const bagIndex = bags.findIndex((b) => b.id === bagId);
    if (bagIndex === -1) throw new Error('Sacolinha não encontrada.');

    const bag = bags[bagIndex];
    bag.status = 'shipped';

    // Marca todos os produtos como 'sold'
    const products = this.getProducts();
    bag.items.forEach((item) => {
      const pIndex = products.findIndex((p) => p.id === item.product_id);
      if (pIndex !== -1) {
        products[pIndex].status = 'sold';
      }
    });

    // Registra a venda automaticamente no módulo financeiro
    const sales = this.getSales();
    const newSale: Sale = {
      id: `sale-${Date.now()}`,
      bag_id: bag.id,
      customer_id: bag.customer_id,
      customer_name: bag.customer_name,
      total_amount: bag.total_amount,
      sale_date: new Date().toISOString(),
      payment_method: paymentMethod,
      items_summary: bag.items.map((i) => i.product_name).join(', '),
    };
    sales.unshift(newSale);

    this.backend.setItem(STORAGE_KEYS.BAGS, JSON.stringify(bags));
    this.backend.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    this.backend.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
    this.notify();
    return bag;
  }

  public updateBagNotes(bagId: string, notes: string): Bag {
    const bags = this.getBags();
    const bag = bags.find((b) => b.id === bagId);
    if (!bag) throw new Error('Sacolinha não encontrada.');
    bag.notes = notes;
    this.backend.setItem(STORAGE_KEYS.BAGS, JSON.stringify(bags));
    this.notify();
    return bag;
  }

  // --- VENDAS & FINANCEIRO ---
  public getSales(): Sale[] {
    const raw = this.backend.getItem(STORAGE_KEYS.SALES);
    return raw ? JSON.parse(raw) : [];
  }

  public addDirectSale(sale: Omit<Sale, 'id'>): Sale {
    const sales = this.getSales();
    const newSale: Sale = {
      ...sale,
      id: `sale-${Date.now()}`,
    };
    sales.unshift(newSale);
    this.backend.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
    this.notify();
    return newSale;
  }

  public getExpenses(): Expense[] {
    const raw = this.backend.getItem(STORAGE_KEYS.EXPENSES);
    return raw ? JSON.parse(raw) : [];
  }

  public addExpense(expense: Omit<Expense, 'id'>): Expense {
    const expenses = this.getExpenses();
    const newExpense: Expense = {
      ...expense,
      id: `exp-${Date.now()}`,
    };
    expenses.unshift(newExpense);
    this.backend.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
    this.notify();
    return newExpense;
  }

  public deleteExpense(id: string): boolean {
    const list = this.getExpenses().filter((e) => e.id !== id);
    this.backend.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(list));
    this.notify();
    return true;
  }

  public getMonthlyGoal(): number {
    const raw = this.backend.getItem(STORAGE_KEYS.GOAL);
    return raw ? parseFloat(raw) : 2500;
  }

  public setMonthlyGoal(goal: number) {
    this.backend.setItem(STORAGE_KEYS.GOAL, goal.toString());
    this.notify();
  }

  public getFinancialSummary(): FinancialSummaryData {
    const sales = this.getSales();
    const expenses = this.getExpenses();
    const goal = this.getMonthlyGoal();

    const grossRevenue = sales.reduce((sum, s) => sum + s.total_amount, 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const netResult = grossRevenue - totalExpenses;
    const totalSalesCount = sales.length;
    const averageTicket = totalSalesCount > 0 ? grossRevenue / totalSalesCount : 0;
    const goalProgressPercent = goal > 0 ? Math.min(Math.round((grossRevenue / goal) * 100), 100) : 0;

    return {
      grossRevenue,
      totalExpenses,
      netResult,
      totalSalesCount,
      averageTicket,
      monthlyGoal: goal,
      goalProgressPercent,
    };
  }

  // --- ENQUETES / ENGAJAMENTO ---
  public getPolls(): Poll[] {
    const raw = this.backend.getItem(STORAGE_KEYS.POLLS);
    return raw ? JSON.parse(raw) : [];
  }

  public addPoll(poll: Omit<Poll, 'id'>): Poll {
    const polls = this.getPolls();
    const newPoll: Poll = {
      ...poll,
      id: `poll-${Date.now()}`,
    };
    polls.unshift(newPoll);
    this.backend.setItem(STORAGE_KEYS.POLLS, JSON.stringify(polls));
    this.notify();
    return newPoll;
  }

  public deletePoll(id: string): boolean {
    const list = this.getPolls().filter((p) => p.id !== id);
    this.backend.setItem(STORAGE_KEYS.POLLS, JSON.stringify(list));
    this.notify();
    return true;
  }
}

export const storage = new StorageService();
