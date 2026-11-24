export interface Customer {
  id: string;
  name: string;
  phone: string;
  instagram?: string;
  notes?: string;
  created_at: string;
}

export interface StorageLocation {
  id: string;
  name: string;
  description: string;
  type: 'box' | 'caixa_roupas' | 'caixa_sapatos' | 'arara' | 'outro';
}

export type ProductStatus = 'available' | 'reserved_bag' | 'sold';

export interface Product {
  id: string;
  name: string;
  category: 'Vestido' | 'Blusa' | 'Calça' | 'Saia' | 'Sapato' | 'Bolsa' | 'Acessório' | 'Casaco';
  size: string;
  purchase_price?: number;
  sale_price: number;
  status: ProductStatus;
  storage_location_id: string;
  notes?: string;
  created_at: string;
}

export type BagStatus = 'open' | 'closing_soon' | 'closed' | 'shipped';

export interface BagItem {
  id: string;
  bag_id: string;
  product_id: string;
  product_name: string;
  category: string;
  size: string;
  unit_price: number;
  storage_location_id: string;
  storage_location_name?: string;
  added_at: string;
}

export interface Bag {
  id: string;
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  opened_at: string;
  closing_date: string;
  status: BagStatus;
  items: BagItem[];
  total_amount: number;
  notes?: string;
  created_at: string;
}

export interface Sale {
  id: string;
  bag_id?: string;
  customer_id?: string;
  customer_name: string;
  total_amount: number;
  sale_date: string;
  payment_method: 'Pix' | 'Cartão' | 'Dinheiro' | 'Transferência';
  items_summary?: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  expense_date: string;
  category: 'Embalagens' | 'Frete/Envios' | 'Higienização' | 'Marketing' | 'Aquisição de Lotes' | 'Outros';
}

export interface Poll {
  id: string;
  title: string;
  views: number;
  votes: number;
  poll_date: string;
  notes?: string;
}

export interface FinancialSummaryData {
  grossRevenue: number;
  totalExpenses: number;
  netResult: number;
  totalSalesCount: number;
  averageTicket: number;
  monthlyGoal: number;
  goalProgressPercent: number;
}
