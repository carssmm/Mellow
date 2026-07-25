/**
 * Helper to get ISO string for midnight (00:00:00.000) in Philippines Timezone (UTC+8)
 */
export function getPHStartOfDayISO(): string {
  const now = new Date();
  // Format current date in Asia/Manila (YYYY-MM-DD)
  const phDateParts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Manila',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now); // Output format: YYYY-MM-DD

  // Create date object corresponding to YYYY-MM-DDT00:00:00+08:00
  const phStartOfDay = new Date(`${phDateParts}T00:00:00.000+08:00`);
  return phStartOfDay.toISOString();
}

/**
 * Helper to get start and end ISO strings for a date range in Philippines Timezone (UTC+8)
 */
export function getPHDateRangeISO(startDateStr?: string, endDateStr?: string) {
  const now = new Date();
  let startStr: string;
  let endStr: string;

  if (startDateStr && endDateStr) {
    startStr = `${startDateStr}T00:00:00.000+08:00`;
    endStr = `${endDateStr}T23:59:59.999+08:00`;
  } else {
    // Current month in Asia/Manila
    const monthFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Manila',
      year: 'numeric',
      month: '2-digit',
    });
    const parts = monthFormatter.formatToParts(now);
    const year = parts.find(p => p.type === 'year')?.value;
    const month = parts.find(p => p.type === 'month')?.value;

    startStr = `${year}-${month}-01T00:00:00.000+08:00`;
    
    // Last day of current month
    const nextMonth = new Date(Number(year), Number(month), 0);
    const lastDay = String(nextMonth.getDate()).padStart(2, '0');
    endStr = `${year}-${month}-${lastDay}T23:59:59.999+08:00`;
  }

  return {
    startISO: new Date(startStr).toISOString(),
    endISO: new Date(endStr).toISOString(),
  };
}

/**
 * Formats a Date/string to Asia/Manila string
 */
export function formatPHDateTime(dateInput: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  return new Intl.DateTimeFormat('en-PH', {
    timeZone: 'Asia/Manila',
    dateStyle: 'medium',
    timeStyle: 'short',
    ...options,
  }).format(date);
}
