import React, { useState } from "react";
import { MapPin, Calendar, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage, FormikProps } from "formik";
import * as Yup from "yup";
import { searchDestinations, searchSources } from '../../../api/userApi';

const SearchForm: React.FC = () => {
  // const [searchType, setSearchType] = useState("basic");
  const [fromSuggestions, setFromSuggestions] = useState<string[]>([]);
  const [toSuggestions, setToSuggestions] = useState<string[]>([]);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const navigate = useNavigate();

  const initialValues = {
    fromCity: "",
    toCity: "",
    date: ""
  };

  const validationSchema = Yup.object({
    fromCity: Yup.string()
      .required("From city is required")
      .matches(/^\S.*$/, "From city must not start with spaces"),
    toCity: Yup.string()
      .required("To city is required")
      .matches(/^\S.*$/, "To city must not start with spaces"),
    date: Yup.date()
      .required("Date is required")
      .test("is-today-or-future", "Travel date must be today or in the future", function (value) {
        return value && new Date(value).setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0);
      })
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  const handleFromCitySearch = async (query: string, _setFieldValue: (field: string, value: any) => void) => {
    if (query.length < 2) {
      setFromSuggestions([]);
      return;
    }

    try {
      const sources = await searchSources(query);
      setFromSuggestions(sources.data);
      setShowFromSuggestions(true);
    } catch (error) {
      console.error("Error fetching source cities:", error);
      setFromSuggestions([]);
    }
  };
 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  const handleToCitySearch = async (query: string, _setFieldValue: (field: string, value: any) => void) => {
    if (query.length < 2) {
      setToSuggestions([]);
      return;
    }

    try {
      const destinations = await searchDestinations(query);
      setToSuggestions(destinations.data);
      setShowToSuggestions(true);
    } catch (error) {
      console.error("Error fetching destinations:", error);
      setToSuggestions([]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto -mt-16 relative z-10 px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 backdrop-blur-sm bg-white/90">
        {/* Search Type Toggle */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-xl p-1 bg-gray-50 border border-gray-100">
            {/* <button
              type="button"
              onClick={() => setSearchType("basic")}
              className={`px-8 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                searchType === "basic"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Basic
            </button> */}
            {/* <button
              type="button"
              onClick={() => setSearchType("planner")}
              className={`px-8 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                searchType === "planner"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Trip Planner
            </button> */}
          </div>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            navigate("/searchresult", {
              state: {
                from: values.fromCity,
                to: values.toCity,
                dateCome: values.date
              }
            });
          }}
        >
          {(formikProps: FormikProps<typeof initialValues>) => (
            <Form className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* From City */}
                <div className="relative group min-h-[85px]">
                  <label htmlFor="fromCity" className="block text-sm font-medium text-gray-700 mb-2">
                    From
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-blue-500 transition-colors" />
                    <Field
                      type="text"
                      id="fromCity"
                      name="fromCity"
                      className="pl-12 w-full rounded-xl border border-gray-200 py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50 hover:bg-gray-50/80"
                      placeholder="Enter departure city"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        handleFromCitySearch(e.target.value, formikProps.setFieldValue);
                        formikProps.handleChange(e);
                      }}
                      onBlur={() => {
                        setTimeout(() => {
                          setShowFromSuggestions(false);
                        }, 200);
                      }}
                    />
                    <ErrorMessage name="fromCity" component="p" className="absolute text-red-500 text-sm mt-1" />
                    {showFromSuggestions && fromSuggestions.length > 0 && (
                      <ul className="absolute z-10 bg-white border w-full mt-1 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {fromSuggestions.map((source, index) => (
                          <li
                            key={index}
                            className="p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                            onClick={() => {
                              formikProps.setFieldValue('fromCity', source);
                              setShowFromSuggestions(false);
                            }}
                          >
                            {source}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* To City */}
                <div className="relative group min-h-[85px]">
                  <label htmlFor="toCity" className="block text-sm font-medium text-gray-700 mb-2">
                    To
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-blue-500 transition-colors" />
                    <Field
                      type="text"
                      id="toCity"
                      name="toCity"
                      className="pl-12 w-full rounded-xl border border-gray-200 py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50 hover:bg-gray-50/80"
                      placeholder="Enter destination city"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        handleToCitySearch(e.target.value, formikProps.setFieldValue);
                        formikProps.handleChange(e);
                      }}
                      onBlur={() => {
                        setTimeout(() => {
                          setShowToSuggestions(false);
                        }, 200);
                      }}
                    />
                    <ErrorMessage name="toCity" component="p" className="absolute text-red-500 text-sm mt-1" />
                    {showToSuggestions && toSuggestions.length > 0 && (
                      <ul className="absolute z-10 bg-white border w-full mt-1 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {toSuggestions.map((destination, index) => (
                          <li
                            key={index}
                            className="p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                            onClick={() => {
                              formikProps.setFieldValue('toCity', destination);
                              setShowToSuggestions(false);
                            }}
                          >
                            {destination}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Travel Date */}
                <div className="relative group min-h-[85px]">
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                    Travel Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-blue-500 transition-colors" />
                    <Field
                      type="date"
                      id="date"
                      name="date"
                      className="pl-12 w-full rounded-xl border border-gray-200 py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50 hover:bg-gray-50/80"
                    />
                    <ErrorMessage name="date" component="p" className="absolute text-red-500 text-sm mt-1" />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-12 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 flex items-center gap-2 group"
                >
                  Go to search
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default SearchForm;