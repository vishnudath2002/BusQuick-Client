import { MoreVertical, Mail, Phone } from 'lucide-react';
import { useEffect, useState } from 'react';
import { userLists, userBlockToggle } from '../../../api/adminApi';
import { User } from '../../../types/User';


export function UserTable({ searchQuery, statusFilter, dateFilter }: {
  searchQuery: string;
  statusFilter: string;
  dateFilter: string;
}) {
  const [users, setUsers] = useState<User[]>([]);
  const role = 'user';
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 2;

  useEffect(() => {
    const handleData = async () => {
      const data = await userLists({ role, searchQuery, page: currentPage, limit: usersPerPage });
      let fetchedUsers = data.users || [];
  
      if (statusFilter) {
        fetchedUsers = fetchedUsers.filter((user: User) =>
          statusFilter === 'active' ? !user.isBlocked : user.isBlocked
        );
      }
  
      if (dateFilter) {
        const now = new Date();
        const filterDays = {
          'last_7_days': 7,
          'last_30_days': 30,
          'last_90_days': 90
        }[dateFilter];
  
        if (filterDays) {
          fetchedUsers = fetchedUsers.filter((user: User) => {
            const userDate = new Date(user.createdAt);
            const diffTime = Math.ceil((now.getTime() - userDate.getTime()) / (1000 * 60 * 60 * 24));
            return diffTime <= filterDays;
          });
        }
      }
  
      setUsers(fetchedUsers);
    };
  
    handleData();
  }, [selectedUserId, searchQuery, statusFilter, dateFilter, currentPage]);
  


  const toggleBlockStatus = async (userId: string) => {
    try {
      const updatedUser = await userBlockToggle(userId);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, isBlocked: updatedUser.isBlocked } : user
        )
      );
      setSelectedUserId(null);
    } catch (error) {
      console.error('Error toggling block status:', error);
    }
  };

  const totalPages = 1;
  // Math.ceil(users.length / usersPerPage)
  const paginatedUsers = users;

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
            <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {paginatedUsers.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{user.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col">
                  <div className="flex items-center text-sm text-gray-500">
                    <Mail className="w-4 h-4 mr-1" /> {user.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Phone className="w-4 h-4 mr-1" /> {user.phone}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isBlocked ? 'bg-gray-100 text-gray-800' : 'bg-green-100 text-green-800'}`}>{user.isBlocked ? 'Inactive' : 'Active'}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(user.createdAt).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                <button className="text-gray-400 hover:text-gray-500" onClick={() => setSelectedUserId(selectedUserId === user.id ? null : user.id)}>
                  <MoreVertical className="w-5 h-5" />
                </button>
                {selectedUserId === user.id && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-10">
                    <button className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100" onClick={() => toggleBlockStatus(user.id)}>
                      {user.isBlocked ? 'Unblock' : 'Block'}
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Showing {users.length > 0 ? (currentPage - 1) * usersPerPage + 1 : 0} to {Math.min(currentPage * usersPerPage, users.length)} of {users.length} results
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1 border border-gray-200 rounded text-sm" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
            Previous
          </button>
          <button className="px-3 py-1 border border-gray-200 rounded text-sm" onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
