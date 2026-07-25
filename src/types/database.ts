export type EntryMode = 'quick_tap' | 'batch' | 'reconciliation';
export type PaymentMethod = 'cash' | 'gcash_maya';
export type ExpenseFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly';
export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';
export type ProductType = 'menu_item' | 'raw_material';

export interface Product {
  id: string;
  user_id: string;
  name: string;
  category: string;
  selling_price: number;
  unit_cost: number;
  current_stock: number;
  low_stock_threshold: number;
  target_stock: number;
  is_active: boolean;
  type: ProductType;
  package_price?: number | null;
  items_per_package?: number;
  package_unit_name?: string;
  created_at: string;
  updated_at: string;
}

export interface Sale {
  id: string;
  user_id: string;
  total_revenue: number;
  total_cogs: number;
  net_profit: number;
  starting_float?: number | null;
  ending_cash?: number | null;
  cash_discrepancy?: number | null;
  entry_mode: EntryMode;
  payment_method: PaymentMethod;
  created_at: string;
}

export interface SaleItem {
  id: string;
  sale_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  unit_cost: number;
  created_at: string;
}

export interface Expense {
  id: string;
  user_id: string;
  name: string;
  amount: number;
  frequency: ExpenseFrequency;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface RestockItem {
  productId: string;
  productName: string;
  currentStock: number;
  targetStock: number;
  recommendedQty: number;
  unitCost: number;
  estimatedCost: number;
  itemsPerPackage?: number;
  packageUnitName?: string;
}

export interface DailySummary {
  totalRevenue: number;
  totalCogs: number;
  netProfit: number;
  totalItemsSold: number;
  totalCashSales: number;
  transactionCount: number;
}

export interface Database {
  public: {
    Tables: {
      products: {
        Row: Product;
        Insert: Omit<Product, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Product, 'id' | 'user_id'>>;
      };
      sales: {
        Row: Sale;
        Insert: Omit<Sale, 'id' | 'created_at'>;
        Update: Partial<Omit<Sale, 'id' | 'user_id'>>;
      };
      sales_items: {
        Row: SaleItem;
        Insert: Omit<SaleItem, 'id' | 'created_at'>;
        Update: Partial<Omit<SaleItem, 'id'>>;
      };
      expenses: {
        Row: Expense;
        Insert: Omit<Expense, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Expense, 'id' | 'user_id'>>;
      };
    };
  };
}
