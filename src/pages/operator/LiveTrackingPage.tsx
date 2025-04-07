import React, { useState } from 'react';
import { MapPin, Navigation, AlertCircle, Clock } from 'lucide-react';

export const LiveTrackingPage: React.FC = () => {
  const [selectedBus, setSelectedBus] = useState('');

  // Mock data for demonstration
  const buses = [
    {
      id: 'BUS001',
      number: 'KA-01-JS-1234',
      route: 'Bangalore - Mumbai',
      driver: 'John Smith',
      status: 'On Route',
      location: 'Pune',
      nextStop: 'Mumbai',
      eta: '2 hours',
      speed: '65 km/h',
      lastUpdate: '2 mins ago'
    },
    {
      id: 'BUS002',
      number: 'KA-01-JS-5678',
      route: 'Bangalore - Chennai',
      driver: 'Mike Johnson',
      status: 'Delayed',
      location: 'Hosur',
      nextStop: 'Chennai',
      eta: '3 hours',
      speed: '55 km/h',
      lastUpdate: '5 mins ago'
    },
    {
      id: 'BUS003',
      number: 'KA-01-JS-9012',
      route: 'Bangalore - Hyderabad',
      driver: 'David Wilson',
      status: 'On Time',
      location: 'Kurnool',
      nextStop: 'Hyderabad',
      eta: '4 hours',
      speed: '70 km/h',
      lastUpdate: '1 min ago'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Live Bus Tracking</h1>
        <select
          value={selectedBus}
          onChange={(e) => setSelectedBus(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Buses</option>
          {buses.map(bus => (
            <option key={bus.id} value={bus.id}>{bus.number} - {bus.route}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bus List */}
        <div className="lg:col-span-1 space-y-4">
          {buses
            .filter(bus => !selectedBus || bus.id === selectedBus)
            .map(bus => (
              <div key={bus.id} className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-800">{bus.number}</h3>
                    <p className="text-sm text-gray-500">{bus.route}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    bus.status === 'On Time' ? 'bg-green-100 text-green-800' :
                    bus.status === 'Delayed' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {bus.status}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-xs text-gray-500">Current Location</p>
                      <p className="text-sm font-medium">{bus.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Navigation className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-xs text-gray-500">Next Stop</p>
                      <p className="text-sm font-medium">{bus.nextStop}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-xs text-gray-500">ETA</p>
                      <p className="text-sm font-medium">{bus.eta}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-xs text-gray-500">Last Update</p>
                      <p className="text-sm font-medium">{bus.lastUpdate}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-sm text-gray-600">{bus.speed}</span>
                    </div>
                    <span className="text-sm text-gray-500">Driver: {bus.driver}</span>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Map View (Placeholder) */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-4">
          <div className="bg-gray-100 rounded-lg h-[600px] flex items-center justify-center">
            <p className="text-gray-500">Map View - Integration Required</p>
          </div>
        </div>
      </div>
    </div>
  );
};