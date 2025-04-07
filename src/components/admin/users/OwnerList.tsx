import {  useState } from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';
import { OwnerTable } from './OwnerTable';
import { UserFilters } from './UserFilters';


export function OwnerList() {
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');


 

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Owners</h1>
        <p className="mt-1 text-sm text-gray-500">Manage and monitor owner accounts</p>
      </div>

      <div className="mb-6 flex flex-wrap gap-4">

        <div className="flex-1 min-w-[240px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>


        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
          <ChevronDown className="w-4 h-4 ml-2" />
        </button>
      </div>

  
      {showFilters && (
        <UserFilters
          statusFilter={statusFilter}
          dateFilter={dateFilter}
          onStatusChange={setStatusFilter}
          onDateChange={setDateFilter}
        />
      )}

      <OwnerTable 
      searchQuery={searchQuery}
      statusFilter={statusFilter}
      dateFilter={dateFilter}
       />
    </div>
  );
}
