import React from 'react';
import { Clock, Users, Bus } from 'lucide-react';
import { formatDate , formatTime , calculateDuration , calculateEndDate } from '../../../utils/FormateDateTime';

interface Bus {
  bus: {
    id: string;
    name: string;
    seatsAvailable: string;
    type: string;
  };
  route: {
    dropStops: string[];
    pickupStops: string[];
  }
  date: string;
  startTime: string,
  endTime: string,
  price: string;
  isActive: boolean;
  availableSeats: number;
  scheduleId: string;
}

interface SearchResultsProps {
  buses: Bus[];
  onBookNow: (busId: string,price: string, dropStops: string[], pickupStops: string[],scheduleId: string,  arrivalTime: string, departureTime: string) => void;
}



const SearchResults: React.FC<SearchResultsProps> = ({ buses, onBookNow }) => {
  if (!Array.isArray(buses)) {
    return <div>No buses available.</div>;
  }

  return (
    <div className="space-y-4">
      {buses.map((bus) => (
        <div
          key={bus.scheduleId}
          className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200"
        >
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            {/* Operator Info */}
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-800">{bus.bus.name}</h3>
              <p className="text-sm text-gray-500">{bus.bus.type}</p>
            </div>

            {/* Time Info */}
            <div className="flex-1">
              <div className="flex items-center gap-4">
                {/* Departure Time */}
                <div className="text-center">
                  <p className="text-lg font-semibold">{formatTime(bus.startTime)}</p>
                  <p className="text-lg font-semibold">{formatDate(bus.date)}</p>
                  <p className="text-sm text-gray-500">Departure</p>
                </div>

                {/* Duration Line */}
                <div className="flex-1 flex flex-col items-center">
                  <div className="w-full border-t-2 border-dashed border-gray-300 relative">
                    <Clock className="w-4 h-4 text-gray-400 absolute -top-2 left-1/2 -translate-x-1/2" />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{calculateDuration(bus.startTime, bus.endTime)}</p>
                </div>

                {/* Arrival Time */}
                <div className="text-center">
                  <p className="text-lg font-semibold">{formatTime(bus.endTime)}</p>
                  <p className="text-lg font-semibold">{calculateEndDate(bus.date,bus.startTime,bus.endTime)}</p>
                  <p className="text-sm text-gray-500">Arrival</p>
                </div>
              </div>
            </div>

            {/* Seats Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-600">{bus.availableSeats} seats available</span>
              </div>
            </div>

            {/* Price and Book */}
            <div className="flex-1 text-right">
              <p className="text-2xl font-bold text-blue-600">₹{bus.price}</p>
              <button
                onClick={() => onBookNow(bus.bus.id , bus.price , bus.route.dropStops , bus.route.pickupStops , bus.scheduleId, bus.endTime, bus.startTime )}
                className="mt-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 ml-auto"
              >
                <Bus className="w-4 h-4" />
                Book Now
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchResults;