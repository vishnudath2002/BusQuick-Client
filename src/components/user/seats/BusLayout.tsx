// import React, { useEffect , useState } from 'react';
import { Seat } from './Seat';
import { ShipWheel } from 'lucide-react';
// import { getLayout } from '../../../api/ownerApi';

interface SeatType {
  SeatNumber: string;
  IsAvailable: boolean;
  availability: [{ isAvailable: boolean }];
}

// interface layouts {
//   busId: string;
//   column:number;
//   row:number;
//   seatNumber:number;
//   section: "left" | "right"
// }

interface BusLayoutProps {
  busId: string;
  seats: SeatType[];
  selectedSeats: string[];
  onSeatSelect: (SeatNumber: string) => void;
}

export const BusLayout: React.FC<BusLayoutProps> = ({
  busId,
  seats,
  selectedSeats,
  onSeatSelect,
}) => {
//  const [layouts,setLayouts] = useState<layouts[]>([]);

// useEffect(() => {
//   let isMounted = true; 

//   const fetchLayout = async () => {
//     try {
//       const res = await getLayout(busId);
//       if (isMounted)  setLayouts(res.layouts);
//       console.log("lay",layouts)
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   fetchLayout();
 
//   return () => {
//     isMounted = false; // Cleanup to prevent state updates on unmounted component
//   };
// }, [busId]);

  

// const rows = Math.max(...layouts.map((seat) => seat.row), 0) + 1;
// const cols = Math.max(...layouts.map((seat) => seat.column), 0) + 1;
// const grid = Array.from({ length: rows }, () => Array(cols).fill(null));

// layouts.forEach((seat) => {
//   grid[seat.row][seat.column] = seat.seatNumber;
// });


  const seatRows = [];
  for (let i = 0; i < seats.length; i += 5) {
    seatRows.push(seats.slice(i, i + 5));
  }
  
  
  

  return (
    <div className="bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-xl border border-gray-100">
      {/* Seat Legend */}
      <div className="mb-8 flex flex-wrap items-center justify-center gap-6">
        <div className="flex items-center px-4 py-2 bg-white rounded-full shadow-sm">
          <div className="w-4 h-4 bg-indigo-500 rounded-full mr-2"></div>
          <span className="text-sm font-medium text-gray-700">Available</span>
        </div>
        <div className="flex items-center px-4 py-2 bg-white rounded-full shadow-sm">
          <div className="w-4 h-4 bg-emerald-500 rounded-full mr-2"></div>
          <span className="text-sm font-medium text-gray-700">Selected</span>
        </div>
        <div className="flex items-center px-4 py-2 bg-white rounded-full shadow-sm">
          <div className="w-4 h-4 bg-gray-400 rounded-full mr-2"></div>
          <span className="text-sm font-medium text-gray-700">Booked</span>
        </div>
      </div>

      {/* Driver Section */}
      <div className="w-full flex justify-end mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-white rounded-2xl flex flex-col items-center justify-center shadow-lg border border-indigo-50">
          <ShipWheel className="w-8 h-8 text-indigo-600 mb-1" />
          <span className="text-xs font-medium text-indigo-600">Driver</span>
        </div>
      </div>
       
    
      {/* Seat Grid with Proper 2-aisle-3 Layout */}
      <div className="flex flex-col gap-3">
        {seatRows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-4 items-center justify-center">
       
             <div className="flex gap-2">
              <Seat
                key={row[0].SeatNumber}
                seatNumber={row[0].SeatNumber}
                isBooked={row[0].availability[0].isAvailable}
                isSelected={selectedSeats.includes(row[0].SeatNumber)}
                onSelect={onSeatSelect}
              />
              <Seat
                key={row[1].SeatNumber}
                seatNumber={row[1].SeatNumber}
                isBooked={row[1].availability[0].isAvailable}
                isSelected={selectedSeats.includes(row[1].SeatNumber)}
                onSelect={onSeatSelect}
              />
            </div>

                {/* Aisle space */}
            <div className="w-6"></div>

            {/* Right side seats (3 seats) */}
             <div className="flex gap-2">
              <Seat
                key={row[2].SeatNumber}
                seatNumber={row[2].SeatNumber}
                isBooked={row[2].availability[0].isAvailable}
                isSelected={selectedSeats.includes(row[2].SeatNumber)}
                onSelect={onSeatSelect}
              />
              <Seat
                key={row[3].SeatNumber}
                seatNumber={row[3].SeatNumber}
                isBooked={row[3].availability[0].isAvailable}
                isSelected={selectedSeats.includes(row[3].SeatNumber)}
                onSelect={onSeatSelect}
              />
              <Seat
                key={row[4].SeatNumber}
                seatNumber={row[4].SeatNumber}
                isBooked={row[4].availability[0].isAvailable}
                isSelected={selectedSeats.includes(row[4].SeatNumber)}
                onSelect={onSeatSelect}
              />
             </div> 
          </div> 
        ))} 
      </div>
    </div>
  );
};
