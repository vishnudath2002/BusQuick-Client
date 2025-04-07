interface SeatProps {
  seatNumber: string;
  isBooked: boolean;
}

export const Seat: React.FC<SeatProps> = ({ seatNumber, isBooked }) => {
  const getSeatColor = () => {
    return isBooked 
      ? "bg-indigo-500 hover:bg-indigo-600 shadow-indigo-200" // Booked Seat (Indigo)
      : "bg-gray-300 text-gray-700 cursor-not-allowed"; // Not Booked Seat (Gray)
  };

  return (
    <button
      disabled={isBooked} // Disable only if the seat is booked
      className={`
        ${getSeatColor()} 
        w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center 
        font-semibold transition-all duration-300 shadow-lg hover:shadow-xl
      `}
    >
      {seatNumber}
    </button>
  );
};
