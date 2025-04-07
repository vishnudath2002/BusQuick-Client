
import { Users, DollarSign, Ticket } from 'lucide-react';
import { StatCard } from '../Stats/StatCard';
import { RevenueChart } from '../charts/RevenueChart';

export function DashboardContent() {
  const stats = [
    {
      title: 'Total Users',
      value: '24,563',
      icon: Users,
      trend: { value: 12, isPositive: true },
    },
    {
      title: 'Total Revenue',
      value: '$438,200',
      icon: DollarSign,
      trend: { value: 8, isPositive: true },
    },
    {
      title: 'Ticket Sales',
      value: '18,249',
      icon: Ticket,
      trend: { value: 5, isPositive: true },
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of your business metrics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <RevenueChart />
    </div>
  );
}