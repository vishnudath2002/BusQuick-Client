import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Schedule } from '../../types/Schedule';
import { fetchSchedules } from '../../api/operatorApi';
import { formatTime } from '../../utils/FormateDateTime';

export const ScheduleManagementPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  // const [buses, setBuses] = useState<BusData[]>([]);
  // const [routes, setRoutes] = useState<RouteData[]>([]);

  const id = useSelector((state: RootState) => state.user.id)


  useEffect(() => {
    const loadSchedules = async () => {
      try {
        const data = await fetchSchedules(id);
  
        setSchedules(data.data)
        // const [busesData, routesData] = await Promise.all([
        //   fetchAllBuses(ownerId),
        //   fetchAllRoutes(ownerId),    
        // ]);
        // setBuses(busesData.buses);
        // setRoutes(routesData.routes);
    
      } catch (error) {
        console.error("Error fetching Schedules:", error);
      }
    };

    loadSchedules();
  }, []);

 

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Schedule Management</h1>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 gap-4 p-6">
          {schedules.map(schedule => (
            <div key={schedule.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                {/* <div>
                  <h3 className="font-semibold text-lg">{schedule.}</h3>
                  <p className="text-gray-500">Bus: {schedule.busNumber}</p>
                </div> */}
                <span className={`px-3 py-1 rounded-full text-sm ${schedule.status === 'On Time'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                  }`}>
                  {schedule.status}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Departure</p>
                    <p className="font-medium">{formatTime(schedule.startTime)}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Arrival</p>
                    <p className="font-medium">{formatTime(schedule.endTime)}</p>
                  </div>
                </div>
              </div>

              {/* <div className="mt-4 flex items-center">
                <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">Driver: {schedule.driver}</span>
              </div> */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};