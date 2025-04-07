import React from "react";
import { Booking } from "../../types/Booking";

interface BookingsListProps {
  booking: Booking[];
}

export const BookingsList: React.FC<BookingsListProps> = ({ booking }) => {
  
  if (!booking || booking.length === 0) {
    return <p>No bookings available</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow">
      <table className="w-full table-fixed divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="w-1/6 px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
            <th className="w-1/6 px-6 py-4 text-left text-sm font-semibold text-gray-900">Phone</th>
            <th className="w-1/6 px-6 py-4 text-left text-sm font-semibold text-gray-900">Pickup Stop</th>
            <th className="w-1/6 px-6 py-4 text-left text-sm font-semibold text-gray-900">Drop Stop</th>
            <th className="w-1/6 px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
            <th className="w-1/6 px-6 py-4 text-left text-sm font-semibold text-gray-900">Total Seats</th>
            <th className="w-1/6 px-6 py-4 text-left text-sm font-semibold text-gray-900">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {booking.map((item) => (
            <tr key={item.userId} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm text-gray-900">{item.name}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{item.phone}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{item.pickupStops}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{item.dropStops}</td>
              <td className="px-6 py-4 text-sm font-semibold">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-sm ${
                    item.status === "success"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {item.status}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">{item.seatsBooked.length}</td>
              <td className="px-6 py-4 text-sm text-gray-900">₹{item.totalAmount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
