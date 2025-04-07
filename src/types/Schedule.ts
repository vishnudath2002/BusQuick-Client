export interface ScheduleData {
  id: string;
  price: number;
  busId: string; 
  operatorId: string;
  routeId: string;
  dateSlots: string[]; 
  startTime: string;
  endTime: string;
  status: string;
  routeSource: string;
  routeDestination: string;
  }
  
  export interface BusData {
    id: string;
    name: string;
  }
  
  export interface RouteData {
    id: string;
    source: string;
    destination: string;
  }

  
export interface Schedule{
 id: string;
 price: string;
 ownerId: string;
 operatorId: string;
 busId: string;
 routeId: string;
 dateSlots: Date[];
 startTime: string;
 endTime: string;
 status: string;
 isActive: boolean
}