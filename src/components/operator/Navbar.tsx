// import { Bell } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <div className="bg-white shadow-sm">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex-1 max-w-xl">
          {/* <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div> */}
        </div>

        <div className="flex items-center space-x-4">
          {/* <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full">
            <Bell className="h-6 w-6" />
            <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
              3
            </span>
          </button> */}
        </div>
      </div>
    </div>
  );
};