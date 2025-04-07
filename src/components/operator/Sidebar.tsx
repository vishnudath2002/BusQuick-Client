import { useState } from 'react';
import {
  LayoutDashboard,
  Armchair,
  Calendar,
  BookOpen,
  // HeadphonesIcon,
  // MapPin,
  ChevronDown,
  LogOut
} from 'lucide-react';
import {  useDispatch } from "react-redux";
import { performLogout } from "../../redux/actions/authActions";
import { logout  } from "../../api/authApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";



interface SidebarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ onNavigate, currentPage }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'seats', label: 'Seat Management', icon: Armchair },
    { id: 'schedule', label: 'Schedule ', icon: Calendar },
    { id: 'bookings', label: 'Booking Management', icon: BookOpen },
    // { id: 'support', label: 'Customer Support', icon: HeadphonesIcon },
    // { id: 'tracking', label: 'Live Bus Tracking', icon: MapPin },
  ];

  
    const handleLogout = async () => {
      await logout();
      dispatch(performLogout());
      toast.success("You have successfully logged out.");
      navigate("/login");
    };

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800">Bus Operator</h2>
      </div>
      
      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors ${
                currentPage === item.id ? 'bg-blue-50 text-blue-600' : ''
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="absolute bottom-0 w-full p-4 border-t">
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center w-full p-3 rounded-lg hover:bg-gray-100"
          >
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="Profile"
              className="w-8 h-8 rounded-full mr-3"
            />
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-gray-700">hari</p>
              <p className="text-xs text-gray-500">Bus Operator</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>

          {isProfileOpen && (
            <div className="absolute bottom-full left-0 w-full mb-2 bg-white rounded-lg shadow-lg border">
              <button
                className="flex items-center w-full p-3 text-red-600 hover:bg-red-50"
                onClick={() => {handleLogout()}}
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};