import { useState } from 'react';
import { Sidebar } from '../../components/admin/layout/SideBar';
import { DashboardContent } from '../../components/admin/dashboard/DashboardContent';
import { UserList } from '../../components/admin/users/UserList';
import { OwnerList } from '../../components/admin/users/OwnerList';


function App() {




  const [currentPage, setCurrentPage] = useState('dashboard');



  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar onNavigate={setCurrentPage} currentPage={currentPage} />
      <main className="flex-1 ml-64">
        {currentPage === 'dashboard' ? (
          <DashboardContent />
        ) : currentPage === 'bus-owners' ? (
          <OwnerList />
        ) : (
          <UserList />
        )}
      </main>
    </div>
  );
}

export default App;