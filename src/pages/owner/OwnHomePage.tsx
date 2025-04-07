import { useState } from 'react';
import { Navbar } from "../../components/owner/Navbar";
import { Dashboard } from "../../components/owner/Dashboard";
import { Sidebar } from "../../components/owner/Sidebar";
import { BusListPage } from './BusListPage';
import { RouteListPage } from './RouteListPage';
import { ScheduleListPage } from './ScheduleListPage';
import { BookingsPage } from './BookingsPage';
import { SeatListPage } from "./SeatListPage"

const OwnHomePage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar onNavigate={setCurrentPage} currentPage={currentPage} />
      <div className="flex-1 ml-64">
        <Navbar />
        <main className="p-6">
          {currentPage === 'dashboard' ? (
            <Dashboard />
          ) : currentPage === 'buses' ? (
            <BusListPage />
          ) : currentPage === 'routes' ? (
            <RouteListPage /> 
          ) : currentPage === 'schedule' ? (
            <ScheduleListPage />
          ) : currentPage === 'booking' ? (
            <BookingsPage /> )
           : currentPage === 'seats' ? (
              <SeatListPage /> )
               : null}
        </main>
      </div>
    </div>
  );
};

export default OwnHomePage;