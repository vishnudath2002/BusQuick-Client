import React from 'react';
import { Plus, Clock, X } from 'lucide-react';
import { formatTime } from '../../utils/FormateDateTime';
import { ScheduleData, BusData, RouteData } from '../../types/Schedule';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import DatePicker from "react-multi-date-picker";
import { User } from '../../types/User';

interface ScheduleFormValues {
  price: string;
  startDates: string[];
  startTime: string;
  endTime: string;
  busId: string;
  routeId: string;
  operatorId: string;
}

interface ScheduleListProps {
  schedules: ScheduleData[];
  buses: BusData[];
  routes: RouteData[];
  operators: User[];
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  initialValues: ScheduleFormValues;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validationSchema: any;
  onSubmit: (values: ScheduleFormValues) => Promise<void>;
  handleEditPrice: (Schedule: ScheduleData) => void;
  handleEditStartTime: (Schedule: ScheduleData) => void;
  handleEditEndTime: (Schedule: ScheduleData) => void;
  handleEditBus: (bus: BusData,schedule: ScheduleData, buses: BusData[]) => void;
  handleDelete: (scheduleId: string) => void;
  selectedDates: Date[];
  setSelectedDates: React.Dispatch<React.SetStateAction<Date[]>>;
}

export const ScheduleList: React.FC<ScheduleListProps> = ({
  schedules,
  buses,
  routes,
  operators,
  isModalOpen,
  setIsModalOpen,
  initialValues,
  validationSchema,
  onSubmit,
  handleEditPrice,
  handleEditStartTime,
  handleEditEndTime,
  handleEditBus,
  handleDelete,
  selectedDates,
  setSelectedDates,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Schedule List</h2>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          Add New Schedule
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold">Add New Schedule</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Price</label>
                    <Field
                      type="number"
                      name="price"
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    />
                    <ErrorMessage name="price" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Start Dates</label>
                    <DatePicker
                      multiple
                      value={selectedDates}
                      onChange={(dates: Date[]) => setSelectedDates(dates)}
                      inline
                    />
                    <ErrorMessage name="startDates" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Start Time</label>
                    <Field
                      type="time"
                      name="startTime"
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    />
                    <ErrorMessage name="startTime" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">End Time</label>
                    <Field
                      type="time"
                      name="endTime"
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    />
                    <ErrorMessage name="endTime" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Bus</label>
                    <Field
                      as="select"
                      name="busId"
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    >
                      <option value="">Select a bus</option>
                      {buses.map((bus) => (
                        <option key={bus.id} value={bus.id}>
                          {bus.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="busId" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Route</label>
                    <Field
                      as="select"
                      name="routeId"
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    >
                      <option value="">Select a route</option>
                      {routes.map((route) => (
                        <option key={route.id} value={route.id}>
                          {route.source} - {route.destination}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="routeId" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">operator</label>
                    <Field
                      as="select"
                      name="operatorId"
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    >
                      <option value="">Select a operator</option>
                      {operators.map((operator) => (
                        <option key={operator.id} value={operator.id}>
                          {operator.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="operatorId" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="rounded-md bg-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                      Save Schedule
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Price
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Start Time
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                End Time
              </th>

              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                bus
              </th>

              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                operator
              </th>

              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Status
              </th>
             
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Action
              </th>


            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {schedules.map((schedule) => (
              <tr key={schedule.id} className="hover:bg-gray-50">
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {schedule.price}
                    <button className="text-blue-500 hover:text-blue-700" onClick={() => handleEditPrice(schedule)}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536M9 12l6-6 3 3-6 6H9v-3z" />
                      </svg>
                    </button>
                  </div>

                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {formatTime(schedule.startTime)}
                    <button className="text-blue-500 hover:text-blue-700" onClick={() => handleEditStartTime(schedule)}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536M9 12l6-6 3 3-6 6H9v-3z" />
                      </svg>
                    </button>
                  </div>
                </td>

                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {formatTime(schedule.endTime)}
                    <button className="text-blue-500 hover:text-blue-700" onClick={() => handleEditEndTime(schedule)}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536M9 12l6-6 3 3-6 6H9v-3z" />
                      </svg>
                    </button>
                  </div>
                </td>

                
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {buses
                      .filter((bus) => bus.id === schedule.busId) 
                      .map((bus) => (
                        <div>
                        <span key={bus.id}>{bus.name}</span> 
                        <button className="text-blue-500 hover:text-blue-700" onClick={() => handleEditBus(bus,schedule,buses)}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536M9 12l6-6 3 3-6 6H9v-3z" />
                      </svg>
                    </button>
                     </div>
                      ))}
                      
                  </div>
                </td>

                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {operators
                      .filter((operator) => operator.id === schedule.operatorId) 
                      .map((operator) => (
                        <span key={operator.id}>{operator.name}</span> 
                      ))}
                  </div>
                </td>

                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {schedule.status}
                  </div>
                </td>

               



                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center space-x-4">
                    <button className="text-red-500 hover:text-red-700" onClick={() => handleDelete(schedule.id)}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};