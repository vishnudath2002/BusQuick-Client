

interface ActivityItem {
  id: string;
  title: string;
  status: 'completed' | 'pending' | 'cancelled';
  description: string;
}

const activities: ActivityItem[] = [
  { id: '1234', title: 'Ticket #1234', status: 'completed', description: 'Payment successful' },
  { id: '1233', title: 'Ticket #1233', status: 'pending', description: 'Awaiting payment' },
  { id: '1232', title: 'Ticket #1232', status: 'cancelled', description: 'Ticket cancelled' },
];

const statusStyles = {
  completed: 'text-green-700 bg-green-50',
  pending: 'text-yellow-700 bg-yellow-50',
  cancelled: 'text-red-700 bg-red-50',
};

export function RecentActivity() {
  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
      <div className="bg-white shadow-sm rounded-xl border border-gray-100">
        {activities.map((activity, index) => (
          <div
            key={activity.id}
            className={`px-6 py-4 ${
              index !== activities.length - 1 ? 'border-b border-gray-100' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{activity.title}</p>
                <p className="text-sm text-gray-500">{activity.description}</p>
              </div>
              <span
                className={`px-3 py-1 text-sm rounded-full ${
                  statusStyles[activity.status]
                }`}
              >
                {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}