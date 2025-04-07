import { Bus } from "lucide-react";
import { apiClient } from "./apiClient"
import { Route } from "../types/Route";
import { Schedule } from "../types/Schedule";

export interface Bus{
  id: string,
  ownerId: string,
  Name: string,
  Status: string | null,
  Type: string,
  SeatsAvailable: string | null,
  createdAt: Date,
  updatedAt: Date | null,
  SeatsTotal: number | null
}

export interface RouteData {
  id?: string;
  ownerId: string;
  source: string;
  destination: string;
  distance: number;
  estimatedTime: number;
  createdAt: Date;
  updatedAt: null;
  dropStops:string[],
  pickupStops: string[];
}

export interface BusData {
  id?: string;
  ownerId: string;
  name: string;
  type: 'sleeper' | 'seater';
  status: 'Active' | 'Inactive';
  ac: true | false;
  fileBuffer: File | null;
  seatsAvailable: string;
  seatsTotal: number;
}

export interface ScheduleData {
  id?: string;
  price: number;
  ownerId: string;
  busId: string;
  operatorId: string;
  routeId: string;
  timeSlots: {  startDate: Date; startTime: string; endTime: string  }[]; 
  status: string;
  isActive: boolean;
}

export const fetchAllBuses = async (ownerId: string) => {
  const response = await apiClient.get(`/owner/getBuses/${ownerId}`,{});
   return response.data;
}

export const fetchAllRoutes = async (ownerId: string) => {
  const response = await apiClient.get(`/owner/getRoutes/${ownerId}`,{});
   return response.data;
}

export const fetchAllOperators = async () => {
  const response = await apiClient.get(`/owner/getoperators`);
   return response.data;
}

export const fetchAllSchedules = async (ownerId: string) => {
  const response = await apiClient.get(`/owner/getSchedules/${ownerId}`,{});
  return response.data;
}

export const fetchAllBookings = async (ownerId: string) => {
  const response = await apiClient.get(`/owner/getbookings/${ownerId}`,{});
  return response.data;
}

export const addRoute = async ( route: RouteData) => {
  const response = await apiClient.post("/owner/addRoute",{route:route});
  return response.data;
}

export const addBus = async ( bus: BusData) => {
  const response = await apiClient.post("/owner/addBus",{bus:bus});
  return response.data;
}

export const addSchedule = async ( schedule: ScheduleData) => {
  const response = await apiClient.post("/owner/addSchedule",{schedule:schedule});
  return response.data;
}

export const addSeats = async ( busId: string, seatCount: number, rowLabel: string ) => {
  const response = await apiClient.post("/owner/addSeats",{busId,seatCount,rowLabel});
  return response.data;
}

export const setSeats = async ( busId: string, scheduleId: string, availability: { date: Date; isAvailable: boolean }[] ) =>{
  const response = await apiClient.post("/owner/setSeats",{ busId , scheduleId , availability });
  return response.data;
}

export const addRc = async (busId: string, file: File) => {
  const formData = new FormData();
  formData.append("busId", busId);
  formData.append("file", file);

  const response = await apiClient.post("/owner/addrc", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};


export const editBus = async (busId: string, updateData: Partial<Bus>) => {
  const response = await apiClient.post("/owner/editbus", { busId, updateData });
  return response.data;
};

export const deleteBus = async (BusId: string) => {
  const response = await apiClient.post("/owner/deleteBus",{ busId:BusId });
  return response.data;
}

export const editRoute = async ( routeId: string , updateData: Partial<Route>) => {
  const response = await apiClient.post("/owner/editroute", { routeId , updateData });
  return response.data;
}

export const deleteRoute = async ( routeId: string ) => {
  const response = await apiClient.post("/owner/deleteroute",{ routeId });
  return response.data;
}

export const editDropStops = async ( routeId: string, dropStops: string[]) => {
  const response = await apiClient.post("/owner/adddropstops",{routeId , dropStops});
  return response.data;
}

export const editPickupStops = async ( routeId: string, pickupStops: string[]) => {
  const response = await apiClient.post("/owner/addpickupstops",{routeId , pickupStops});
  return response.data;
}

export const editSchedule = async ( scheduleId: string , updateData: Partial<Schedule>) => {
  const response = await apiClient.post("/owner/editschedule",{ scheduleId , updateData });
  return response.data;
}

export const deleteSchedule = async ( scheduleId: string ) => {
  const response = await apiClient.post("/owner/deleteschedule",{ scheduleId });
  return response.data;
}


export const addLayout = async (rows: number, columnConfig: object, busId: string) => {
  const response = await apiClient.post("/owner/addlayout", { rows, columnConfig, busId });
  return response.data;
};

export const getLayout = async (busId: string) => {
  const response = await apiClient.get(`/owner/getlayout/${busId}`);
  return response.data;
};

export const editLayout = async (layoutId: string, updateData: object) => {
  const response = await apiClient.patch("/owner/editlayout", { layoutId, updateData });
  return response.data;
};

export const deleteLayout = async (busId: string) => {
  const response = await apiClient.delete("/owner/deletelayout", { data: { busId } });
  return response.data;
};








