import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { fetchBookings, cancelSeats } from '../../api/operatorApi';
import { Booking } from '../../types/Booking';
import { formatDate } from '../../utils/FormateDateTime';
import toast from 'react-hot-toast';

export const BookingManagementPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const id = useSelector((state: RootState) => state.user.id);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const data = await fetchBookings(id);
        setBookings(data.data); // Set bookings state
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };
    loadBookings();
  }, [id,isModalOpen]);

  const openCancelModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setSelectedSeats([]); // Reset selected seats
    setIsModalOpen(true);
  };

  const handleCancelSeats = async () => {
    if (!selectedBooking) return;
    const res = await cancelSeats(selectedBooking.id, selectedSeats);

    toast.success(res.message)
    setIsModalOpen(false); // Close modal after cancellation
  };

  const handleSeatSelection = (seat: string) => {
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  const filteredBookings = bookings.filter((booking) =>
    (filterStatus === 'all' || booking.status.toLowerCase() === filterStatus) &&
    (booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Booking Management</h1>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search bookings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Passenger</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Route</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Seat</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredBookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{booking.id.slice(0, 7)}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{booking.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{booking.source} - {booking.destination}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{formatDate(booking.bookingDate)}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{formatDate(booking.date)}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{booking.seatsBooked.join(', ')}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                      booking.status === 'success' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                    }`}>
                    {booking.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">₹{booking.totalAmount}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => openCancelModal(booking)}
                    className={`px-3 py-1 rounded-lg ${booking.seatsBooked.length === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-500 text-white hover:bg-red-700'
                      }`}
                    disabled={booking.seatsBooked.length === 0}
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && selectedBooking && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4">Select Seats to Cancel</h2>
            <div className="grid grid-cols-3 gap-2">
              {selectedBooking.seatsBooked.map((seat) => (
                <button
                  key={seat}
                  onClick={() => handleSeatSelection(seat)}
                  className={`px-4 py-2 border rounded ${selectedSeats.includes(seat) ? 'bg-red-500 text-white' : 'bg-gray-100'
                    }`}
                >
                  {seat}
                </button>
              ))}
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-300 rounded">Close</button>
              <button onClick={handleCancelSeats} className="px-4 py-2 bg-red-500 text-white rounded">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
