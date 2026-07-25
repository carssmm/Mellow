'use client';

import { useState } from 'react';
import { Product } from '@/types';
import { formatCurrency, cn } from '@/lib/utils';
import { recordQuickTapSale } from '@/app/(dashboard)/sales/actions';
import { useToast } from '@/components/ui/toast';

interface CartItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  unitCost: number;
}

export function QuickTapMode({ products }: { products: Product[] }) {
  const { showToast } = useToast();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'gcash_maya'>('cash');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Extract unique categories
  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))].sort();

  // Filter products
  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  // Cart operations
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        return prev.map(item => 
          item.productId === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, {
        productId: product.id,
        productName: product.name,
        quantity: 1,
        unitPrice: product.selling_price,
        unitCost: product.unit_cost,
      }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.productId === productId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const removeItem = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
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
        unitCost: i.unitCost
      })),
      paymentMethod
    };

    const result = await recordQuickTapSale(payload);
    
    if (result.success) {
      showToast('Sale recorded successfully!', 'success');
      if (result.warnings && result.warnings.length > 0) {
        result.warnings.forEach(warning => showToast(warning, 'warning'));
      }
      setCart([]); // clear cart
    } else {
      showToast(result.error || 'Failed to record sale', 'error');
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left: Product Grid */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        {/* Category Chips */}
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

        {/* Product Tiles */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {filteredProducts.map(product => {
            return (
              <div
                key={product.id}
                onClick={() => addToCart(product)}
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
                  <div key={item.productId} className="flex flex-col gap-2 pb-4 border-b border-outline-variant/50 last:border-0">
                    <div className="flex items-start justify-between">
                      <div className="font-semibold text-on-surface pr-2">{item.productName}</div>
                      <div className="font-number-data text-on-surface whitespace-nowrap">
                        {formatCurrency(item.quantity * item.unitPrice)}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 bg-surface-container-lowest border border-outline-variant rounded-lg p-1">
                        <button 
                          onClick={() => updateQuantity(item.productId, -1)}
                          className="w-7 h-7 flex items-center justify-center text-on-surface-variant hover:bg-surface-container rounded-md"
                        >
                          <span className="material-symbols-outlined text-[18px]">remove</span>
                        </button>
                        <span className="font-number-data text-sm w-4 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.productId, 1)}
                          className="w-7 h-7 flex items-center justify-center text-on-surface-variant hover:bg-surface-container rounded-md"
                        >
                          <span className="material-symbols-outlined text-[18px]">add</span>
                        </button>
                      </div>
                      <button 
                        onClick={() => removeItem(item.productId)}
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
    </div>
  );
}
