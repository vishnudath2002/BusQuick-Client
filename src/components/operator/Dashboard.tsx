import { Users, Bus, Calendar, TrendingUp } from 'lucide-react';

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stats Cards */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Passengers</p>
              <p className="text-xl font-semibold text-gray-800">1,234</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-500 ml-1">+12.5%</span>
              <span className="text-sm text-gray-500 ml-2">from last month</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Bus className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Active Buses</p>
              <p className="text-xl font-semibold text-gray-800">42</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-500 ml-1">+3</span>
              <span className="text-sm text-gray-500 ml-2">new this week</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Today's Trips</p>
              <p className="text-xl font-semibold text-gray-800">86</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-500 ml-1">98%</span>
              <span className="text-sm text-gray-500 ml-2">on schedule</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Revenue</p>
              <p className="text-xl font-semibold text-gray-800">$12,345</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-500 ml-1">+18.2%</span>
              <span className="text-sm text-gray-500 ml-2">from last month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[
            {
              title: "New booking received",
              description: "John Doe booked ticket for Route A12",
              time: "5 minutes ago"
            },
            {
              title: "Schedule updated",
              description: "Route B45 departure time changed to 14:30",
              time: "20 minutes ago"
            },
            {
              title: "Customer support ticket",
              description: "New refund request from Sarah Smith",
              time: "1 hour ago"
            },
            {
              title: "Bus maintenance alert",
              description: "Bus KA-01-JS-1234 due for maintenance",
              time: "2 hours ago"
            }
          ].map((activity, index) => (
            <div key={index} className="flex items-start">
              <div className="h-2 w-2 mt-2 rounded-full bg-blue-500"></div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-800">{activity.title}</p>
                <p className="text-sm text-gray-500">{activity.description}</p>
                <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};