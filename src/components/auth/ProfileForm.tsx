import React, { useState } from 'react';
import { User, Phone, Lock, LogOut, List, Camera, Coins, ArrowUpRight, ArrowDownLeft, Plus } from 'lucide-react';
import { fetchBookings, updateBooking, getWallet, createWallet, addMoney, cancelTickets } from '../../api/userApi';
import { formatDate } from '../../utils/FormateDateTime';
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Booking } from '../../types/Booking';

import toast from "react-hot-toast";

interface ProfileFormProps {
  profileData: {
    name: string;
    phone: string;
    password: string;
    photo: string;
  };
  editingField: string | null;
  onEditField: (field: string) => void;
  onCancelEdit: () => void;
  onSaveField: (field: string, value: string, oldPassword?: string) => void;
  onLogout: () => void;
  onResetProfile: () => void;
}

const defaultProfileData = {
  name: "John Doe",
  phone: "1234567890",
  password: "••••••••",
  photo: "https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg"
};

const ProfileForm: React.FC<ProfileFormProps> = ({
  profileData = defaultProfileData,
  onSaveField = () => { },
  onLogout = () => { },
}) => {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [error, setError] = useState("");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [bookings, setBookings] = useState<any[]>([]);
  const [showBookings, setShowBookings] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [walletData, setWalletData] = useState<{ Balance: number; Transaction_History: any[] }>({
    Balance: 0,
    Transaction_History: [],
  });
  const [showWallet, setShowWallet] = useState(false);
  const [amount, setAmount] = useState<number>(0);
  const [showAddMoney, setShowAddMoney] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 3;

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFetchBookings = async () => {
    try {
      const res = await fetchBookings();
      setBookings(res.data || []);
      setShowBookings(true);
      setShowWallet(false)
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };


  const handleAddMoney = async () => {
    try {
      const res = await addMoney(amount);
      console.log(res.data)
      toast.success("money successfully added")
      setShowAddMoney(false);
      handleFetchWallet()
      
    } catch (error) {
      console.log(error)
    }
  };

  const handleFetchWallet = async () => {
    try {
      let res;

      try {
        res = await getWallet(); // Fetch wallet details from API
        
     

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        if (error.response && error.response.status === 404) {
          console.warn("Wallet not found (404). Creating a new wallet...");
          res = await createWallet();
        } else {
          throw error; // Rethrow other errors
        }
      }

      if (!res.success || !res.wallet) {
        toast.error(res.message || "Failed to fetch/create wallet.");
        return;
      }

      setWalletData({
        Balance: res.wallet.Balance ?? 0,
        Transaction_History: res.wallet.Transaction_History ?? [],
      });

      console.log("Wallet Data:", res.wallet);

      setShowWallet(true);
      setShowBookings(false); // Hide bookings if visible

    } catch (error) {
      console.error("Error handling wallet:", error);
      toast.error("Failed to load wallet data.");
    }
  };


  const handleEdit = (field: string) => {
    setEditingField(field);
    setEditValue(profileData[field as keyof typeof profileData] || "");
    setError("");
  };

  const validateInput = (field: string, value: string): boolean => {
    if (field === "name" && !/^[a-zA-Z\s]{3,}$/.test(value)) {
      setError("Name must be at least 3 letters long.");
      return false;
    }

    if (field === "phone" && !/^\d{10}$/.test(value)) {
      setError("Phone number must be exactly 10 digits.");
      return false;
    }

    if (field === "password" && value.length < 6) {
      setError("Password must be at least 6 characters long.");
      return false;
    }

    setError("");
    return true;
  };

  const handleSave = async () => {
    if (editingField) {
      if (!validateInput(editingField, editValue)) {
        return;
      }

      try {
        if (editingField === "password") {
          await onSaveField(editingField, editValue, oldPassword);
        } else {
          await onSaveField(editingField, editValue);
        }

        setEditingField(null);
        toast.success(`${editingField} updated successfully.`);
      } catch (error) {
        console.error("Error saving field:", error);
        toast.error("Failed to update.");
      }
    }
  };

  const handleBookingShowing = () => {
    setShowBookings(false);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEditBooking = async (booking: any) => {
    const { value: formValues } = await Swal.fire({
      title: "Edit Booking",
      html: `
        <label for="swal-name">Name:</label><br>
   <input id="swal-name" class="swal2-input" placeholder="Name" value="${booking.name}"><br>

<label for="swal-age">Age:</label><br>
<input id="swal-age" type="number" class="swal2-input" placeholder="Age" value="${booking.age}"><br>

<label for="swal-email">Email:</label><br>
<input id="swal-email" type="email" class="swal2-input" placeholder="Email" value="${booking.email}"><br>

<label for="swal-phone">Phone:</label><br>
<input id="swal-phone" type="tel" class="swal2-input" placeholder="Phone" value="${booking.phone}"><br>
      `,
      showCancelButton: true,
      confirmButtonText: "Save",
      cancelButtonText: "Cancel",
      preConfirm: () => {
        return {
          name: (document.getElementById("swal-name") as HTMLInputElement)?.value,
          age: Number((document.getElementById("swal-age") as HTMLInputElement)?.value),
          email: (document.getElementById("swal-email") as HTMLInputElement)?.value,
          phone: (document.getElementById("swal-phone") as HTMLInputElement)?.value,
        };
      },
    });

    if (formValues) {
      try {
        await updateBooking(booking.id, formValues);
        toast.success("Booking updated successfully!");
        handleFetchBookings();
      } catch (error) {
        console.error("Error when update booking:", error);
        toast.error("Failed to update booking.");
      }
    }
  };


  const openCancelModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setSelectedSeats([]); // Reset selected seats
    setIsModalOpen(true);
  };

  const handleSeatSelection = (seat: string) => {
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  

  const handleCancelSeats = async () => {
    if (!selectedBooking) return;
    try {
      const res = await cancelTickets(selectedBooking.id, selectedSeats);
      console.log(res);
      toast.success(res.message)
      setIsModalOpen(false);
      handleFetchBookings();
    } catch  (error) {
      console.error("Error when update booking:", error);
      toast.error("Failed to update booking.");
    }

  };


  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDownloadTicket = (booking: any) => {
    const ticketElement = document.createElement("div");
    ticketElement.innerHTML = `
      <div style="
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        min-height: 100vh;
        background: linear-gradient(to bottom right, #f0f4f8, #e5e9f0);
        padding: 20px;
        box-sizing: border-box;
      ">
        <div style="
          padding: 40px;
          font-family: 'Segoe UI', Roboto, -apple-system, sans-serif;
          width: 100%;
          max-width: 1000px; /* Increased from 800px to 1000px */
          border-radius: 16px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.12);
          background: white;
          color: #333;
        ">
          <!-- Header Section -->
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="
              color: #1a73e8;
              font-weight: 600;
              margin: 0;
              font-size: 36px; /* Increased from 32px */
            ">E-Ticket</h1>
            <p style="
              color: #5f6368;
              margin: 8px 0 0;
              font-size: 18px; /* Increased from 16px */
            ">Booking Reference: #${Math.floor(Math.random() * 100000)}</p>
          </div>
          
          <!-- Route Information Section -->
          <div style="
            background-color: #f0f4f8;
            border-radius: 12px;
            padding: 40px; /* Increased from 30px */
            margin-bottom: 40px; /* Increased from 30px */
          ">
            <div style="
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 30px; /* Increased from 25px */
            ">
              <div style="flex: 1; padding: 0 20px;">
                <p style="font-size: 28px; font-weight: 600; margin: 0;">${booking.source}</p>
                <p style="font-size: 18px; color: #5f6368; margin: 8px 0 0;">${booking.pickupStops}</p>
              </div>
              <div style="text-align: center; flex: 2;">
                <div style="
                  width: 100%;
                  height: 4px; /* Increased from 3px */
                  background: #dadce0;
                  position: relative;
                  margin: 0 20px;
                ">
                  <div style="
                    position: absolute;
                    top: -7px;
                    right: -7px;
                    width: 14px; /* Increased from 12px */
                    height: 14px; /* Increased from 12px */
                    border-radius: 50%;
                    background: #1a73e8;
                  "></div>
                </div>
              </div>
              <div style="text-align: right; flex: 1; padding: 0 20px;">
                <p style="font-size: 28px; font-weight: 600; margin: 0;">${booking.destination}</p>
                <p style="font-size: 18px; color: #5f6368; margin: 8px 0 0;">${booking.dropStops}</p>
              </div>
            </div>
            <div style="
              display: flex;
              justify-content: space-around; /* Changed from space-between for more spacing */
              border-top: 2px dashed #dadce0;
              padding-top: 30px; /* Increased from 25px */
            ">
              <div style="text-align: center; flex: 1; padding: 0 15px;">
                <p style="font-size: 18px; color: #5f6368; margin: 0;">Date</p>
                <p style="font-size: 22px; font-weight: 500; margin: 10px 0 0;">${formatDate(booking.date)}</p>
              </div>
              <div style="text-align: center; flex: 1; padding: 0 15px;">
                <p style="font-size: 18px; color: #5f6368; margin: 0;">Seats</p>
                <p style="font-size: 22px; font-weight: 500; margin: 10px 0 0;">${booking.seatsBooked}</p>
              </div>
              <div style="text-align: center; flex: 1; padding: 0 15px;">
                <p style="font-size: 18px; color: #5f6368; margin: 0;">Status</p>
                <p style="
                  font-size: 22px;
                  font-weight: 500;
                  margin: 10px 0 0;
                  color: ${booking.status === 'Confirmed' ? '#34a853' : '#ea4335'};
                ">${booking.status}</p>
              </div>
            </div>
          </div>
          
          <!-- Payment Section -->
          <div style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 25px 20px; /* Increased and added horizontal padding */
            border-bottom: 1px solid #dadce0;
            margin: 0 -10px; /* Negative margin to extend the line */
          ">
            <p style="font-size: 22px; font-weight: 500; margin: 0;">Total Amount</p>
            <p style="font-size: 32px; font-weight: 600; margin: 0; color: #1a73e8;">₹${booking.totalAmount}</p>
          </div>
          
          <!-- Booking Info -->
          <div style="
            padding: 25px 10px; /* Increased and added horizontal padding */
            font-size: 18px; /* Increased from 16px */
            color: #5f6368;
          ">
            <p style="margin: 8px 0;">Booked on: ${formatDate(booking.bookingDate)}</p>
          </div>
          
          <!-- Footer -->
          <div style="
            text-align: center;
            margin-top: 35px; /* Increased from 30px */
            padding-top: 25px; /* Increased from 20px */
            border-top: 1px solid #dadce0;
          ">
            <p style="
              color: #1a73e8;
              font-weight: 500;
              margin: 0;
              font-size: 20px; /* Increased from 18px */
            ">Thank you for traveling with us!</p>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(ticketElement);

    html2canvas(ticketElement, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      // Use full width of the PDF
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Ticket_${booking.bookingDate}.pdf`);

      document.body.removeChild(ticketElement);
    });
  };


  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const paginatedBookings = bookings.slice(indexOfFirstBooking, indexOfLastBooking);
  const totalPages = Math.ceil(bookings.length / bookingsPerPage);


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="lg:w-64 bg-[#007074] text-white p-6">
        <h2 className="text-2xl font-bold mb-8">Dashboard</h2>
        <nav className="space-y-4">
          <button
            className="w-full flex items-center px-4 py-2 text-left text-white hover:bg-blue-500 rounded-lg transition-colors"
            onClick={handleBookingShowing}
          >
            <User className="mr-2 h-5 w-5" />
            Profile
          </button>

          <button
            className="w-full flex items-center px-4 py-2 text-left text-white hover:bg-blue-500 rounded-lg transition-colors"
            onClick={handleFetchBookings}
          >
            <List className="mr-2 h-5 w-5" />
            Bookings
          </button>

          <button
            className="w-full flex items-center px-4 py-2 text-left text-white hover:bg-blue-500 rounded-lg transition-colors"
            onClick={handleFetchWallet}
          >
            <List className="mr-2 h-5 w-5" />
            Wallet
          </button>

          <button
            className="w-full flex items-center px-4 py-2 text-left text-white hover:bg-blue-500 rounded-lg transition-colors"
            onClick={onLogout}
          >
            <LogOut className="mr-2 h-5 w-5" />
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {!showWallet && !showBookings && (
            <>
              <h1 className="text-3xl font-bold text-gray-900 mb-8">
                Profile Settings
              </h1>

              {/* Profile Photo Section */}
              <div className="flex flex-col items-center mb-6">
                <img
                  src={profileData.photo || defaultProfileData.photo}
                  alt="Profile"
                  className="w-24 h-24 rounded-full border-2 border-gray-300 shadow-md"
                />
                <button
                  className="mt-2 px-3 py-1 bg-gray-200 text-sm rounded-lg flex items-center hover:bg-gray-300 transition"
                  onClick={() => handleEdit("photo")}
                >
                  <Camera className="h-4 w-4 mr-1" />
                  Change Photo
                </button>
              </div>

              {/* Profile Fields */}
              <div className="grid gap-6">
                {["name", "phone", "password"].map((field) => (
                  <div key={field} className="bg-white rounded-lg shadow-md">
                    <div className="flex items-center justify-between p-6">
                      <div className="flex items-center space-x-4">
                        {field === "name" && <User className="h-5 w-5" />}
                        {field === "phone" && <Phone className="h-5 w-5" />}
                        {field === "password" && <Lock className="h-5 w-5" />}
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 capitalize">
                            {field}
                          </h3>
                          <p className="text-base font-semibold">
                            {field === "password"
                              ? "••••••••"
                              : profileData[field as keyof typeof profileData]}
                          </p>
                        </div>
                      </div>
                      <button
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        onClick={() => handleEdit(field)}
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Bookings Section */}
          {showBookings && (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800">Your Bookings</h2>
              </div>

              {paginatedBookings.length > 0 ? (
                <div className="p-6">
                  <div className="grid gap-4">
                    {paginatedBookings.map((booking, index) => (
                      <div key={index} className="bg-gray-50 rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                        <div className="p-5">
                          <div className="flex flex-wrap items-start justify-between mb-3">
                            <div>
                              <h3 className="text-lg font-semibold">Booking #{booking.id || index + 1}</h3>
                              <p className="text-gray-500 text-sm">{formatDate(booking.date)}</p>
                            </div>

                            <div
                              className={`px-3 py-1 rounded-full font-medium text-sm ${booking.status === "success"
                                  ? "bg-blue-50 text-blue-700"  // Blue for success
                                  : "bg-red-50 text-red-700"    // Red for other statuses
                                }`}
                            >
                              {booking.status}
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <div className="flex items-start mb-3">
                                <div className="mt-1 mr-3 p-1.5 bg-green-100 rounded-full flex-shrink-0">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                  </svg>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500 font-medium">Pickup Stop</p>
                                  <p className="text-gray-700">{booking.source}-{booking.pickupStops}</p>
                                </div>
                              </div>

                              <div className="flex items-start">
                                <div className="mt-1 mr-3 p-1.5 bg-red-100 rounded-full flex-shrink-0">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                  </svg>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500 font-medium">Drop Stop</p>
                                  <p className="text-gray-700">{booking.destination}-{booking.dropStops}</p>
                                </div>
                              </div>
                            </div>

                            <div>
                              <div className="flex items-start mb-3">
                                <div className="mt-1 mr-3 p-1.5 bg-purple-100 rounded-full flex-shrink-0">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                                  </svg>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500 font-medium">Seats Booked</p>
                                  <p className="text-gray-700">{booking.seatsBooked}</p>
                                </div>
                              </div>

                              <div className="flex items-start">
                                <div className="mt-1 mr-3 p-1.5 bg-yellow-100 rounded-full flex-shrink-0">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                  </svg>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500 font-medium">Total Amount</p>
                                  <p className="text-gray-900 font-bold">₹{booking.totalAmount}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="px-5 py-3 bg-gray-100 flex flex-wrap gap-2">
                          <button
                            className={`px-4 py-2 rounded-lg flex items-center transition-colors ${booking.seatsBooked.length === 0 || booking.status !== "success"
                                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                : "bg-blue-600 text-white hover:bg-blue-700"
                              }`}
                            onClick={() => handleDownloadTicket(booking)}
                            disabled={booking.seatsBooked.length === 0 || booking.status !== "success"}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            Download Ticket
                          </button>

                          <button
                            className={`px-4 py-2 rounded-lg flex items-center transition-colors ${booking.seatsBooked.length === 0 || booking.status !== "success"
                                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                : "bg-blue-600 text-white hover:bg-blue-700"
                              }`}
                            onClick={() => handleEditBooking(booking)}
                            disabled={booking.seatsBooked.length === 0 || booking.status !== "success"}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                            Edit
                          </button>

                          <button

                            onClick={() => openCancelModal(booking)}
                            className={`px-3 py-1 rounded-lg ${booking.seatsBooked.length === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-500 text-white hover:bg-red-700'
                              }`}
                            disabled={booking.seatsBooked.length === 0}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            Cancel
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6">
                      <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 rounded-lg flex items-center ${currentPage === 1
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                          }`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Previous
                      </button>

                      <div className="flex items-center">
                        {[...Array(totalPages)].map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`w-10 h-10 mx-1 rounded-full flex items-center justify-center ${currentPage === i + 1
                                ? "bg-blue-600 text-white"
                                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                              }`}
                          >
                            {i + 1}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 rounded-lg flex items-center ${currentPage === totalPages
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                          }`}
                      >
                        Next
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-16 px-6 text-center">
                  <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-1">No bookings found</h3>
                  <p className="text-gray-500">Book your first trip to see your bookings here.</p>
                </div>
              )}
            </div>
          )}

          {/* delete popup */}
          {isModalOpen && selectedBooking && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-lg font-bold mb-4">Select Seats to Cancel</h2>
                <div className="grid grid-cols-3 gap-2">
                  {selectedBooking.seatsBooked.map((seat) => (
                    <button
                      key={seat}
                      onClick={() => handleSeatSelection(seat)}
                      className={`px-4 py-2 border rounded ${selectedSeats.includes(seat) ? 'bg-red-500 text-white' : 'bg-gray-100'
                        }`}
                    >
                      {seat}
                    </button>
                  ))}
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-300 rounded">Close</button>
                  <button onClick={handleCancelSeats} className="px-4 py-2 bg-red-500 text-white rounded">Confirm</button>
                </div>
              </div>
            </div>
          )}

          {/* show wallet */}
          {showWallet && (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12">
              <div className="max-w-4xl mx-auto px-4">
                <div className="flex items-center gap-3 mb-8">

                  <h1 className="text-3xl font-bold text-gray-800"> Wallet</h1>
                </div>

                {/* Balance Card */}
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-100 transform hover:scale-[1.02] transition-transform mb-8">
                  <div className="flex items-center gap-3 mb-4 opacity-90">
                    <Coins className="w-6 h-6" />
                    <p className="text-lg">Available Balance</p>
                  </div>
                  <p className="text-5xl font-bold mb-4">₹{walletData.Balance.toFixed(2)}</p>
                  <button
                    onClick={() => setShowAddMoney(true)}
                    className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl transition-colors backdrop-blur-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add Money
                  </button>
                </div>

                {/* Transaction History */}
                <div className="bg-white rounded-3xl shadow-lg shadow-blue-100 p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Transaction History</h2>
                  <div className="space-y-4 max-h-60 overflow-y-auto">
                    {walletData.Transaction_History.length > 0 ? (
                      walletData.Transaction_History.map((transaction, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-gray-100"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`${transaction.Type == "debit"
                              ? 'bg-red-100 text-red-600'
                              : 'bg-green-100 text-green-600'
                              } p-3 rounded-xl`}>
                              {transaction.Type == "debit" ? (
                                <ArrowUpRight className="w-6 h-6" />
                              ) : (
                                <ArrowDownLeft className="w-6 h-6" />
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">{transaction.Type}</p>
                              <p className="text-sm text-gray-500">{formatDate(transaction.Date)}</p>
                            </div>
                          </div>
                          <p className={`text-lg font-bold ${transaction.Type == "debit" ? 'text-red-600' : 'text-green-600'
                            }`}>
                            {transaction.Type == "debit" ? '-' : '+'}₹{Math.abs(transaction.Amount)}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center mt-4">No transactions available.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}


        </div>
      </main>

      {/* Add Money Modal */}
      {showAddMoney && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Money to Wallet</h2>
            <form onSubmit={handleAddMoney}>
              <div className="mb-6">
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                  Enter Amount
                </label>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e:React.ChangeEvent<HTMLInputElement>) => setAmount(Number(e.target.value))}
                  placeholder="0.00"
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddMoney(false)}
                  className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Add Money
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* Edit Modal */}
      {editingField && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Edit {editingField}</h2>

              {editingField === "password" ? (
                <>
                  <label className="block text-sm font-medium text-gray-700">Current Password</label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500"
                    placeholder="Enter current password"
                  />

                  <label className="block text-sm font-medium text-gray-700 mt-4">New Password</label>
                  <input
                    type="password"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500"
                    placeholder="Enter new password"
                  />
                </>
              ) : (
                <input
                  type={editingField === "photo" ? "file" : "text"}
                  value={editingField === "photo" ? undefined : editValue}
                  onChange={(e) =>
                    editingField === "photo"
                      ? setEditValue(e.target.files[0]) // Handling file input
                      : setEditValue(e.target.value)
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500"
                />
              )}

              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

              <div className="flex justify-end space-x-4 mt-6">
                <button className="px-4 py-2 border rounded-lg" onClick={() => setEditingField(null)}>Cancel</button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg" onClick={handleSave}>Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default ProfileForm;
