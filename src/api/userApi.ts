import { apiClient } from "./apiClient"
import { Booking } from "../types/Booking"
import toast from "react-hot-toast";

export const getUserProfile = async () => {
  const response = await apiClient.get('/user/profile');
  return response.data;
}

export const updateUserName = async (id:string, name:string) => {
  const response = await apiClient.put('user/profile/editName',{id,name});
  return response.data;
}

export const updateUserEmail = async (id:string,email:string) => {
  const response = await apiClient.put('user/profile/editEmail',{id,email});
  return response.data;
}

export const updateUserPhone = async (id:string,phone:string) => {
  const response = await apiClient.put('user/profile/editPhone',{id,phone});
  return response.data;
}

export const updateUserPassword = async (email:string ,oldPassword: string, newPassword:string) => {
  const response = await apiClient.put('user/profile/editPassword',{email,oldPassword,newPassword});
  return response.data;
}

export const browseBusesByLocation = async (fromCity: string, toCity: string, date: string) => {
  const response = await apiClient.post('/user/buses/location',{ source:fromCity, destination:toCity, date: date });
   return response.data;
}

export const searchDestinations = async (query: string) => {
  if (!query) {
    throw new Error("Query parameter is required");
  }
    const response = await apiClient.get(`/user/searchDest`, {
      params: { query },
    });
    return response.data;
};

export const searchSources = async (query: string) => {
  if (!query) {
    throw new Error("Query parameter is required");
  }
    const response = await apiClient.get(`/user/searchSour`, {
      params: { query },
    });
    return response.data;
}

export const getSeats = async (busId: string, date: string) => {
  if(!busId){
    throw new Error("busId is required");
  }
  const response = await apiClient.post("/user/seats",{
    busId, date
  })
  return response.data;
}


export const bookSeats = async (
  name: string,
  email: string,
  phone: string,
  age: string,
  busId: string,
  userId: string,
  scheduleId: string,
  selectedSeats: string[],
  source: string,
  destination: string,
  date: Date,
  arrivalTime: string,
  departureTime: string,
  pickupStop: string,
  dropStop: string,
  quantity: number,
  amount: string,
  totalPrice: string,
  address: string,
  couponCode: string
) => {
  try {
    const response = await apiClient.post("/user/booking", {
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
      quantity,
      amount,
      totalPrice,
      address,
      couponCode,
    });

    return response.data;
  } catch (error) {
    console.error("Error booking seats:", error);
    throw new Error("Failed to book seats");
  }
};

export const  checkout = async (name: string ,description: string, price: string, quantity: string) => {
  
  if(!name){
    throw new Error("name is required");
  }
  if(!description){
    throw new Error("description is required");
  }
  if(!price){
    throw new Error("price is required");
  }
  if(!quantity){
    throw new Error("quantity is required");
  }

  const response = await apiClient.post("/user/checkout",{
     name, description , price , quantity
  })
  return response.data;
  
}

export const payAmount = async (amount: string , bookingId: string) =>{
  if(!amount){
    throw new Error("amount is required");
  }
  if(!bookingId){
    throw new Error("booking is required");
  }
  const response = await apiClient.post("/user/payment",{
    "payment":{
     "Amount": amount,Payment_Status:"success", "Booking_Id": bookingId, 
     "Payment_Date": new Date()
    }
  })
  return response.data;
}


export const changeBookStatus = async (bookingId: string, statu: string) => {
  if(!statu){
    throw new Error("status is required");
  }
  if(!bookingId){
    throw new Error("booking is required");
  }
  const response = await apiClient.post("/user/updateBook",{
    bookingId, statu
 })
 return response.data;
}


export const changeSeatStatus = async (busId: string, date: string,seatNumbers: string[], scheduleId: string, isAvailable: boolean) => {
  const response = await apiClient.post("/user/updateSeat",{
    busId,date,seatNumbers,scheduleId , isAvailable
 })
 return response.data;
}


export const fetchBookings = async () => {
  const response = await apiClient.get("/user/bookings");
  return response.data;
}


export const updateBooking = async ( bookingId: string , updatedFields: Partial<Booking> ) => {
  const response = await apiClient.put("/user/updatebooking",{
    bookingId , updatedFields
 })
 return response.data;
}


export const fetchBusId = async ( scheduleId: string ) => {
  const response = await apiClient.post("/user/getbusid",{ scheduleId });
  return response.data;
}

export const uploadUserProfilePicture = async (userId: string, file: File) => {
  const formData = new FormData();
  formData.append("profilePicture", file);
  formData.append("userId", userId);

  const response = await apiClient.post("/user/profile/editphoto", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
  
};



export const createWallet = async () =>{
   const response = await apiClient.post("/user/createwallet",{});
   return response.data;
}



export const getWallet = async () =>{
  const response = await apiClient.get("/user/wallet",{});
  return response.data;
}

export const addMoney = async (amount: number) => {
  const response = await apiClient.post("/user/addmoney",{amount})
  return response.data;
}


export const getSeatsByIds = async (seatsIds: string[]) =>{
   if(!seatsIds){
      toast.error("seatsIds not included")
   }
   const response = await apiClient.post("/user/getseatbyids",{seatsIds})
   return response.data;
}


export const cancelTickets = async (bookingId: string, seatNumbers: string[]) => {
  const response = await apiClient.delete('/user/deletebookedseats', {
    data: { bookingId, seatNumbers }, // Move data inside the `data` property
  });
  return response.data;
};
