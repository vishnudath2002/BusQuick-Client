export function UserFilters({ 
  statusFilter,
  dateFilter,
  onStatusChange,
  onDateChange
}: {
  statusFilter: string;
  dateFilter: string;
  onStatusChange: (value: string) => void;
  onDateChange: (value: string) => void;
}) {
  return (
    <div className="mb-6 p-4 bg-white border border-gray-200 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select 
            className="w-full border border-gray-200 rounded-lg p-2"
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
          >
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Join Date
          </label>
          <select 
            className="w-full border border-gray-200 rounded-lg p-2"
            value={dateFilter}
            onChange={(e) => onDateChange(e.target.value)}
          >
            <option value="">All time</option>
            <option value="last_7_days">Last 7 days</option>
            <option value="last_30_days">Last 30 days</option>
            <option value="last_90_days">Last 90 days</option>
          </select>
        </div>
        <div className="flex items-end">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}