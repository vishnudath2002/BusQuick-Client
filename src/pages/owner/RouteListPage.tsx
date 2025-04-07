import React, { useState, useEffect } from 'react';
import { addRoute, fetchAllRoutes , editRoute, editDropStops , deleteRoute } from '../../api/ownerApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { toast } from 'react-hot-toast';
import { RouteList } from '../../components/owner/RouteList';
import { RouteData } from '../../types/Route'; 
import Swal from "sweetalert2";




export const RouteListPage: React.FC = () => {

  const [routes, setRoutes] = useState<RouteData[]>([]);
  const ownerId = useSelector((state: RootState) => state.user.id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRoute, setNewRoute] = useState({
    source: '',
    destination: '',
    distance: '',
    estimatedTime: '',
    pickupStops:"",
    dropStops:""
  });

  useEffect(() => {
    const loadRoutes = async () => {
      if (ownerId) {
        try {
          const routeData = await fetchAllRoutes(ownerId);
          setRoutes(routeData.routes);
        } catch (error) {
          console.error('Failed to fetch routes:', error);
        }
      }
    };

    loadRoutes();
  }, [ownerId, isModalOpen]);

  const handleSubmit = async (values: typeof newRoute) => {
    
    if (!ownerId) return;
    
    try {
      const pickupStopsArray = values.pickupStops.split(',').map(stop => stop.trim());
      const dropStopsArray = values.dropStops.split(',').map(stop => stop.trim());
      
      const response = await addRoute({
        ownerId,
        source: values.source.trim(),
        destination: values.destination.trim(),
        distance: Number(values.distance),
        estimatedTime: Number(values.estimatedTime),
        createdAt: new Date(),
        updatedAt: null,
        pickupStops:pickupStopsArray,
        dropStops:dropStopsArray
      });

      if(response.success === true) {
        toast.success(response.message);
        setIsModalOpen(false);
        setNewRoute({
          source: '',
          destination: '',
          distance: '',
          estimatedTime: '',
          pickupStops:'',
          dropStops:''
        });
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error('Failed to add route:', error);
      toast.error('Failed to add route');
    }
  };

  const handleEditSource = async (route: RouteData) => {
      const { value: updatedSource } = await Swal.fire({
        title: "Edit source",
        input: "text",
        inputLabel: "Enter new route source:",
        inputValue: route.source,
        showCancelButton: true,
        confirmButtonText: "Save",
        cancelButtonText: "Cancel",
        inputValidator: (value) => {
          if (!value.trim()) return "source cannot be empty.";
          if (value.length < 3 || value.length > 50) return "source must be 3-50 characters long.";
          return null;
        },
      });
    
      if (!updatedSource || updatedSource.trim() === route.source){
        toast("No changes were made.");
        return; 
      }  
  
    
      try {
        const response = await editRoute(route.id, { source: updatedSource.trim() });
    
        if (response.success) {
          toast.success(response.message);
          setRoutes((prevRoutes) =>
            prevRoutes.map((r) => (r.id === route.id ? { ...r, source: updatedSource.trim() } : r))
          );
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        Swal.fire("Error", "Failed to update source.", "error");
        console.error(error);
      }
    };

    const handleEditDestination = async (route: RouteData) => {
      const { value: updatedDestination } = await Swal.fire({
        title: "Edit Destination",
        input: "text",
        inputLabel: "Enter new destination:",
        inputValue: route.destination,
        showCancelButton: true,
        confirmButtonText: "Save",
        cancelButtonText: "Cancel",
        inputValidator: (value) => {
          if (!value.trim()) return "Destination cannot be empty.";
          if (value.length < 3 || value.length > 50) return "Destination must be 3-50 characters long.";
          return null;
        },
      });
    
      if (!updatedDestination || updatedDestination.trim() === route.destination) {
        toast("No changes were made.");
        return;
      }
    
      try {
        const response = await editRoute(route.id, { destination: updatedDestination.trim() });
    
        if (response.success) {
          toast.success(response.message);
          setRoutes((prevRoutes) =>
            prevRoutes.map((r) => (r.id === route.id ? { ...r, destination: updatedDestination.trim() } : r))
          );
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        Swal.fire("Error", "Failed to update destination.", "error");
        console.error(error);
      }
    };


    const handleAddDropStops = async (route: RouteData) => {
      const { value: updatedDropStops } = await Swal.fire({
        title: "Edit Drop Stops",
        input: "text",
        inputLabel: "Enter new drop stops (comma-separated):",
        inputValue: route.pickupStops.join(", "), // Show current drop stops as comma-separated values
        showCancelButton: true,
        confirmButtonText: "Save",
        cancelButtonText: "Cancel",
        inputValidator: (value) => {
          if (!value.trim()) return "Drop stops cannot be empty.";
          const stops = value.split(",").map((stop) => stop.trim());
          if (stops.some((stop) => stop.length < 3 || stop.length > 50))
            return "Each stop must be between 3-50 characters long.";
          return null;
        },
      });
    
      if (!updatedDropStops || updatedDropStops.trim() === route.dropStops.join(", ")) {
        toast("No changes were made.");
        return;
      }
    
      // Convert the input into an array
      const dropStopsArray = updatedDropStops.split(",").map((stop: string) => stop.trim());
    
      try {
        const response = await editDropStops(route.id,   dropStopsArray );
    
        if (response.success) {
          toast.success(response.message);
          setRoutes((prevRoutes) =>
            prevRoutes.map((r) =>
              r.id === route.id ? { ...r, dropStops: dropStopsArray } : r
            )
          );
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        Swal.fire("Error", "Failed to update drop stops.", "error");
        console.error(error);
      }
    };

    const handleAddPickupStops = async (route: RouteData) => {
      const { value: updatedPickupStops } = await Swal.fire({
        title: "Edit Pickup Stops",
        input: "text",
        inputLabel: "Enter new Pickup stops (comma-separated):",
        inputValue: route.dropStops.join(", "), // Show current drop stops as comma-separated values
        showCancelButton: true,
        confirmButtonText: "Save",
        cancelButtonText: "Cancel",
        inputValidator: (value) => {
          if (!value.trim()) return "Pickup stops cannot be empty.";
          const stops = value.split(",").map((stop) => stop.trim());
          if (stops.some((stop) => stop.length < 3 || stop.length > 50))
            return "Each stop must be between 3-50 characters long.";
          return null;
        },
      });
    
      if (!updatedPickupStops || updatedPickupStops.trim() === route.pickupStops.join(", ")) {
        toast("No changes were made.");
        return;
      }
    
      // Convert the input into an array
      const pickupStopsArray = updatedPickupStops.split(",").map((stop: string) => stop.trim());
    
      try {
        const response = await editDropStops(route.id,   pickupStopsArray );
    
        if (response.success) {
          toast.success(response.message);
          setRoutes((prevRoutes) =>
            prevRoutes.map((r) =>
              r.id === route.id ? { ...r, PickupStops: pickupStopsArray } : r
            )
          );
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        Swal.fire("Error", "Failed to update drop stops.", "error");
        console.error(error);
      }
    };
    
    
    const handleEditDistance = async (route: RouteData) => {
      const { value: updatedDistance } = await Swal.fire({
        title: "Edit Distance",
        input: "number",
        inputLabel: "Enter new distance (km):",
        inputValue: route.distance,
        showCancelButton: true,
        confirmButtonText: "Save",
        cancelButtonText: "Cancel",
        inputValidator: (value) => {
          if (!value.trim()) return "Distance cannot be empty.";
          if (isNaN(Number(value)) || Number(value) <= 0) return "Distance must be a positive number.";
          return null;
        },
      });
    
      if (!updatedDistance || Number(updatedDistance) === route.distance) {
        toast("No changes were made.");
        return;
      }
    
      try {
        const response = await editRoute(route.id, { distance: Number(updatedDistance) });
    
        if (response.success) {
          toast.success(response.message);
          setRoutes((prevRoutes) =>
            prevRoutes.map((r) => (r.id === route.id ? { ...r, distance: Number(updatedDistance) } : r))
          );
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        Swal.fire("Error", "Failed to update distance.", "error");
        console.error(error);
      }
    };
    
    const handleEditEstimatedTime = async (route: RouteData) => {
      const { value: updatedTime } = await Swal.fire({
        title: "Edit Estimated Time",
        input: "number",
        inputLabel: "Enter new estimated time (minutes):",
        inputValue: route.estimatedTime,
        showCancelButton: true,
        confirmButtonText: "Save",
        cancelButtonText: "Cancel",
        inputValidator: (value) => {
          if (!value.trim()) return "Estimated time cannot be empty.";
          if (isNaN(Number(value)) || Number(value) <= 0) return "Estimated time must be a positive number.";
          return null;
        },
      });
    
      if (!updatedTime || Number(updatedTime) === route.estimatedTime) {
        toast("No changes were made.");
        return;
      }
    
      try {
        const response = await editRoute(route.id, { estimatedTime: Number(updatedTime) });
    
        if (response.success) {
          toast.success(response.message);
          setRoutes((prevRoutes) =>
            prevRoutes.map((r) => (r.id === route.id ? { ...r, estimatedTime: Number(updatedTime) } : r))
          );
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        Swal.fire("Error", "Failed to update estimated time.", "error");
        console.error(error);
      }
    };
    


    const handleDelete = async (routeId: string) => {
    
          const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
          });
        
          if (!result.isConfirmed) return;
    
        try {
      
          const response = await deleteRoute(routeId);
      
          if (response.success) {
            toast.success(response.message);
              setRoutes((prevRoutes) => prevRoutes.filter((route) => route.id !== routeId));
          } else {
            toast.error(response.message);
          }
        } catch (error) {
          toast.error("Failed to delete bus");
          console.error(error);
        }
      };

  return (
    <RouteList
      routes={routes}
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
      newRoute={newRoute}
      handleSubmit={handleSubmit}
      handleEditSource={handleEditSource}
      handleEditDestination={handleEditDestination}
      handleAddDropStops = {handleAddDropStops}
      handleAddPickupStops = {handleAddPickupStops}
      handleEditDistance={handleEditDistance}
      handleEditEstimatedTime={handleEditEstimatedTime}
      handleDelete={handleDelete}
    />
  );
};