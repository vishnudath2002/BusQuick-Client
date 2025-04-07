import React, { useEffect, useState } from 'react';
import { BusLayout } from '../../components/user/seats/BusLayout';
import { Bus, CreditCard, Users } from 'lucide-react';
import Header from '../../components/user/layouts/Header';
import { changeBookStatus, changeSeatStatus, getSeats } from '../../api/userApi';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { bookSeats, checkout, payAmount } from '../../api/userApi';
import toast from 'react-hot-toast';

interface RootState {
  user: {
    id: string;
  };
}

export const BusBooking: React.FC = () => {
  const userId = useSelector((state: RootState) => state.user.id)
  const location = useLocation();
  const navigate = useNavigate()
  const { busId, price, date, source , destination ,  dropStops, pickupStops, scheduleId ,  arrivalTime , departureTime } = location.state || {};

  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [bookingId, setBookingId] = useState('');


  const totalPrice = selectedSeats.length * price;

  const [formData, setFormData] = useState({
    pickupStop: '',
    dropStop: '',
    userId,
    scheduleId,
    busId,
    name: '',
    email: '',
    phone: '',
    age: '',
    address: '',
    couponCode: ''
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleSeatSelect = (SeatNumber: string) => {
    setSelectedSeats((prev) =>
      prev.includes(SeatNumber)
        ? prev.filter((num) => num !== SeatNumber)
        : [...prev, SeatNumber]
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    setValidationErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};


    // Pickup Stop Validation
    if (!formData.pickupStop?.trim()) {
      errors.pickupStop = "Pickup stop is required";
    }
    
    // Drop Stop Validation
    if (!formData.dropStop?.trim()) {
      errors.dropStop = "Drop stop is required";
    }
    
    // Name Validation
    if (!formData.name?.trim()) {
      errors.name = "Full name is required";
    } else if (formData.name.length < 3) {
      errors.name = "Name must be at least 3 characters";
    }
    
    // Email Validation
    if (!formData.email?.trim()) {
      errors.email = "Email is required";
    } else if (!/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
      errors.email = "Invalid email format";
    }
    
    // Phone Validation
    if (!formData.phone?.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      errors.phone = "Phone number must be exactly 10 digits";
    }
    
    // Age Validation
    if (!formData.age?.trim()) {
      errors.age = "Age is required";
    } else {
      const age = parseInt(formData.age, 10);
      if (isNaN(age) || age <= 0 || age > 120) {
        errors.age = "Enter a valid age (1-120)";
      }
    }
    
    // Address Validation
    if (!formData.address?.trim()) {
      errors.address = "Address is required";
    } else if (formData.address.length < 5) {
      errors.address = "Address must be at least 5 characters";
    }
    

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProceedToPayment = () => {
    setShowForm(true);
  };

  const handlePaymentMethodSelect = (method: string) => {
    setSelectedPaymentMethod(method);
  };

  const handleBook = async () => {

    const con = confirm('Once you click "Confirm Booking," you cannot go back to edit your booking. However, you can edit it after making the payment.')
    if(!con){
      return;
    }

    if (!validateForm()) {
      toast.error("Please correct the errors before submitting.");
      return;
    }

    console.log('Booking with data:', formData);
    const {
      pickupStop,
      dropStop,
      userId,
      scheduleId,
      busId,
      name,
      email,
      phone,
      age,
      address,
      couponCode
    } = formData;

 

    const response = await bookSeats(
      name,
      email,
      phone,
      age,
      busId,
      userId,
      scheduleId,
      selectedSeats,
      source,
      destination,
      date,
      arrivalTime,
      departureTime,
      dropStop,
      pickupStop,
      selectedSeats.length,
      price,
      totalPrice.toString(),
      address,
      couponCode,
    );

 
    if (response.success) {
    
      if (response.data) {
        setBookingId(response.data);
      }
    
      setShowPaymentOptions(true);

    } else {
      toast.error(response.message);
    }
    
  };

  const handlePaymentSubmit = async () => {
    try {
      const res = await checkout("ticket", "description", totalPrice.toString(), "1")

      if (res.success) {
     
        const width = 450;
        const height = 600;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;

     
        const stripeWindow = window.open(
          res.checkoutUrl,
          'StripeCheckout',
          `width=${width},height=${height},left=${left},top=${top},location=yes,menubar=no,toolbar=no,status=no`
        );
        
      

        const checkPopup = setInterval(() => {
          if (stripeWindow?.closed) {
            clearInterval(checkPopup);
            
            handlePaymentCompletion(stripeWindow?.location.href);

          }
        }, 500);
      }

   

    } catch (error) {
      toast.error('Payment failed. Please try again.');
      console.error('Payment error:', error);
    }
  };


  const handlePaymentCompletion = async (payStatus: string | undefined) => {
    try {
     
      if (payStatus?.includes("checkout-success")) {
        const res = await payAmount(totalPrice.toString(), bookingId);
  
        if (res.success) {
       
  
          setFormData({
            pickupStop: "",
            dropStop: "",
            userId: "",
            scheduleId: "",
            busId: "",
            name: "",
            email: "",
            phone: "",
            age: "",
            address: "",
            couponCode: "",
          });
  
          setShowPaymentOptions(false);
          setShowForm(false);
          updateSeatAvailabilityAndBooking();
        } else if(payStatus?.includes("checkout-cancelled")){
         console.log("payment failed")
        } else{
          toast.error("Payment verification failed. Please contact support.");
        }
      }
    } catch (error) {
      toast.error("Error verifying payment. Please check your booking status.");
      console.error("Payment verification error:", error);
    }
  };


  const updateSeatAvailabilityAndBooking = async () => {

    const res1 = await changeBookStatus(bookingId, "success");

    if(res1.success){
      const res2 = await changeSeatStatus(busId, date, selectedSeats, scheduleId, false)
      console.log(res2)
      setSelectedSeats([]);
      navigate('/home');
    }

  
  }


  useEffect(() => {
    const fetchSeats = async () => {
      const response = await getSeats(busId, date);
      setSeats(response.seats);
    };
    fetchSeats();
  }, [totalPrice, busId, date, dropStops, pickupStops]);
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">

      <Header />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <h1 className="text-4xl font-bold text-gray-800">
              {showPaymentOptions ? 'Select Payment Method' :
                showForm ? 'Complete Your Booking' : 'Select Your Seats'}
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            {showPaymentOptions ? 'Choose your preferred payment method to complete the transaction' :
              showForm ? 'Please fill in your details to complete the booking' :
                'Choose your preferred seats for a comfortable journey'}
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr,400px] gap-8">
          <div className="space-y-8">
            {showPaymentOptions ? (
              <div className="bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-xl border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment Options</h2>
                <div className="space-y-4">
                  <div
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${selectedPaymentMethod === 'creditCard'
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-300'
                      }`}
                    onClick={() => handlePaymentMethodSelect('creditCard')}
                  >
                    <div className="flex items-center space-x-3">
                      <CreditCard className="h-6 w-6 text-indigo-600" />
                      <div>
                        <p className="font-semibold text-gray-800">Credit/Debit Card</p>
                        <p className="text-sm text-gray-600">Pay securely with your card</p>
                      </div>
                    </div>
                  </div>

                 {/* {* check in note pad (fumigation)* you can get ohter code } */}


                </div>
              </div>
            ) : !showForm ? (
              <BusLayout
                busId={busId}
                seats={seats}
                selectedSeats={selectedSeats}
                onSeatSelect={handleSeatSelect}
              />
            ) : (
              <div className="bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-xl border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Passenger Details</h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Pickup Stop
                      </label>
                      <select
                        name="pickupStop"
                        value={formData.pickupStop}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 rounded-lg border ${validationErrors.pickupStop ? 'border-red-500' : 'border-gray-300'
                        } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                      >
                        <option value="">Select Pickup Stop</option>
                        {pickupStops?.map((stop: string) => (
                          <option key={stop} value={stop}>{stop}</option>
                        ))}
                      </select>
                      {validationErrors.pickupStop && <p className="text-red-500 text-sm">{validationErrors.pickupStop}</p>}
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Drop Stop
                      </label>
                      <select
                        name="dropStop"
                        value={formData.dropStop}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 rounded-lg border ${validationErrors.dropStop ? 'border-red-500' : 'border-gray-300'
                        } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                      >
                        <option value="">Select Drop Stop</option>
                        {dropStops?.map((stop: string, index: string) => (
                          <option key={index} value={stop}>{stop}</option>
                        ))}
                      </select>
                      {validationErrors.dropStop && <p className="text-red-500 text-sm">{validationErrors.dropStop}</p>}
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 rounded-lg border ${validationErrors.name ? 'border-red-500' : 'border-gray-300'
                          } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                        placeholder="Enter your full name"
                      />
                      {validationErrors.name && <p className="text-red-500 text-sm">{validationErrors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Age
                      </label>
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 rounded-lg border ${validationErrors.age ? 'border-red-500' : 'border-gray-300'
                        } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                        placeholder="Enter your age"
                      />
                      {validationErrors.age && <p className="text-red-500 text-sm">{validationErrors.age}</p>}
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 rounded-lg border ${validationErrors.email ? 'border-red-500' : 'border-gray-300'
                        } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                        placeholder="Enter your email"
                      />
                      {validationErrors.email && <p className="text-red-500 text-sm">{validationErrors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 rounded-lg border ${validationErrors.phone ? 'border-red-500' : 'border-gray-300'
                        } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                        placeholder="Enter your phone number"
                      />
                      {validationErrors.phone && <p className="text-red-500 text-sm">{validationErrors.phone}</p>}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-gray-700 font-medium mb-2">
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 rounded-lg border ${validationErrors.address ? 'border-red-500' : 'border-gray-300'
                        } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                        placeholder="Enter your address"
                      />
                      {validationErrors.address && <p className="text-red-500 text-sm">{validationErrors.address}</p>}
                    </div>

                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-xl border border-gray-100 h-fit sticky top-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Booking Summary</h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <Users className="w-6 h-6 text-indigo-600 mt-1" />
                <div>
                  <p className="text-gray-600 font-medium">Selected Seats</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {selectedSeats.length > 0
                      ? selectedSeats.sort().join(', ')
                      : 'None'}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Bus className="w-6 h-6 text-indigo-600 mt-1" />
                <div>
                  <p className="text-gray-600 font-medium">Number of Seats</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {selectedSeats.length}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <CreditCard className="w-6 h-6 text-indigo-600 mt-1" />
                <div>
                  <p className="text-gray-600 font-medium">Price per Seat</p>
                  <p className="text-lg font-semibold text-gray-800">₹{price}</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6 mt-6">
                <div className="flex justify-between items-center mb-6">
                  <p className="text-xl font-bold text-gray-800">Total Price</p>
                  <p className="text-3xl font-bold text-indigo-600">₹{totalPrice}</p>
                </div>

                {showPaymentOptions ? (
                  <button
                    onClick={handlePaymentSubmit}
                    className={`w-full py-4 px-6 rounded-2xl text-white font-semibold text-lg
                      ${selectedPaymentMethod
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                        : 'bg-gray-300 cursor-not-allowed'
                      }
                      transition-all duration-300`}
                    disabled={!selectedPaymentMethod}
                  >
                    Pay Now
                  </button>
                ) : !showForm ? (
                  <button
                    onClick={handleProceedToPayment}
                    className={`w-full py-4 px-6 rounded-2xl text-white font-semibold text-lg
                      ${selectedSeats.length > 0
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                        : 'bg-gray-300 cursor-not-allowed'
                      }
                      transition-all duration-300`}
                    disabled={selectedSeats.length === 0}
                  >
                    Proceed to Booking
                  </button>
                ) : (
                  <button
                    onClick={handleBook}
                    className="w-full py-4 px-6 rounded-2xl text-white font-semibold text-lg
                      bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 
                      shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                  >
                    Confirm Booking
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusBooking;