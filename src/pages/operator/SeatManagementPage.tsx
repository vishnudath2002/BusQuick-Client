import React, { useState, useEffect } from 'react';
// import { Check, X } from 'lucide-react';
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { fetchSchedules } from '../../api/operatorApi';
import { getSeats } from '../../api/userApi';
import { Schedule } from '../../types/Schedule';

import { BusLayout } from '../../components/operator/seats/BusLayout';

export const SeatManagementPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [seats, setSeats] = useState([]);

  const id = useSelector((state: RootState) => state.user.id)


  useEffect(() => {
    const loadSchedules = async () => {
      try {
        const data = await fetchSchedules(id);
  
        setSchedules(data.data)

      } catch (error) {
        console.error("Error fetching Schedules:", error);
      }
    };

    loadSchedules();
  }, []);


  const handleShowSeats = async (busId: string, date: string) => {
    try {
      const response = await getSeats(busId, date);
      setSeats(response.seats);
    } catch (error) {
      console.log(error)
    }
  }





  // const seats = Array.from({ length: 30 }, (_, i) => ({
  //   id: `S${i + 1}`,
  //   number: i + 1,
  //   status: Math.random() > 0.5 ? 'booked' : 'available',
  //   type: i < 20 ? 'seater' : 'sleeper'
  // }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Seat Management</h1>
        <select
  value={selectedDate}
  onChange={(e) => {
    const [busId, date] = e.target.value.split("+"); // Extract busId and date
    setSelectedDate(date); // Update state
    handleShowSeats(busId, date); // Call function with formatted date
  }}
  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
>
  <option value="">Select Date</option>
  {schedules.map((bus) =>
    bus.dateSlots.map((ele) => {
      const formattedDate = new Date(ele).toISOString().split("T")[0]; // Convert to YYYY-MM-DD format
      return (
        <option key={`${bus.busId}+${formattedDate}`} value={`${bus.busId}+${formattedDate}`}>
            {formattedDate}
        </option>
      );
    })
  )}
</select>




      </div>

      
      <div className="grid lg:grid-cols-[1fr,400px] gap-8">
          <div className="space-y-8">
            {selectedDate ? <BusLayout 
             seats = {seats}
          /> :<div>Select the date</div>}
          
          {/* {seats.map(seat => (
            <div
              key={seat.id}
              className={`p-4 rounded-lg border-2 ${seat.status === 'booked'
                ? 'border-red-200 bg-red-50'
                : 'border-green-200 bg-green-50'
                }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">{seat.number}</span>
                {seat.status === 'booked' ? (
                  <X className="h-4 w-4 text-red-500" />
                ) : (
                  <Check className="h-4 w-4 text-green-500" />
                )}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {seat.type.charAt(0).toUpperCase() + seat.type.slice(1)}
              </div>
            </div>
          ))} */}
        </div>

        {/* <div className="mt-6 flex gap-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-50 border-2 border-green-200 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Available</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-50 border-2 border-red-200 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Booked</span>
          </div>
        </div> */}
      </div>
    </div>
  );
};