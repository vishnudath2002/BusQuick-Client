

export interface RouteData {
    id: string;
    source: string;
    destination: string;
    distance: number;
    estimatedTime: number;
    pickupStops: string[];
    dropStops:string[];
  }

  export interface Route {
  id: string;
  ownerId: string;
  source: string;
  destination: string;
  pickupStops: string[]; 
  dropStops:string[],
  distance: number;
  createdAt: Date;
  estimatedTime: number;
  updatedAt: null;
}
