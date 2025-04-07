import React, { useState, useEffect } from 'react';
import SearchResults from '../../components/user/search/SearchResult';
import { MapPin, Calendar, Search, SlidersHorizontal, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { browseBusesByLocation, searchDestinations, searchSources } from '../../api/userApi';
import { Bus } from '../../types/Bus';
import toast from 'react-hot-toast';
import Header from '../../components/user/layouts/Header';

interface SearchParams {
  fromCity: string;
  toCity: string;
  date: string;
}

type SortOption = 'price_low' | 'price_high' | 'departure_early' | 'departure_late';

interface Filters {
  busType: {
    sleeper: boolean;
    seater: boolean;
  };
  amenities: {
    ac: boolean;
    nonAc: boolean;
  };
  departureTime: string[];
  arrivalTime: string[];
  pickupPoints: string[];
  dropPoints: string[];
}

const timeSlots = ['6 AM - 11 AM', '11 AM - 6 PM', '6 PM - 11 PM'];

const SearchResultsPage: React.FC = () => {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>('departure_early');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    busType: { sleeper: false, seater: false },
    amenities: { ac: false, nonAc: false },
    departureTime: [],
    arrivalTime: [],
    pickupPoints: [],
    dropPoints: []
  });

  const [fromSuggestions, setFromSuggestions] = useState<string[]>([]);
  const [toSuggestions, setToSuggestions] = useState<string[]>([]);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);

  const [searchParams, setSearchParams] = useState<SearchParams>({
    fromCity: '',
    toCity: '',
    date: new Date().toISOString().split('T')[0],
  });

  const location = useLocation();
  const { from, to, dateCome } = location.state || {};
  const navigate = useNavigate();

  useEffect(() => {
    if (from && to && dateCome) {
      setSearchParams(prev => ({
        ...prev,
        fromCity: from,
        toCity: to,
        date: dateCome
      }));
    }
  }, [from, to, dateCome]);

  const handleFromCitySearch = async (query: string) => {
    if (query.length < 2) {
      setFromSuggestions([]);
      return;
    }
  
    try {
      const sources = await searchSources(query);
      setFromSuggestions(sources.data || []);
      setShowFromSuggestions(true);
    } catch (error) {
      console.error("Error fetching source cities:", error);
      setFromSuggestions([]);
    }
  };
  
  const handleToCitySearch = async (query: string) => {
    if (query.length < 2) {
      setToSuggestions([]);
      return;
    }
  
    try {
      const destinations = await searchDestinations(query);
      setToSuggestions(destinations.data || []);
      setShowToSuggestions(true);
    } catch (error) {
      console.error("Error fetching destinations:", error);
      setToSuggestions([]);
    }
  };
  
  const handleSearch = async () => {
    setLoading(true);
    try {
      if (searchParams.fromCity && searchParams.toCity) {
        const busData = await browseBusesByLocation(searchParams.fromCity, searchParams.toCity, searchParams.date);
        console.log("busdata", busData);
        if (busData.success) {
          setBuses(busData.schedules);
          toast.success(busData.message);
        } else {
          setBuses([]);
          toast.error(busData.message);
        }
      }
    } catch (error) {
      console.error('Error fetching bus data:', error);
      setBuses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchParams.fromCity && searchParams.toCity && searchParams.date) {
      handleSearch();
    }
  }, [searchParams]);

  const toggleFilter = (category: keyof Filters['busType'] | keyof Filters['amenities']) => {
    if (category in filters.busType) {
      setFilters(prev => ({
        ...prev,
        busType: {
          ...prev.busType,
          [category]: !prev.busType[category as keyof Filters['busType']]
        }
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        amenities: {
          ...prev.amenities,
          [category]: !prev.amenities[category as keyof Filters['amenities']]
        }
      }));
    }
  };

  const toggleTimeFilter = (time: string, type: 'departureTime' | 'arrivalTime') => {
    setFilters(prev => ({
      ...prev,
      [type]: prev[type].includes(time)
        ? prev[type].filter(t => t !== time)
        : [...prev[type], time]
    }));
  };

  // Helper function to check if a time falls within a specific time slot
  const isInTimeSlot = (timeString: string, slot: string): boolean => {
    const date = new Date(timeString);
    const hour = date.getHours();
    
    if (slot === '6 AM - 11 AM' && hour >= 6 && hour < 11) return true;
    if (slot === '11 AM - 6 PM' && hour >= 11 && hour < 18) return true;
    if (slot === '6 PM - 11 PM' && hour >= 18 && hour < 23) return true;
    
    return false;
  };

  const filteredBuses = buses.filter(bus => {
    // Bus Type Filter (Sleeper/Seater)
    if (filters.busType.sleeper || filters.busType.seater) {
      const type = bus.bus.type.toLowerCase();
      if (
        (filters.busType.sleeper && !type.includes('sleeper')) ||
        (filters.busType.seater && !type.includes('seater'))
      ) {
        return false;
      }
    }

    // AC/Non-AC Filter
    if (filters.amenities.ac || filters.amenities.nonAc) {
      const isAC = bus.bus.type.toLowerCase().includes('ac');
      if (
        (filters.amenities.ac && !isAC) ||
        (filters.amenities.nonAc && isAC)
      ) {
        return false;
      }
    }

    // Departure Time Filter
    if (filters.departureTime.length > 0) {
      const matchesAnyTimeSlot = filters.departureTime.some(slot => 
        isInTimeSlot(bus.startTime, slot)
      );
      if (!matchesAnyTimeSlot) return false;
    }

    // Arrival Time Filter
    if (filters.arrivalTime.length > 0) {
      const matchesAnyTimeSlot = filters.arrivalTime.some(slot => 
        isInTimeSlot(bus.endTime, slot)
      );
      if (!matchesAnyTimeSlot) return false;
    }

    return true;
  });

  const sortedBuses = [...filteredBuses].sort((a, b) => {
    switch (sortBy) {
      case 'price_low':
        return parseInt(a.price) - parseInt(b.price);
      case 'price_high':
        return parseInt(b.price) - parseInt(a.price);
      case 'departure_early':
        return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
      case 'departure_late':
        return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <Header />
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchParams.fromCity}
                onChange={async (e) => {
                  setSearchParams({ ...searchParams, fromCity: e.target.value });
                  await handleFromCitySearch(e.target.value);
                }}
                placeholder="From"
                className="pl-12 w-full rounded-lg border border-gray-200 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-50"
                onFocus={() => setShowFromSuggestions(true)}
                onBlur={() => setTimeout(() => setShowFromSuggestions(false), 200)}
              />
              {showFromSuggestions && fromSuggestions.length > 0 && (
                <ul className="absolute z-10 bg-white border w-full mt-1 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {fromSuggestions.map((source, index) => (
                    <li
                      key={index}
                      className="p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                      onMouseDown={() => {
                        setSearchParams({ ...searchParams, fromCity: source });
                        setShowFromSuggestions(false);
                      }}
                    >
                      {source}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="relative flex-1 min-w-[200px]">
              <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchParams.toCity}
                onChange={async (e) => {
                  setSearchParams({ ...searchParams, toCity: e.target.value });
                  await handleToCitySearch(e.target.value);
                }}
                placeholder="To"
                className="pl-12 w-full rounded-lg border border-gray-200 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-50"
                onFocus={() => setShowToSuggestions(true)}
                onBlur={() => setTimeout(() => setShowToSuggestions(false), 200)}
              />
              {showToSuggestions && toSuggestions.length > 0 && (
                <ul className="absolute z-10 bg-white border w-full mt-1 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {toSuggestions.map((destination, index) => (
                    <li
                      key={index}
                      className="p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                      onMouseDown={() => {
                        setSearchParams({ ...searchParams, toCity: destination });
                        setShowToSuggestions(false);
                      }}
                    >
                      {destination}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="relative min-w-[200px]">
              <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                value={searchParams.date}
                onChange={(e) => setSearchParams({ ...searchParams, date: e.target.value })}
                className="pl-12 w-full rounded-lg border border-gray-200 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-50"
              />
            </div>

            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <Search className="w-4 h-4" />
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Results Header */}
        <div className="flex flex-wrap items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden bg-white px-4 py-2 rounded-lg border shadow-sm flex items-center gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
            <p className="text-gray-600">
              <span className="font-semibold">{sortedBuses.length}</span> buses found
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-white border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="departure_early">Departure: Earliest</option>
              <option value="departure_late">Departure: Latest</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div
            className={`
              md:w-64 bg-white rounded-lg shadow-md p-6 space-y-6
              fixed md:relative top-0 left-0 h-full md:h-auto w-full md:w-64
              transform ${showFilters ? 'translate-x-0' : '-translate-x-full'} 
              md:transform-none transition-transform duration-200 ease-in-out
              z-30 overflow-y-auto
            `}
          >
            <div className="flex justify-between items-center md:hidden">
              <h3 className="font-semibold">Filters</h3>
              <button onClick={() => setShowFilters(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Bus Type */}
            <div>
              <h3 className="font-semibold mb-3">Bus Type</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.busType.sleeper}
                    onChange={() => toggleFilter('sleeper')}
                    className="rounded text-blue-600"
                  />
                  Sleeper
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.busType.seater}
                    onChange={() => toggleFilter('seater')}
                    className="rounded text-blue-600"
                  />
                  Seater
                </label>
              </div>
            </div>

            {/* Departure Time */}
            <div>
              <h3 className="font-semibold mb-3">Departure Time</h3>
              <div className="space-y-2">
                {timeSlots.map((time) => (
                  <label key={time} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.departureTime.includes(time)}
                      onChange={() => toggleTimeFilter(time, 'departureTime')}
                      className="rounded text-blue-600"
                    />
                    {time}
                  </label>
                ))}
              </div>
            </div>

            {/* Arrival Time */}
            <div>
              <h3 className="font-semibold mb-3">Arrival Time</h3>
              <div className="space-y-2">
                {timeSlots.map((time) => (
                  <label key={time} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.arrivalTime.includes(time)}
                      onChange={() => toggleTimeFilter(time, 'arrivalTime')}
                      className="rounded text-blue-600"
                    />
                    {time}
                  </label>
                ))}
              </div>
            </div>

            {/* Clear Filters Button */}
            <button
              onClick={() => setFilters({
                busType: { sleeper: false, seater: false },
                amenities: { ac: false, nonAc: false },
                departureTime: [],
                arrivalTime: [],
                pickupPoints: [],
                dropPoints: []
              })}
              className="w-full mt-4 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              Clear All Filters
            </button>
          </div>

          {/* Results List */}
          <div className="flex-1">
            <SearchResults 
              buses={sortedBuses} 
              onBookNow={(busId, price, dropStops, pickupStops, scheduleId ,   arrivalTime, departureTime ) => 
                navigate("/seatbook", {
                  state: { 
                    busId, 
                    price, 
                    date: searchParams.date, 
                    source: searchParams.fromCity,
                    destination: searchParams.toCity,
                    dropStops, 
                    pickupStops, 
                    scheduleId ,
                    arrivalTime,
                    departureTime
                  },
                })
              }
            />
          </div>
        </div>
      </div>

      {/* Overlay for mobile filters */}
      {showFilters && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setShowFilters(false)}
        />
      )}
    </div>
  );
};

export default SearchResultsPage;