import React from 'react';
import { Bus, LayoutDashboard, MapPin, Clock , Book, Armchair} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'buses', label: 'Bus List', icon: Bus },
    { id: 'routes', label: 'Routes', icon: MapPin },
    { id: 'seats', label: 'Seats', icon: Armchair},
    { id: 'schedule', label: 'Schedule', icon: Clock },
    { id: 'booking', label: 'Booking', icon:Book}
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white shadow-lg">
      <div className="flex h-16 items-center justify-center border-b">
        <h1 className="text-xl font-bold text-gray-800">Owner Portal</h1>
      </div>
      <nav className="mt-6 px-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`mb-2 flex w-full items-center rounded-lg px-4 py-3 text-left transition-colors ${
                currentPage === item.id
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon className="mr-3 h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}