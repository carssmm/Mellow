'use client';

import { useState } from 'react';
import { RestockItem } from '@/types';
import { formatRestockForWhatsApp, formatRestockPlainText, copyToClipboard, shareNative } from '@/lib/clipboard';
import { useToast } from '@/components/ui/toast';

interface RestockClientProps {
  items: RestockItem[];
}

export function RestockClient({ items }: RestockClientProps) {
  const [adHocItems, setAdHocItems] = useState<string[]>([]);
  const [newItemText, setNewItemText] = useState('');
  const [isCopiedWhatsApp, setIsCopiedWhatsApp] = useState(false);
  const [isCopiedText, setIsCopiedText] = useState(false);
  const { showToast } = useToast();

  const estimatedCost = items.reduce((sum, item) => sum + item.estimatedCost, 0);
  const totalItems = items.length + adHocItems.length;

  const handleAddAdHoc = () => {
    if (newItemText.trim()) {
      setAdHocItems([...adHocItems, newItemText.trim()]);
      setNewItemText('');
    }
  };

  const handleRemoveAdHoc = (index: number) => {
    const newItems = [...adHocItems];
    newItems.splice(index, 1);
    setAdHocItems(newItems);
  };

  const handleCopyWhatsApp = async () => {
    const text = formatRestockForWhatsApp(items, adHocItems, estimatedCost);
    const success = await copyToClipboard(text);
    
    if (success) {
      setIsCopiedWhatsApp(true);
      showToast('Copied to clipboard!', 'success');
      setTimeout(() => setIsCopiedWhatsApp(false), 2000);
    } else {
      showToast('Failed to copy', 'error');
    }
  };

  const handleCopyText = async () => {
    const text = formatRestockPlainText(items, adHocItems, estimatedCost);
    const success = await copyToClipboard(text);
    
    if (success) {
      setIsCopiedText(true);
      showToast('Copied to clipboard!', 'success');
      setTimeout(() => setIsCopiedText(false), 2000);
    } else {
      showToast('Failed to copy', 'error');
    }
  };

  if (totalItems === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] text-center border-2 border-dashed border-outline-variant rounded-lg">
        <span className="material-symbols-outlined text-4xl text-emerald-600 mb-2">check_circle</span>
        <p className="text-body-md text-on-surface">
          All items are well stocked! ✓
        </p>
        
        <div className="mt-6 w-full max-w-xs px-4">
          <p className="text-body-sm text-on-surface-variant mb-2 text-left">Need something else?</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddAdHoc()}
              placeholder="Add ad-hoc item..."
              className="flex-1 bg-surface border border-outline-variant rounded-lg px-3 py-2 text-body-sm focus:outline-none focus:border-primary"
            />
            <button
              onClick={handleAddAdHoc}
              className="bg-primary text-on-primary rounded-lg px-3 py-2 flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto pr-2 space-y-3 mb-6">
        {/* DB Items */}
        {items.map((item) => {
          const itemsPerPkg = item.itemsPerPackage || 1;
          const pkgName = item.packageUnitName || 'box';
          let buyText = `${item.recommendedQty} pcs`;
          if (itemsPerPkg > 1) {
            const pkgs = Math.ceil(item.recommendedQty / itemsPerPkg);
            buyText = `${pkgs} ${pkgName}${pkgs === 1 ? '' : 'es'} (${item.recommendedQty} pcs)`;
          }

          return (
            <div key={item.productId} className="flex items-start gap-3 p-3 bg-surface rounded-lg border border-outline-variant">
              <span className="material-symbols-outlined text-primary mt-0.5">shopping_cart</span>
              <div className="flex-1">
                <p className="text-body-md font-medium text-on-surface">
                  Buy {buyText} {item.productName}
                </p>
                <p className="text-body-sm text-on-surface-variant">
                  Est: {new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(item.estimatedCost)}
                </p>
              </div>
            </div>
          );
        })}

        {/* Ad-Hoc Items */}
        {adHocItems.map((item, index) => (
          <div key={`adhoc-${index}`} className="flex items-start gap-3 p-3 bg-surface rounded-lg border border-outline-variant border-dashed">
            <span className="material-symbols-outlined text-on-surface-variant mt-0.5">edit_note</span>
            <div className="flex-1">
              <p className="text-body-md text-on-surface">{item}</p>
            </div>
            <button 
              onClick={() => handleRemoveAdHoc(index)}
              className="text-on-surface-variant hover:text-error transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        ))}

        {/* Add Ad-Hoc Input */}
        <div className="flex gap-2 pt-2">
          <input
            type="text"
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddAdHoc()}
            placeholder="Add manual item..."
            className="flex-1 bg-surface border border-outline-variant rounded-lg px-3 py-2 text-body-sm focus:outline-none focus:border-primary"
          />
          <button
            onClick={handleAddAdHoc}
            disabled={!newItemText.trim()}
            className="bg-surface-variant text-on-surface rounded-lg px-3 py-2 flex items-center justify-center disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
          </button>
        </div>
      </div>

      <div className="pt-4 border-t border-outline-variant space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-body-lg text-on-surface-variant">Estimated Cost</span>
          <span className="text-headline-sm font-headline-sm text-on-surface">
            {new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(estimatedCost)}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={handleCopyWhatsApp}
            className="w-full py-3 bg-[#FAFAFA] text-on-surface border border-outline-variant rounded-xl flex items-center justify-center gap-2 hover:bg-surface-variant transition-colors"
            style={{ backgroundColor: '#2B2B2B', color: '#F5F2EC' }}
          >
            {isCopiedWhatsApp ? (
              <>
                <span className="material-symbols-outlined">check</span>
                <span className="text-label-lg font-label-lg">Copied!</span>
              </>
            ) : (
              <>
                <span className="text-[20px]">📱</span>
                <span className="text-label-lg font-label-lg">Copy to WhatsApp / SMS</span>
              </>
            )}
          </button>

          <button
            onClick={handleCopyText}
            className="w-full py-3 bg-transparent text-on-surface border border-outline-variant rounded-xl flex items-center justify-center gap-2 hover:bg-surface-variant transition-colors"
          >
            {isCopiedText ? (
              <>
                <span className="material-symbols-outlined">check</span>
                <span className="text-label-lg font-label-lg">Copied!</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">content_copy</span>
                <span className="text-label-lg font-label-lg">Copy Plain Text List</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
