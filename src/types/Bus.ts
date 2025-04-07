

export interface Bus {
  bus: {
    name: string;
    seatsAvailable: string;
    type: string;
  };
  startTime: string;
  endTime: string;
  startDate: Date;
  endDate: Date;
  price: string;
  isActive: boolean;
  availableSeats: number;
  scheduleId: string;
}

export interface BusData {
  id: string;
  ownerId: string;
  name: string;
  type: 'sleeper' | 'seater';
  status: 'Active' | 'Inactive';
  seatsTotal: number;
  seatsAvailable: string
}