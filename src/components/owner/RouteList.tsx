import React from 'react';
import { Plus, MapPin, X } from 'lucide-react';
import { RouteData } from '../../types/Route';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

interface RouteFormValues {
  source: string;
  destination: string;
  distance: string;
  estimatedTime: string;
  dropStops:string,
  pickupStops: string;
}

interface RouteListProps {
  routes: RouteData[];
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  newRoute: RouteFormValues;
  handleSubmit: (values: RouteFormValues) => Promise<void>;
  handleEditSource: (route: RouteData) => void;
  handleEditDestination: (route: RouteData) => void;
  handleAddDropStops: (route: RouteData) => void;
  handleAddPickupStops: (route: RouteData) => void;
  handleEditDistance: (route: RouteData) => void;
  handleEditEstimatedTime: (route: RouteData) => void;
  handleDelete: (routeId: string) => void;
}

// Update validation schema
const RouteSchema = Yup.object().shape({
  source: Yup.string()
    .trim()
    .matches(/^[^\s].*$/, 'Source cannot start with a space')
    .matches(/^[A-Za-z\s]+$/, 'Source must contain only letters')
    .required('Source is required'),
  destination: Yup.string()
    .trim()
    .matches(/^[^\s].*$/, 'Destination cannot start with a space')
    .matches(/^[A-Za-z\s]+$/, 'Destination must contain only letters')
    .required('Destination is required'),
  distance: Yup.string()
    .required('Distance is required')
    .test('is-valid-number', 'Must be a number greater than 0', value => {
      const num = parseFloat(value);
      return !isNaN(num) && num > 0;
    }),
  estimatedTime: Yup.string()
    .required('Estimated time is required')
    .test('is-valid-number', 'Must be a number greater than 0', value => {
      const num = parseFloat(value);
      return !isNaN(num) && num > 0;
    }),
  pickupStops: Yup.string()
    .required('pickup Stops are required')
    .test('valid-stops', 'Must contain at least one stop', value => {
      if (!value) return false;
      const stopsArray = value.split(',').map(stop => stop.trim());
      return stopsArray.length > 0 && stopsArray.every(stop => stop.length > 0);
    }),
  dropStops: Yup.string()
    .required('drop Stops are required')
    .test('valid-stops', 'Must contain at least one stop', value => {
      if (!value) return false;
      const stopsArray = value.split(',').map(stop => stop.trim());
      return stopsArray.length > 0 && stopsArray.every(stop => stop.length > 0);
    })
});

export const RouteList: React.FC<RouteListProps> = ({
  routes,
  isModalOpen,
  setIsModalOpen,
  newRoute,
  handleSubmit,
  handleEditSource,
  handleEditDestination,
  handleAddDropStops,
  handleAddPickupStops,
  handleEditDistance,
  handleEditEstimatedTime,
  handleDelete,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Route List</h2>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          Add New Route
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold">Add New Route</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>
            <Formik
              initialValues={newRoute}
              validationSchema={RouteSchema}
              onSubmit={handleSubmit}
            >
              {({isSubmitting}) => (
                <Form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Source</label>
                    <Field
                      type="text"
                      name="source"
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    />
                    <ErrorMessage name="source" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Destination</label>
                    <Field
                      type="text"
                      name="destination"
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    />
                    <ErrorMessage name="destination" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Distance (km)</label>
                    <Field
                      type="number"
                      name="distance"
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                      step="0.1"
                    />
                    <ErrorMessage name="distance" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Estimated Time (hours)</label>
                    <Field
                      type="number"
                      name="estimatedTime"
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                      step="0.5"
                    />
                    <ErrorMessage name="estimatedTime" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Pickup Stops (comma-separated)
                    </label>
                    <Field
                      type="text"
                      name="pickupStops"
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                      placeholder="Stop 1, Stop 2, Stop 3"
                    />
                    <ErrorMessage name="pickupStops" component="div" className="text-red-500 text-sm mt-1" />
                    <p className="mt-1 text-sm text-gray-500">
                      Enter multiple stops separated by commas. 
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Drop Stops (comma-separated)
                    </label>
                    <Field
                      type="text"
                      name="dropStops"
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                      placeholder="Stop 1, Stop 2, Stop 3"
                    />
                    <ErrorMessage name="dropStops" component="div" className="text-red-500 text-sm mt-1" />
                    <p className="mt-1 text-sm text-gray-500">
                      Enter multiple stops separated by commas. 
                    </p>
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
                      Save Route
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Source
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Destination
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Distance (km)
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Time (hrs)
              </th>
              {/* <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Pickup Stops
              </th> */}
              <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Stops
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Acitons
              </th>

            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
  {routes.map((route) => (
    <tr key={route.id} className="hover:bg-gray-50">
      {/* Source */}
      <td className="whitespace-nowrap px-6 py-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-900">{route.source}</span>
          <button className="text-blue-500 hover:text-blue-700" onClick={() => handleEditSource(route)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536M9 12l6-6 3 3-6 6H9v-3z" />
            </svg>
          </button>
        </div>
      </td>

      {/* Destination */}
      <td className="whitespace-nowrap px-6 py-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-900">{route.destination}</span>
          <button className="text-blue-500 hover:text-blue-700" onClick={() => handleEditDestination(route)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536M9 12l6-6 3 3-6 6H9v-3z" />
            </svg>
          </button>
        </div>
      </td>

      {/* Distance */}
      <td className="whitespace-nowrap px-6 py-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-900">{route.distance} km</span>
          <button className="text-blue-500 hover:text-blue-700" onClick={() => handleEditDistance(route)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536M9 12l6-6 3 3-6 6H9v-3z" />
            </svg>
          </button>
        </div>
      </td>

      {/* Estimated Time */}
      <td className="whitespace-nowrap px-6 py-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-900">{route.estimatedTime} hrs</span>
          <button className="text-blue-500 hover:text-blue-700" onClick={() => handleEditEstimatedTime(route)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536M9 12l6-6 3 3-6 6H9v-3z" />
            </svg>
          </button>
        </div>
      </td>

      {/* Drop Stops */}
      {/* <td className="px-6 py-4">
        <div className="text-sm font-medium text-gray-900 max-w-md break-words">
          {route.dropStops.join(' → ')}
          <button className="text-blue-500 hover:text-blue-700" onClick={() => handleAddPickupStops(route)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536M9 12l6-6 3 3-6 6H9v-3z" />
            </svg>
          </button>
        </div>
      </td> */}

      <td className="px-6 py-4">
        <div className="text-sm font-medium text-gray-900 max-w-md break-words">
          {route.pickupStops.join(' → ')}
          <button className="text-blue-500 hover:text-blue-700" onClick={() => handleAddDropStops(route)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536M9 12l6-6 3 3-6 6H9v-3z" />
            </svg>
          </button>
        </div>
      </td>

      {/* Delete Button */}
      <td>
        <div className="flex items-center space-x-4">
          <button className="text-red-500 hover:text-red-700" onClick={() => handleDelete(route.id)}>
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