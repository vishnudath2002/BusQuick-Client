import React, { useState, useEffect } from 'react';
import { fetchAllSchedules, fetchAllBuses, fetchAllRoutes, addSchedule , setSeats , fetchAllOperators , editSchedule , deleteSchedule} from '../../api/ownerApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { toast } from 'react-hot-toast';
import { ScheduleData, BusData, RouteData } from '../../types/Schedule';
import { User } from '../../types/User';
import { ScheduleList } from '../../components/owner/ScheduleList';
import * as Yup from 'yup';
import Swal from "sweetalert2";


export const ScheduleListPage: React.FC = () => {
  const [schedules, setSchedules] = useState<ScheduleData[]>([]);
  const ownerId = useSelector((state: RootState) => state.user.id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [buses, setBuses] = useState<BusData[]>([]);
  const [routes, setRoutes] = useState<RouteData[]>([]);
  const [operators, setOperators] = useState<User[]>([])
  const [selectedDates, setSelectedDates] = useState<Date[]>([]); // Multiple start dates

  // Fetch buses and routes on component mount or when ownerId changes
  useEffect(() => {
    const loadData = async () => {
      if (ownerId) {
        try {
          const [busesData, routesData, operatorsData] = await Promise.all([
            fetchAllBuses(ownerId),
            fetchAllRoutes(ownerId),
            fetchAllOperators()
          ]);
          setBuses(busesData.buses);
          setRoutes(routesData.routes);
          setOperators(operatorsData.operators)
        } catch (error) {
          console.error('Failed to fetch data:', error);
          toast.error('Failed to fetch buses or routes');
        }
      }
    };

    loadData();
  }, [ownerId]);

 
  useEffect(() => {
    const loadSchedules = async () => {
      if (ownerId) {
        try {
          const scheduleData = await fetchAllSchedules(ownerId);
          setSchedules(scheduleData.schedules);
        } catch (error) {
          console.error('Failed to fetch schedules:', error);
          toast.error('Failed to fetch schedules');
        }
      }
    };

    loadSchedules();
  }, [ownerId, isModalOpen]);

  // Validation schema for the form
  const validationSchema = Yup.object({
    price: Yup.number().min(1, 'Price must be greater than 0').required('Price is required'),
    // startDates: Yup.array()
    //   .min(1, 'At least one start date is required')
    //   .required('Start dates are required')
    //   .of(Yup.date().required('Invalid date format')),
    startTime: Yup.string().required('Start time is required'),
    endTime: Yup.string()
    .required("End time is required")
    .test("is-after-start-time", "End time must be later than start time", function (value) {
      const { startTime } = this.parent; // Get the startTime from the same object
      if (!startTime || !value) return true; // Skip validation if any value is missing

      return new Date(`1970-01-01T${value}:00`) > new Date(`1970-01-01T${startTime}:00`);
    }),
    busId: Yup.string().required('Bus selection is required'),
    routeId: Yup.string().required('Route selection is required'),
  });

  // Initial values for the form
  const initialValues = {
    price: '',
    startDates: [], // Multiple start dates
    startTime: '',
    endTime: '',
    busId: '',
    routeId: '',
    operatorId: ''
  };

  // Handle form submission
  const handleSubmit = async (values: typeof initialValues) => {

    if (!ownerId || selectedDates.length === 0) return;

    try {
      const response = await addSchedule({
        ownerId,
        busId: values.busId,
        routeId: values.routeId,
        operatorId: values.operatorId,
        price: Number(values.price),
        status: 'Scheduled', // Default status
        isActive: true, // Default active status
        dateSlots: selectedDates,
        startTime: values.startTime,
        endTime: values.endTime,
      });

      if (response.success) {

        const res = await setSeats(response.result[0].busId, 
          response.result[0].id, 
          selectedDates.map(date => ({ date, isAvailable: true })))
        console.log(res)
        toast.success(response.message);
        setIsModalOpen(false);
        setSelectedDates([]); // Reset selected dates
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error('Failed to add schedule:', error);
      toast.error('Failed to add schedule');
    }
  };


  const handleEditPrice = async (schedule: ScheduleData) => {
      const { value: updatedPrice } = await Swal.fire({
        title: "Edit schedule Price",
        input: "number",
        inputLabel: "Enter new schedule price:",
        inputValue: schedule.price,
        showCancelButton: true,
        confirmButtonText: "Save",
        cancelButtonText: "Cancel",
        inputValidator: (value) => {
          if (!value.trim()) return "Schedule price cannot be empty.";
          // if (value.length < 3 || value.length > 50) return "Bus name must be 3-50 characters long.";
          return null;
        },
      });
    
      if (!updatedPrice || updatedPrice.trim() === schedule.price){
        toast("No changes were made.");
        return; 
      }  
  
    
      try {
        const response = await editSchedule(schedule.id, { Price: updatedPrice.trim() });
    
        if (response.success) {
          toast.success(response.message);
          setBuses((prevBuses) =>
            prevBuses.map((s) => (s.id === schedule.id ? { ...s, name: updatedPrice.trim() } : s))
          );
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        Swal.fire("Error", "Failed to update bus name.", "error");
        console.error(error);
      }
    };


    const handleEditStartTime = async (schedule: ScheduleData) => {
      const { value: updatedStartTime } = await Swal.fire({
        title: "Edit schedule Start time",
        input: "time",
        inputLabel: "Enter new schedule Start time:",
        inputValue: schedule.startTime,
        showCancelButton: true,
        confirmButtonText: "Save",
        cancelButtonText: "Cancel",
        inputValidator: (value) => {
          if (!value.trim()) return "Schedule start time cannot be empty.";
          return null;
        },
      });
    
      if (!updatedStartTime || updatedStartTime.trim() === schedule.startTime){
        toast("No changes were made.");
        return; 
      }  
  
    
      try {
        const response = await editSchedule(schedule.id, { startTime: updatedStartTime.trim() });
    
        if (response.success) {
          toast.success(response.message);
          setBuses((prevBuses) =>
            prevBuses.map((s) => (s.id === schedule.id ? { ...s, name: updatedStartTime.trim() } : s))
          );
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        Swal.fire("Error", "Failed to update bus name.", "error");
        console.error(error);
      }
    };


    const handleEditEndTime = async (schedule: ScheduleData) => {
      const { value: updatedEndTime } = await Swal.fire({
        title: "Edit schedule End time",
        input: "time",
        inputLabel: "Enter new schedule End time:",
        inputValue: schedule.endTime,
        showCancelButton: true,
        confirmButtonText: "Save",
        cancelButtonText: "Cancel",
        inputValidator: (value) => {
          if (!value.trim()) return "Schedule end time cannot be empty.";
          return null;
        },
      });
    
      if (!updatedEndTime || updatedEndTime.trim() === schedule.endTime){
        toast("No changes were made.");
        return; 
      }  
  
    
      try {
        const response = await editSchedule(schedule.id, { endTime: updatedEndTime.trim() });
    
        if (response.success) {
          toast.success(response.message);
          setBuses((prevBuses) =>
            prevBuses.map((s) => (s.id === schedule.id ? { ...s, name: updatedEndTime.trim() } : s))
          );
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        Swal.fire("Error", "Failed to update bus name.", "error");
        console.error(error);
      }
    };

    const handleEditBus = async (bus: BusData,schedule: ScheduleData, buses: BusData[]) => {

      const inputOptions = Object.fromEntries(buses.map((ele) => [ele.id, ele.name]));

      const { value: updatedBus } = await Swal.fire({
        title: "Edit schedule Bus",
        input: "select",
        inputOptions: inputOptions,
        inputValue: bus.id,
        showCancelButton: true,
        confirmButtonText: "Save",
        cancelButtonText: "Cancel",
        inputValidator: (value) => {
          if (!value.trim()) return "Schedule price cannot be empty.";
          return null;
        },
      });
    
      if (!updatedBus || updatedBus.trim() === bus.id){
        toast("No changes were made.");
        return; 
      }  
  
    
      try {

        const response = await editSchedule(schedule.id, { Bus_Id: updatedBus.trim() });
    
        if (response.success) {
          toast.success(response.message);
          setBuses((prevBuses) =>
            prevBuses.map((s) => (s.id === schedule.id ? { ...s, name: updatedBus.trim() } : s))
          );
        } else {
          toast.error(response.message);
        }

      } catch (error) {
        Swal.fire("Error", "Failed to update bus name.", "error");
        console.error(error);
      }
    };


    // const handleEditPrice = async (schedule: ScheduleData) => {
    //   const { value: updatedPrice } = await Swal.fire({
    //     title: "Edit schedule Price",
    //     input: "number",
    //     inputLabel: "Enter new schedule price:",
    //     inputValue: schedule.price,
    //     showCancelButton: true,
    //     confirmButtonText: "Save",
    //     cancelButtonText: "Cancel",
    //     inputValidator: (value) => {
    //       if (!value.trim()) return "Schedule price cannot be empty.";
    //       // if (value.length < 3 || value.length > 50) return "Bus name must be 3-50 characters long.";
    //       return null;
    //     },
    //   });
    
    //   if (!updatedPrice || updatedPrice.trim() === schedule.price){
    //     toast("No changes were made.");
    //     return; 
    //   }  
  
    
    //   try {
    //     const response = await editSchedule(schedule.id, { Price: updatedPrice.trim() });
    
    //     if (response.success) {
    //       toast.success(response.message);
    //       setBuses((prevBuses) =>
    //         prevBuses.map((s) => (s.id === schedule.id ? { ...s, name: updatedPrice.trim() } : s))
    //       );
    //     } else {
    //       toast.error(response.message);
    //     }
    //   } catch (error) {
    //     Swal.fire("Error", "Failed to update bus name.", "error");
    //     console.error(error);
    //   }
    // };


   


    const handleDelete = async (scheduleId: string) => {
    
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
      
          const response = await deleteSchedule(scheduleId);
      
          if (response.success) {
            toast.success(response.message);
              setSchedules((prevSchedules) => prevSchedules.filter((schedule) => schedule.id !== scheduleId));
          } else {
            toast.error(response.message);
          }
        } catch (error) {
          toast.error("Failed to delete bus");
          console.error(error);
        }
      };

  return (
    <ScheduleList
      schedules={schedules}
      buses={buses}
      routes={routes}
      operators={operators}
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      handleEditPrice={handleEditPrice}
      handleEditStartTime = {handleEditStartTime}
      handleEditEndTime={handleEditEndTime}
      handleEditBus= {handleEditBus}
      handleDelete={handleDelete}
      selectedDates={selectedDates}
      setSelectedDates={setSelectedDates}
    />
  );
};