
import { Ticket, CreditCard, XCircle, Clock } from 'lucide-react';
import { StatCard } from './StatCard';
import { RecentActivity } from './RecentActivity';
import { PaymentHistory } from './PaymentHistory';

export function Dashboard() {
  const stats = [
    {
      title: 'Total Tickets',
      value: '1,234',
      icon: Ticket,
      trend: { value: 12, isPositive: true },
    },
    {
      title: 'Successful Payments',
      value: '985',
      icon: CreditCard,
      trend: { value: 8, isPositive: true },
    },
    {
      title: 'Cancelled Tickets',
      value: '67',
      icon: XCircle,
      trend: { value: 2, isPositive: false },
    },
    {
      title: 'Pending Payments',
      value: '182',
      icon: Clock,
      trend: { value: 5, isPositive: false },
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of ticket sales and payment status
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            {...stat}
            className="border border-gray-100"
          />
        ))}
      </div>
      <PaymentHistory />
      <RecentActivity />
    </div>
  );
}