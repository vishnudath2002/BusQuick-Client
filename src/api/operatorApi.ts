import { apiClient } from "./apiClient"


export const fetchBookings = async (operatorId: string | null) => {
    const response = await apiClient.get(`/operator/getbookings/${operatorId}`,{});
    return response.data;
}


export const fetchSchedules = async (operatorId: string | null) => {
    const response = await apiClient.get(`/operator/getSchedules/${operatorId}`,{});
    return response.data;
}

export const cancelSeats = async (bookingId: string, seatNumbers: string[]) => {
    const response = await apiClient.post('/operator/deletebookedseats',{bookingId,seatNumbers});
    return response.data;
}
