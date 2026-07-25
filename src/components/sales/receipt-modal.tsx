'use client';

import { Sale, SaleItem, Product } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface ReceiptModalProps {
  sale: Sale & { items: (SaleItem & { product: Product })[] };
  onClose: () => void;
}

import { formatPHDateTime } from '@/lib/date-utils';

export function ReceiptModal({ sale, onClose }: ReceiptModalProps) {
  const handlePrint = () => {
    window.print();
  };

  const formattedDate = formatPHDateTime(sale.created_at);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 print:p-0 print:bg-white print:static">
      <div className="bg-white border border-outline-variant/60 rounded-xl shadow-2xl w-full max-w-[380px] p-6 text-on-surface flex flex-col font-mono text-xs print:border-none print:shadow-none print:w-full print:p-0">
        
        {/* Modal Header Actions (Hidden in Print) */}
        <div className="flex items-center justify-between pb-4 border-b border-dashed border-gray-300 print:hidden font-sans">
          <div className="flex items-center gap-1.5 font-bold text-sm">
            <span className="material-symbols-outlined text-primary text-[18px]">receipt_long</span>
            <span>POS Thermal Receipt</span>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-700">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* RECEIPT Thermal Body */}
        <div className="pt-4 space-y-4 printable-receipt">
          {/* Café Header */}
          <div className="text-center space-y-1 border-b border-dashed border-gray-300 pb-3">
            <h2 className="text-base font-bold tracking-wider uppercase">MELLOW CAFÉ</h2>
            <p className="text-[10px] text-gray-500 font-sans">Freshly Brewed & Handcrafted</p>
            <p className="text-[10px] text-gray-400 font-mono">Receipt #{sale.id.slice(0, 8).toUpperCase()}</p>
            <p className="text-[10px] text-gray-500 mt-1">{formattedDate}</p>
          </div>

          {/* Transaction Metadata */}
          <div className="space-y-1 text-[11px] border-b border-dashed border-gray-300 pb-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Entry Mode:</span>
              <span className="font-semibold uppercase">{sale.entry_mode.replace('_', ' ')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Payment:</span>
              <span className="font-semibold uppercase">{sale.payment_method === 'cash' ? 'Cash' : 'GCash / Maya'}</span>
            </div>
            {sale.is_voided && (
              <div className="flex justify-between text-red-600 font-bold">
                <span>STATUS:</span>
                <span>VOIDED ({sale.void_reason || 'Cancelled'})</span>
              </div>
            )}
          </div>

          {/* Itemized Breakdown */}
          <div className="space-y-2 border-b border-dashed border-gray-300 pb-3">
            <div className="flex justify-between text-gray-500 font-semibold text-[10px] uppercase">
              <span>Qty x Item</span>
              <span>Total</span>
            </div>
            {sale.items.map((item) => (
              <div key={item.id} className="space-y-0.5">
                <div className="flex justify-between font-semibold">
                  <span>{item.quantity}x {item.product?.name || 'Item'}</span>
                  <span>{formatCurrency(item.quantity * item.unit_price)}</span>
                </div>
                <div className="flex justify-between text-[10px] text-gray-500">
                  <span>@{formatCurrency(item.unit_price)} / unit</span>
                </div>
                {item.item_notes && (
                  <div className="text-[10px] italic text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-sans">
                    Note: {item.item_notes}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Customer General Notes */}
          {sale.customer_notes && (
            <div className="border-b border-dashed border-gray-300 pb-3 font-sans">
              <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Customer Order Notes:</span>
              <p className="text-[11px] bg-amber-50 border border-amber-200 text-amber-900 p-2 rounded italic">
                "{sale.customer_notes}"
              </p>
            </div>
          )}

          {/* Totals */}
          <div className="space-y-1.5 text-xs pt-1">
            <div className="flex justify-between text-sm font-bold border-b border-gray-900 pb-1">
              <span>TOTAL AMOUNT:</span>
              <span>{formatCurrency(sale.total_revenue)}</span>
            </div>
            {sale.amount_paid && (
              <div className="flex justify-between text-[11px] text-gray-600">
                <span>Amount Rendered:</span>
                <span>{formatCurrency(sale.amount_paid)}</span>
              </div>
            )}
            {sale.change_given !== undefined && sale.change_given !== null && (
              <div className="flex justify-between text-[11px] text-gray-600">
                <span>Change Given:</span>
                <span>{formatCurrency(sale.change_given)}</span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="text-center pt-3 border-t border-dashed border-gray-300 text-[10px] text-gray-500 font-sans space-y-1">
            <p className="font-semibold">Thank you for visiting Mellow Café!</p>
            <p>Please come again ☕</p>
          </div>
        </div>

        {/* Modal Buttons (Hidden in Print) */}
        <div className="mt-6 flex items-center gap-2 print:hidden font-sans">
          <button
            onClick={onClose}
            className="flex-1 h-10 border border-outline-variant hover:bg-gray-100 rounded-lg text-xs font-semibold transition-colors"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 h-10 bg-primary-container hover:bg-primary-container/90 text-on-primary rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">print</span>
            <span>Print Receipt</span>
          </button>
        </div>

      </div>
    </div>
  );
}
