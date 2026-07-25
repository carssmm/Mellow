import { RestockItem } from '@/types';

export function formatRestockForWhatsApp(items: RestockItem[], adHocItems: string[] = [], estimatedCost: number = 0): string {
  const dateStr = new Intl.DateTimeFormat('en-PH', {
    dateStyle: 'medium',
  }).format(new Date());

  let message = `🛒 *Mellow Café Restock List*\n📅 ${dateStr}\n───────────────\n`;

  items.forEach(item => {
    const itemsPerPkg = item.itemsPerPackage || 1;
    const pkgName = item.packageUnitName || 'box';
    let pkgDetails = `${item.recommendedQty} pcs`;
    if (itemsPerPkg > 1) {
      const pkgCount = Math.ceil(item.recommendedQty / itemsPerPkg);
      pkgDetails = `${pkgCount} ${pkgName}${pkgCount === 1 ? '' : 'es'} (${item.recommendedQty} pcs)`;
    }
    message += `☐ Buy ${pkgDetails} ${item.productName}\n`;
  });

  adHocItems.forEach(item => {
    if (item.trim()) {
      message += `☐ Buy ${item.trim()}\n`;
    }
  });

  message += `───────────────\n`;
  
  if (estimatedCost > 0) {
    const costStr = new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(estimatedCost);
    message += `💰 Est. Total: ${costStr}\n`;
  }

  return message;
}

export function formatRestockPlainText(items: RestockItem[], adHocItems: string[] = [], estimatedCost: number = 0): string {
  const dateStr = new Intl.DateTimeFormat('en-PH', {
    dateStyle: 'medium',
  }).format(new Date());

  let message = `Mellow Café Restock List - ${dateStr}\n`;

  items.forEach(item => {
    const itemsPerPkg = item.itemsPerPackage || 1;
    const pkgName = item.packageUnitName || 'box';
    let pkgDetails = `${item.recommendedQty} pcs`;
    if (itemsPerPkg > 1) {
      const pkgCount = Math.ceil(item.recommendedQty / itemsPerPkg);
      pkgDetails = `${pkgCount} ${pkgName}${pkgCount === 1 ? '' : 'es'} (${item.recommendedQty} pcs)`;
    }
    message += `- Buy ${pkgDetails} ${item.productName}\n`;
  });

  adHocItems.forEach(item => {
    if (item.trim()) {
      message += `- Buy ${item.trim()}\n`;
    }
  });

  if (estimatedCost > 0) {
    const costStr = new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(estimatedCost);
    message += `Est. Total: ${costStr}\n`;
  }

  return message;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    // Avoid scrolling to bottom
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error('Failed to copy text: ', err);
    return false;
  }
}

export async function shareNative(text: string, title: string = 'Mellow Café Restock List'): Promise<boolean> {
  if (navigator.share) {
    try {
      await navigator.share({
        title,
        text,
      });
      return true;
    } catch (err) {
      // User cancelled share or it failed
      console.error('Failed to share native: ', err);
      // Fallback to clipboard if it wasn't a user cancellation
      if (err instanceof Error && err.name !== 'AbortError') {
        return copyToClipboard(text);
      }
      return false;
    }
  } else {
    // Web Share API not available, fallback to clipboard
    return copyToClipboard(text);
  }
}
