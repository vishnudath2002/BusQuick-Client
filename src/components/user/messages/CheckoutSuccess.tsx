
import { CheckCircle } from 'lucide-react';

function CheckoutSuccess() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-4 md:p-6 lg:p-8">
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-12 text-center">
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center animate-[ping_1s_ease-in-out]">
              <CheckCircle className="w-20 h-20 text-white/30" />
            </div>
            <CheckCircle className="w-20 h-20 text-white mx-auto mb-6" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">Booking Confirmed!</h1>
          <p className="text-blue-100 text-lg">Your tickets have been successfully booked</p>
        </div>

        {/* Message Section */}
        <div className="p-8">
          <div className="text-center space-y-6">
            <p className="text-gray-600 text-lg">
              You can download your tickets from your booking history at any time.
            </p>
           
          </div>
        </div>
      </div>

      
    </div>
  </div>
  );
}

export default CheckoutSuccess;