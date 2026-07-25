import { getSalesAnalytics, getTopSellingProducts } from './actions';
import { AnalyticsDashboard } from '@/components/analytics/analytics-dashboard';

export const revalidate = 0; // Dynamic server component

export default async function AnalyticsPage() {
  const [analyticsRes, topProductsRes] = await Promise.all([
    getSalesAnalytics(),
    getTopSellingProducts(undefined, undefined, 5),
  ]);

  const initialAnalytics = analyticsRes.data || [];
  const initialTopProducts = topProductsRes.data || [];

  return (
    <AnalyticsDashboard
      initialAnalytics={initialAnalytics}
      initialTopProducts={initialTopProducts}
    />
  );
}
