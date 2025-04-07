import { useEffect, useState } from "react";
import { getLayout, deleteLayout } from "../../api/ownerApi";
import toast from "react-hot-toast";

const SeatList = ({ busId }: { busId: string }) => {
  const [layout, setLayout] = useState<{ row: number; column: number; seatNumber: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchLayout = async () => {
      setIsLoading(true);
      try {
        const response = await getLayout(busId);
        setLayout(Array.isArray(response.layouts) ? response.layouts : []);
      } catch (error) {
        console.error("Error fetching layout:", error);
        setLayout([]);
        toast.error("Failed to load seat layout");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (busId) {
      fetchLayout();
    }
  }, [busId]);

  const handleDeleteLayout = async () => {
    setIsDeleting(true);
    try {
      const res = await deleteLayout(busId);
      if (res.success) {
        toast.success(res.message);
        setLayout([]);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete layout");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-2 text-gray-600">Loading seat layout...</span>
      </div>
    );
  }

  if (layout.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg shadow-sm">
        <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
        </svg>
        <p className="mt-2 text-lg font-medium text-gray-600">No seat layout available</p>
        <p className="text-sm text-gray-500">Create a layout to arrange seats for this bus</p>
      </div>
    );
  }

  // Convert layout data to a 2D grid
  const rows = Math.max(...layout.map((seat) => seat.row), 0) + 1;
  const cols = Math.max(...layout.map((seat) => seat.column), 0) + 1;
  const grid = Array.from({ length: rows }, () => Array(cols).fill(null));
  
  layout.forEach((seat) => {
    grid[seat.row][seat.column] = seat.seatNumber;
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Bus Seat Layout</h3>
      <div className="overflow-auto pb-4 mb-4">
        <div 
          className="grid gap-2"
          style={{ 
            display: "grid", 
            gridTemplateColumns: `repeat(${cols}, minmax(50px, 1fr))`,
            width: "fit-content",
            margin: "0 auto"
          }}
        >
          {grid.map((row, rowIndex) =>
            row.map((seat, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`
                  flex items-center justify-center
                  rounded-md transition-all duration-200
                  ${seat !== null 
                    ? "bg-blue-500 text-white shadow-sm hover:bg-blue-600" 
                    : "bg-gray-100 text-transparent"}
                `}
                style={{ 
                  width: "50px", 
                  height: "50px",
                  transform: seat !== null ? "scale(1)" : "scale(0.9)",
                }}
              >
                {seat !== null ? seat : ""}
              </div>
            ))
          )}
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          onClick={handleDeleteLayout}
          disabled={isDeleting}
          className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDeleting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Deleting...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
              Delete Layout
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SeatList;