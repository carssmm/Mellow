export interface SalesCSVRow {
  date: string;
  productName: string;
  category: string;
  quantity: number;
  unitPrice: number;
  unitCost: number;
  revenue: number;
  cogs: number;
  profit: number;
  paymentMethod: string;
  entryMode: string;
}

export interface ProfitSummaryCSVRow {
  date: string;
  grossRevenue: number;
  totalCogs: number;
  netProfit: number;
  itemsSold: number;
  transactionCount: number;
}

function escapeCSV(field: string | number): string {
  const str = String(field ?? '');
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function generateSalesCSV(rows: SalesCSVRow[]): string {
  const headers = [
    'Date',
    'Product',
    'Category',
    'Quantity',
    'Unit Price (PHP)',
    'Unit Cost (PHP)',
    'Revenue (PHP)',
    'COGS (PHP)',
    'Profit (PHP)',
    'Payment Method',
    'Entry Mode',
  ];

  let csv = headers.join(',') + '\n';

  let totalRev = 0;
  let totalCogs = 0;
  let totalProf = 0;

  rows.forEach((row) => {
    totalRev += row.revenue;
    totalCogs += row.cogs;
    totalProf += row.profit;

    csv += [
      escapeCSV(row.date),
      escapeCSV(row.productName),
      escapeCSV(row.category),
      row.quantity,
      row.unitPrice.toFixed(2),
      row.unitCost.toFixed(2),
      row.revenue.toFixed(2),
      row.cogs.toFixed(2),
      row.profit.toFixed(2),
      escapeCSV(row.paymentMethod),
      escapeCSV(row.entryMode),
    ].join(',') + '\n';
  });

  // Summary Row
  csv += [
    'TOTALS',
    '',
    '',
    '',
    '',
    '',
    totalRev.toFixed(2),
    totalCogs.toFixed(2),
    totalProf.toFixed(2),
    '',
    '',
  ].join(',') + '\n';

  return csv;
}

export function generateProfitSummaryCSV(rows: ProfitSummaryCSVRow[]): string {
  const headers = [
    'Date',
    'Gross Revenue (PHP)',
    'Total COGS (PHP)',
    'Net Profit (PHP)',
    'Items Sold',
    'Transactions',
  ];

  let csv = headers.join(',') + '\n';

  let totalRev = 0;
  let totalCogs = 0;
  let totalProf = 0;
  let totalItems = 0;
  let totalTx = 0;

  rows.forEach((row) => {
    totalRev += row.grossRevenue;
    totalCogs += row.totalCogs;
    totalProf += row.netProfit;
    totalItems += row.itemsSold;
    totalTx += row.transactionCount;

    csv += [
      escapeCSV(row.date),
      row.grossRevenue.toFixed(2),
      row.totalCogs.toFixed(2),
      row.netProfit.toFixed(2),
      row.itemsSold,
      row.transactionCount,
    ].join(',') + '\n';
  });

  // Summary Row
  csv += [
    'TOTALS',
    totalRev.toFixed(2),
    totalCogs.toFixed(2),
    totalProf.toFixed(2),
    totalItems,
    totalTx,
  ].join(',') + '\n';

  return csv;
}

export function downloadCSV(csvContent: string, filename: string) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
