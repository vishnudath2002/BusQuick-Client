import React, { useState, useEffect } from "react";
import SeatList from "../../components/owner/SeatList";
import { fetchAllBuses, addLayout } from "../../api/ownerApi";
import { BusData } from "../../types/Schedule";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { toast } from "react-hot-toast";
import { Plus, X, Bus, ChevronDown, Layers, LayoutGrid } from "lucide-react";

export const SeatListPage: React.FC = () => {
  const [selectedBus, setSelectedBus] = useState("");
  const ownerId = useSelector((state: RootState) => state.user.id);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [busId, setBusId] = useState("");
  const [rows, setRows] = useState(4);
  const [buses, setBuses] = useState<BusData[]>([]);

  const [columnConfig, setColumnConfig] = useState<(number | "aisle")[][]>(
    Array(4).fill(null).map(() => [2, "aisle", 3])
  );

  useEffect(() => {
    const loadData = async () => {
      if (ownerId) {
        setIsLoading(true);
        try {
          const busesData = await fetchAllBuses(ownerId);
          setBuses(busesData.buses);
        } catch (error) {
          console.error("Failed to fetch data:", error);
          toast.error("Failed to fetch buses");
        } finally {
          setIsLoading(false);
        }
      }
    };
    loadData();
  }, [ownerId]);

  const handleRowChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rowCount = parseInt(e.target.value) || 0;
    setRows(rowCount);
    setColumnConfig(Array(rowCount).fill(null).map(() => [2, "aisle", 3]));
  };

  const updateColumnConfig = (
    rowIndex: number,
    colIndex: number,
    newValue: number | "aisle"
  ) => {
    setColumnConfig((prev) =>
      prev.map((row, rIdx) =>
        rIdx === rowIndex
          ? row.map((col, cIdx) => (cIdx === colIndex ? newValue : col))
          : row
      )
    );
  };

  const handleAddLayout = async () => {
    if (!busId) {
      toast.error("Please select a bus");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await addLayout(rows, columnConfig, busId);

      if (res.success) {
        toast.success(res.message);
        setShowModal(false);
        if (busId === selectedBus) {
          // Refresh the selected bus layout
          setSelectedBus("");
          setTimeout(() => setSelectedBus(busId), 100);
        } else {
          setSelectedBus(busId);
        }
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.error("Error creating layout:", error);
      toast.error("Failed to create layout");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Bus Seat Layouts</h1>
          <p className="text-gray-600 mt-2">Manage and configure seating arrangements for your fleet</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-100 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <button
                onClick={() => setShowModal(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors shadow-sm font-medium"
              >
                <Plus size={18} />
                Create New Layout
              </button>

              <div className="relative w-full sm:w-auto">
                <div className="relative">
                  <Bus className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <select
                    value={selectedBus}
                    onChange={(e) => setSelectedBus(e.target.value)}
                    className="w-full sm:w-64 pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                  >
                    <option value="">Select a bus to view</option>
                    {buses.map((bus) => (
                      <option key={bus.id} value={bus.id}>
                        {bus.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="flex justify-center items-center py-16">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-3 text-gray-600">Loading buses...</span>
              </div>
            ) : !selectedBus ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <LayoutGrid className="w-16 h-16 text-gray-300 mb-4" strokeWidth={1.5} />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Bus Selected</h3>
                <p className="text-gray-500 max-w-md">
                  Select a bus from the dropdown above to view or create a new layout to get started.
                </p>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4">
                <SeatList busId={selectedBus} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Layout Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white px-6 py-4 border-b flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Layers className="text-blue-500" size={22} />
                <h3 className="text-xl font-bold text-gray-800">Create New Bus Layout</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Bus
                  </label>
                  <div className="relative">
                    <Bus className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <select
                      value={busId}
                      onChange={(e) => setBusId(e.target.value)}
                      className="w-full pl-10 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                    >
                      <option value="">Select a bus</option>
                      {buses.map((bus) => (
                        <option key={bus.id} value={bus.id}>
                          {bus.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Rows
                  </label>
                  <input
                    type="number"
                    value={rows}
                    onChange={handleRowChange}
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="1"
                    max="20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Seat Configuration
                  </label>
                  <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                    {columnConfig.map((row, rowIndex) => (
                      <div key={rowIndex} className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                        <div className="bg-blue-100 text-blue-800 font-medium px-2.5 py-1 rounded text-sm min-w-8 text-center">
                          {rowIndex + 1}
                        </div>
                        {row.map((col, colIndex) => (
                          <div key={colIndex} className="flex-1">
                            <input
                              type="text"
                              value={col === "aisle" ? "aisle" : col}
                              onChange={(e) => {
                                const val = e.target.value.trim().toLowerCase();
                                const newValue = val === "aisle" ? "aisle" : (parseInt(val) || 0);
                                updateColumnConfig(rowIndex, colIndex, newValue);
                              }}
                              className="w-full bg-white px-3 py-2 border border-gray-300 rounded text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder={colIndex % 2 === 1 ? "aisle" : "seats"}
                            />
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Enter a number for seats or "aisle" for walkways
                  </p>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleAddLayout}
                disabled={isSubmitting || !busId}
                className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    Create Layout
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};