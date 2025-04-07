
import { XCircle, RefreshCcw, MessageCircle } from 'lucide-react';


function CheckoutCancelled() {
  return (
  



<div className="min-h-screen bg-gradient-to-br from-rose-50 to-red-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-rose-600 to-red-600 px-6 py-12 text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center animate-[shake_0.5s_ease-in-out]">
                <XCircle className="w-20 h-20 text-white/30" />
              </div>
              <XCircle className="w-20 h-20 text-white mx-auto mb-6" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-3">Booking Failed</h1>
            <p className="text-rose-100 text-lg">We couldn't complete your booking</p>
          </div>

          {/* Message Section */}
          <div className="p-8">
            <div className="text-center space-y-6">
              <div className="bg-rose-50 rounded-xl p-4 mb-4">
                <p className="text-gray-800 text-lg mb-2">
                  Don't worry! No payment has been processed.
                </p>
                <p className="text-gray-600">
                  This might have happened due to high demand or a temporary system issue.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  className="flex-1 inline-flex items-center justify-center bg-rose-600 text-white py-4 px-6 rounded-xl font-medium hover:bg-rose-700 transition-colors group"
                  onClick={() => window.location.reload()}
                >
                  <RefreshCcw className="w-5 h-5 mr-2 group-hover:animate-spin" />
                  Try Again
                </button>
                <button 
                  className="flex-1 inline-flex items-center justify-center border-2 border-rose-200 text-rose-700 py-4 px-6 rounded-xl font-medium hover:bg-rose-50 transition-colors"
                  onClick={() => window.location.href = '/support'}
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>

       
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
}

export default CheckoutCancelled;