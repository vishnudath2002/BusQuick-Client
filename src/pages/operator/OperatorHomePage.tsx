import { useState } from 'react';
import { Navbar } from "../../components/operator/Navbar";
import { Dashboard } from "../../components/operator/Dashboard";
import { Sidebar } from "../../components/operator/Sidebar";
import { SeatManagementPage } from './SeatManagementPage';
import { ScheduleManagementPage } from './ScheduleManagementPage';
import { BookingManagementPage } from './BookingManagementPage';
import { CustomerSupportPage } from './CustomerSupportPage';
import { LiveTrackingPage } from './LiveTrackingPage';

const OperatorHomePage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar onNavigate={setCurrentPage} currentPage={currentPage} />
      <div className="flex-1 ml-64">
        <Navbar />
        <main className="p-6">
          {currentPage === 'dashboard' ? (
            <Dashboard />
          ) : currentPage === 'seats' ? (
            <SeatManagementPage />
          ) : currentPage === 'schedule' ? (
            <ScheduleManagementPage />
          ) : currentPage === 'bookings' ? (
            <BookingManagementPage />
          ) : currentPage === 'support' ? (
            <CustomerSupportPage />
          )
           : currentPage === 'tracking' ? (
            <LiveTrackingPage />
          ) : null}
        </main>
      </div>
    </div>
  );
};

export default OperatorHomePage;