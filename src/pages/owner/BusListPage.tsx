import React, { useState, useEffect } from 'react';
import { fetchAllBuses, addBus, addSeats , editBus , deleteBus , addRc} from '../../api/ownerApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { toast } from 'react-hot-toast';
import { BusData } from '../../types/Bus';
import { BusList } from '../../components/owner/BusList';
import Swal from "sweetalert2";

export const BusListPage: React.FC = () => {
  const [buses, setBuses] = useState<BusData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const ownerId = useSelector((state: RootState) => state.user.id);

  useEffect(() => {
    const loadBuses = async () => {
      if (ownerId) {
        try {
          const busData = await fetchAllBuses(ownerId);
          setBuses(busData.buses);
        } catch (error) {
          console.error('Failed to fetch buses:', error);
        }
      }
    };

    loadBuses();
  }, [ownerId, isModalOpen]);

  const handleSubmit = async (values: {
    name: string;
    type: 'seater' | 'sleeper';
    status: 'Active' | 'Inactive';
    ac: "true" | "false";
    fileBuffer: File ;
    seatsTotal: string;
  }) => {
    if (!ownerId) return;
    
    try {
      const response = await addBus({
        ...values,
        ownerId,
        seatsTotal: Number(values.seatsTotal),
        seatsAvailable: values.seatsTotal,
        status: values.status === 'Active' ? 'Active' : 'Inactive',
        ac: values.ac == "true" ? true : false,
      });


      
     
      
      if (response.success === true) {
        const res = await addSeats( 
          response.data.id, 
          Number(response.data.seatsTotal), 
          response.data.type === 'seater' ? "A" : "S"
        )
        
        if (values.fileBuffer) {
          const res2 = await addRc(response.data.id, values.fileBuffer); // Pass file directly
          if (!res2.success) {
            toast.error("RC upload failed.");
            return;
          }
          console.log(res2);
        }
        
       
        toast.success(response.message + " and "+ res.message);
        setIsModalOpen(false);
      } else {
        toast.error(response.message);
      }

    } catch (error) {
      toast.error("Failed to add bus");
      console.error(error);
    }
  };


  const handleEditName = async (bus: BusData) => {
    const { value: updatedName } = await Swal.fire({
      title: "Edit Bus Name",
      input: "text",
      inputLabel: "Enter new bus name:",
      inputValue: bus.name,
      showCancelButton: true,
      confirmButtonText: "Save",
      cancelButtonText: "Cancel",
      inputValidator: (value) => {
        if (!value.trim()) return "Bus name cannot be empty.";
        if (value.length < 3 || value.length > 50) return "Bus name must be 3-50 characters long.";
        return null;
      },
    });
  
    if (!updatedName || updatedName.trim() === bus.name){
      toast("No changes were made.");
      return; 
    }  

  
    try {
      const response = await editBus(bus.id, { Name: updatedName.trim() });
  
      if (response.success) {
        toast.success(response.message);
        setBuses((prevBuses) =>
          prevBuses.map((b) => (b.id === bus.id ? { ...b, name: updatedName.trim() } : b))
        );
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      Swal.fire("Error", "Failed to update bus name.", "error");
      console.error(error);
    }
  };
  
  const handleEditType = async (bus: BusData) => {
    const { value: updatedType } = await Swal.fire({
      title: "Edit Bus Type",
      input: "select",
      inputOptions: {
        sleeper: "sleeper",
        seater: "seater",
      },
      inputValue: bus.type,
      showCancelButton: true,
      confirmButtonText: "Save",
      cancelButtonText: "Cancel",
    });
  
    if (!updatedType || updatedType === bus.type) {
      toast("No changes were made.");
      return;
    }
  
    try {
      const response = await editBus(bus.id, { Type: updatedType });
  
      if (response.success) {
        toast.success(response.message);
        setBuses((prevBuses) =>
          prevBuses.map((b) => (b.id === bus.id ? { ...b, type: updatedType } : b))
        );
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      Swal.fire("Error", "Failed to update bus type.", "error");
      console.error(error);
    }
  };
  
  const handleEditStatus = async (bus: BusData) => {
    const { value: updatedStatus } = await Swal.fire({
      title: "Edit Bus Status",
      input: "select",
      inputOptions: {
        Active: "Active",
        Inactive: "Inactive",
      },
      inputValue: bus.status,
      showCancelButton: true,
      confirmButtonText: "Save",
      cancelButtonText: "Cancel",
    });
  
    if (!updatedStatus || updatedStatus === bus.status) {
      toast("No changes were made.");
      return;
    }
  
    try {
      const response = await editBus(bus.id, { Status: updatedStatus });
  
      if (response.success) {
        toast.success(response.message);
        setBuses((prevBuses) =>
          prevBuses.map((b) => (b.id === bus.id ? { ...b, status: updatedStatus } : b))
        );
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      Swal.fire("Error", "Failed to update bus status.", "error");
      console.error(error);
    }
  };
  
  const handleEditTotalSeats = async (bus: BusData) => {
    const { value: updatedSeats } = await Swal.fire({
      title: "Edit Total Seats",
      input: "number",
      inputLabel: "Enter new total seats:",
      inputValue: bus.seatsTotal,
      showCancelButton: true,
      confirmButtonText: "Save",
      cancelButtonText: "Cancel",
      inputAttributes: {
        min: "1",
        max: "100",
        step: "1",
      },
      inputValidator: (value) => {
        if (!value) return "Seat count cannot be empty.";
        if (!/^\d+$/.test(value)) return "Invalid input. Please enter a valid number.";
        if (Number(value) < 1 || Number(value) > 100) return "Seat count must be between 1 and 100.";
        return null;
      },
    });
  
    if (!updatedSeats || Number(updatedSeats) === bus.seatsTotal) {
      toast("No changes were made.");
      return;
    }
  
    try {
      const response = await editBus(bus.id, { SeatsTotal: Number(updatedSeats) });
  
      if (response.success) {
        toast.success(response.message);
        setBuses((prevBuses) =>
          prevBuses.map((b) => (b.id === bus.id ? { ...b, seatsTotal: Number(updatedSeats) } : b))
        );
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      Swal.fire("Error", "Failed to update total seats.", "error");
      console.error(error);
    }
  };
  
  
  const handleDelete = async (busId: string) => {

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
  
      const response = await deleteBus(busId);
  
      if (response.success) {
        toast.success(response.message);
          setBuses((prevBuses) => prevBuses.filter((bus) => bus.id !== busId));
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to delete bus");
      console.error(error);
    }
  };

  return (
    <BusList
      buses={buses}
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
      handleSubmit={handleSubmit}
      handleEditName={handleEditName}
      handleEditType={handleEditType}
      handleEditStatus={handleEditStatus}
      handleEditTotalSeats={handleEditTotalSeats}
      handleDelete={handleDelete}
    />
  );
};