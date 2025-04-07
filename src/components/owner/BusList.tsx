import React from 'react';
import { Bus, Plus, X } from 'lucide-react';
import { BusData } from '../../types/Bus';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

interface BusListProps {
  buses: BusData[];
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  handleSubmit: (values: {
    name: string;
    type: 'seater' | 'sleeper';
    status: 'Active' | 'Inactive';
    ac: "true" | "false";
    fileBuffer: File;
    seatsTotal: string;
  }) => void;
  handleEditName: (bus: BusData) => void;
  handleEditType: (bus: BusData) => void;
  handleEditStatus: (bus: BusData) => void;
  handleEditTotalSeats: (bus: BusData) => void;
  handleDelete: (busId: string) => void;
}

export const BusList: React.FC<BusListProps> = ({
  buses,
  isModalOpen,
  setIsModalOpen,
  handleSubmit,
  handleEditName,
  handleEditType,
  handleEditStatus,
  // handleEditTotalSeats,
  handleDelete
}) => {
  const validationSchema = Yup.object({
    name: Yup.string()
      .required('Bus name is required')
      .matches(/^\S.*$/, 'Bus name must not start with spaces')
      .matches(/.*\S.*/, 'Bus name cannot be only spaces'),
    type: Yup.string()
      .required('Bus type is required')
      .oneOf(['seater', 'sleeper'], 'Invalid bus type'),
    status: Yup.string()
      .required('Status is required')
      .oneOf(['Active', 'Inactive'], 'Invalid status'),
    ac: Yup.string()
      .required('ac or not is required')
      .oneOf(["true", "false"], 'Invalid bus type'),
    seatsTotal: Yup.string()
      .required('Total seats is required')
      .matches(/^[1-9]\d*$/, 'Seats must be greater than 0 and not start with 0'),
    // fileBuffer: Yup.string()
    //   .required('rc is required')
   
  });

  const initialValues = {
    name: '',
    type: 'seater' as const,
    status: 'Active' as const,
    ac: "true" as const,
    seatsTotal: '',
    fileBuffer: null
  };


  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bus className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Bus List</h2>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          <Plus className="h-5 w-5" />
          Add New Bus
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold">Add New Bus</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={(values, { resetForm }) => {
                handleSubmit(values);
                resetForm();
              }}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Bus Name</label>
                    <Field
                      type="text"
                      name="name"
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <Field
                      as="select"
                      name="type"
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    >
                      <option value="seater">Seater</option>
                      <option value="sleeper">Sleeper</option>
                    </Field>
                    <ErrorMessage
                      name="type"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <Field
                      as="select"
                      name="status"
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </Field>
                    <ErrorMessage
                      name="status"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">AC</label>
                    <Field
                      as="select"
                      name="ac"
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    >
                      <option value="true">yes</option>
                      <option value="false">No</option>
                    </Field>
                    <ErrorMessage
                      name="ac"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Total Seats</label>
                    <Field
                      type="number"
                      name="seatsTotal"
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    />
                    <ErrorMessage
                      name="seatsTotal"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                 

                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700">Bus Name</label>
                    <Field
                      type="file"
                      name="fileBuffer"
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    />
                    <ErrorMessage
                      name="fileBuffer"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div> */}

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
                      Save Bus
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}

<div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow">
  <table className="w-full table-fixed divide-y divide-gray-200">
    <thead className="bg-gray-50">
      <tr>
        <th scope="col" className="w-1/4 px-6 py-4 text-left text-sm font-semibold text-gray-900">Bus Name</th>
        <th scope="col" className="w-1/6 px-6 py-4 text-left text-sm font-semibold text-gray-900">Type</th>
        <th scope="col" className="w-1/6 px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
        <th scope="col" className="w-1/6 px-6 py-4 text-left text-sm font-semibold text-gray-900">Total Seats</th>
        <th scope="col" className="w-1/6 px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-200 bg-white">
      {buses.map((bus) => (
        <tr key={bus.id} className="hover:bg-gray-50">
          <td className="px-6 py-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-900">{bus.name}</span>
              <button className="text-blue-500 hover:text-blue-700" onClick={() => handleEditName(bus)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536M9 12l6-6 3 3-6 6H9v-3z" />
                </svg>
              </button>
            </div>
          </td>
          <td className="px-6 py-4">
            <div className="flex items-center space-x-2">
              <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                bus.type === 'sleeper' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
              }`}>{bus.type}</span>
              <button className="text-blue-500 hover:text-blue-700" onClick={() => handleEditType(bus)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536M9 12l6-6 3 3-6 6H9v-3z" />
                </svg>
              </button>
            </div>
          </td>
          <td className="px-6 py-4">
            <div className="flex items-center space-x-2">
              <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                bus.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>{bus.status}</span>
              <button className="text-blue-500 hover:text-blue-700" onClick={() => handleEditStatus(bus)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536M9 12l6-6 3 3-6 6H9v-3z" />
                </svg>
              </button>
            </div>
          </td>
          <td className="px-6 py-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">{bus.seatsTotal}</span>
              {/* <button className="text-blue-500 hover:text-blue-700" onClick={() => handleEditTotalSeats(bus)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536M9 12l6-6 3 3-6 6H9v-3z" />
                </svg>
              </button> */}
            </div>
          </td>
          <td className="px-6 py-4">
            <div className="flex items-center space-x-4">
              <button className="text-red-500 hover:text-red-700" onClick={() => handleDelete(bus.id)}>
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