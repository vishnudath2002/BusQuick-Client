export interface Booking{
id: string;
name: string;
email: string;
phone: string;
age: string;
userId: string;
scheduleId: string;
source: string;
destination: string;
date: string;
dropStops: string;
pickupStops: string;
seatsBooked: string[];
status: string;
totalAmount: string;
bookingDate: string; 
address: string;
couponId?: string;
}