'use client';

import { useState } from 'react';
import { Product } from '@/types';
import { formatCurrency, cn } from '@/lib/utils';
import { recordQuickTapSale, recordNoSalesToday } from '@/app/(dashboard)/sales/actions';
import { useToast } from '@/components/ui/toast';

import { AddonSelectorModal } from './addon-selector-modal';
import { ProductAddon } from '@/types';

interface CartItem {
  cartId: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  unitCost: number;
  selectedAddons?: ProductAddon[];
}

export function QuickTapMode({ products }: { products: Product[] }) {
  const { showToast } = useToast();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'gcash_maya'>('cash');
  const [customerNotes, setCustomerNotes] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0] || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isNoSalesLoading, setIsNoSalesLoading] = useState(false);
  const [activeProductForAddons, setActiveProductForAddons] = useState<Product | null>(null);

  // Extract unique categories
  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))].sort();

  // Filter products
  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  const handleProductTap = (product: Product) => {
    // Open modal to choose add-ons
    setActiveProductForAddons(product);
  };

  const handleConfirmAddToCart = (product: Product, selectedAddons: ProductAddon[]) => {
    setActiveProductForAddons(null);

    const extraPrice = selectedAddons.reduce((sum, a) => sum + Number(a.price), 0);
    const finalUnitPrice = product.selling_price + extraPrice;

    const addonText = selectedAddons.map(a => a.name).join(', ');
    const displayName = addonText ? `${product.name} (+ ${addonText})` : product.name;
    const cartId = `${product.id}-${selectedAddons.map(a => a.id).sort().join('-')}`;

    setCart(prev => {
      const existing = prev.find(item => item.cartId === cartId);
      if (existing) {
        return prev.map(item => 
          item.cartId === cartId 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, {
        cartId,
        productId: product.id,
        productName: displayName,
        quantity: 1,
        unitPrice: finalUnitPrice,
        unitCost: product.unit_cost,
        selectedAddons,
      }];
    });
  };

  const updateQuantity = (cartId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.cartId === cartId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const removeItem = (cartId: string) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

  const handleCompleteSale = async () => {
    if (cart.length === 0) return;
    
    setIsSubmitting(true);
    
    const payload = {
      items: cart.map(i => ({
        productId: i.productId,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        unitCost: i.unitCost,
        addonIds: i.selectedAddons?.map(a => a.id),
      })),
      paymentMethod,
      customerNotes: customerNotes.trim() || undefined,
      createdAt: selectedDate ? new Date(selectedDate).toISOString() : undefined,
    };

    const result = await recordQuickTapSale(payload);
    
    if (result.success) {
      showToast('Sale recorded successfully!', 'success');
      if (result.warnings && result.warnings.length > 0) {
        result.warnings.forEach(warning => showToast(warning, 'warning'));
      }
      setCart([]); // clear cart
      setCustomerNotes('');
    } else {
      showToast(result.error || 'Failed to record sale', 'error');
    }
    
    setIsSubmitting(false);
  };

  const handleNoSalesToday = async () => {
    if (!confirm(`Are you sure you want to record 0 sales for ${selectedDate}?`)) return;
    setIsNoSalesLoading(true);
    const result = await recordNoSalesToday(new Date(selectedDate).toISOString());
    if (result.success) {
      showToast(`Recorded no sales for ${selectedDate}`, 'success');
    } else {
      showToast(result.error || 'Failed to record', 'error');
    }
    setIsNoSalesLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left: Product Grid */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        
        {/* Date Controls & Category Chips */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface p-4 rounded-xl border border-outline-variant shadow-soft">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant/50 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
               <span className="material-symbols-outlined text-on-surface-variant text-[18px]">calendar_today</span>
               <input
                 type="date"
                 value={selectedDate}
                 onChange={(e) => setSelectedDate(e.target.value)}
                 className="bg-transparent border-none outline-none text-body-md text-on-surface w-36"
               />
            </div>
            <button
              onClick={handleNoSalesToday}
              disabled={isNoSalesLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 text-label-md rounded-lg border border-error text-error hover:bg-error-container/20 transition-colors disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[16px]">block</span>
              {isNoSalesLoading ? 'Saving...' : 'No Sales Today'}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-4 py-1.5 rounded-full text-label-md font-label-md transition-colors",
                activeCategory === cat 
                  ? "bg-primary-container text-on-primary"
                  : "bg-surface-container-high text-on-surface-variant border border-outline-variant hover:bg-surface-variant"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
        </div>

        {/* Product Tiles */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {filteredProducts.map(product => {
            return (
              <div
                key={product.id}
                onClick={() => handleProductTap(product)}
                className="bg-surface rounded-xl border border-outline-variant p-4 shadow-soft h-48 flex flex-col justify-between group transition-transform select-none cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
              >
                {/* Category Badge */}
                <div className="self-start bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded text-xs font-semibold">
                  {product.category}
                </div>

                {/* Name */}
                <div className="text-headline-md font-headline-md mt-auto mb-2 line-clamp-2 transition-colors group-hover:text-secondary">
                  {product.name}
                </div>

                {/* Bottom Row */}
                <div className="flex items-center justify-between">
                  <div className="text-number-data font-number-data text-on-surface">
                    {formatCurrency(product.selling_price)}
                  </div>
                  <button 
                    className="bg-surface-container-high group-hover:bg-primary-container group-hover:text-on-primary w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                    aria-label="Add to cart"
                  >
                    <span className="material-symbols-outlined text-[20px]">add</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right: Sticky Cart */}
      <div className="lg:col-span-4">
        <div className="lg:sticky lg:top-[96px] bg-surface rounded-xl border border-outline-variant shadow-soft flex flex-col h-[calc(100vh-[180px])] min-h-[500px]">
          {/* Cart Header */}
          <div className="p-5 border-b border-outline-variant">
            <h2 className="text-headline-md font-headline-md">Current Sale</h2>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-5">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                <span className="material-symbols-outlined text-4xl mb-3">local_cafe</span>
                <p className="text-body-md text-on-surface-variant">Tap a product to start a sale</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map(item => (
                  <div key={item.cartId} className="flex flex-col gap-2 pb-4 border-b border-outline-variant/50 last:border-0">
                    <div className="flex items-start justify-between">
                      <div className="font-semibold text-on-surface pr-2">{item.productName}</div>
                      <div className="font-number-data text-on-surface whitespace-nowrap">
                        {formatCurrency(item.quantity * item.unitPrice)}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 bg-surface-container-lowest border border-outline-variant rounded-lg p-1">
                        <button 
                          onClick={() => updateQuantity(item.cartId, -1)}
                          className="w-7 h-7 flex items-center justify-center text-on-surface-variant hover:bg-surface-container rounded-md"
                        >
                          <span className="material-symbols-outlined text-[18px]">remove</span>
                        </button>
                        <span className="font-number-data text-sm w-4 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.cartId, 1)}
                          className="w-7 h-7 flex items-center justify-center text-on-surface-variant hover:bg-surface-container rounded-md"
                        >
                          <span className="material-symbols-outlined text-[18px]">add</span>
                        </button>
                      </div>
                      <button 
                        onClick={() => removeItem(item.cartId)}
                        className="text-on-surface-variant/70 hover:text-error transition-colors p-1"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Checkout Footer */}
          <div className="p-5 border-t border-outline-variant bg-surface-container-lowest rounded-b-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-label-lg text-on-surface-variant">Total</span>
              <span className="text-headline-lg font-headline-lg text-on-surface">
                {formatCurrency(cartTotal)}
              </span>
            </div>

            {/* Customer Order Notes */}
            <div className="mb-3">
              <input
                type="text"
                placeholder="Order notes (e.g. less ice, oat milk)..."
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                className="w-full h-9 px-3 bg-surface border border-outline-variant/60 focus:border-primary rounded-lg text-xs outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                onClick={() => setPaymentMethod('cash')}
                className={cn(
                  "py-2 px-2 flex items-center justify-center gap-2 rounded-lg text-label-md transition-colors border",
                  paymentMethod === 'cash'
                    ? "bg-primary-container text-on-primary border-primary-container"
                    : "bg-surface text-on-surface border-outline-variant hover:bg-surface-container"
                )}
              >
                <span>Cash</span>
                <span className="text-[16px]">💵</span>
              </button>
              <button
                onClick={() => setPaymentMethod('gcash_maya')}
                className={cn(
                  "py-2 px-2 flex items-center justify-center gap-2 rounded-lg text-label-md transition-colors border",
                  paymentMethod === 'gcash_maya'
                    ? "bg-primary-container text-on-primary border-primary-container"
                    : "bg-surface text-on-surface border-outline-variant hover:bg-surface-container"
                )}
              >
                <span>GCash/Maya</span>
                <span className="text-[16px]">📱</span>
              </button>
            </div>

            <button
              onClick={handleCompleteSale}
              disabled={cart.length === 0 || isSubmitting}
              className="w-full h-14 bg-secondary hover:bg-[#C58B38] text-white rounded-lg font-label-md flex items-center justify-center gap-2 transition-transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="material-symbols-outlined animate-spin">refresh</span>
              ) : (
                <>
                  Complete & Log Sale
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {activeProductForAddons && (
        <AddonSelectorModal
          product={activeProductForAddons}
          onClose={() => setActiveProductForAddons(null)}
          onConfirm={handleConfirmAddToCart}
        />
      )}
    </div>
  );
}
