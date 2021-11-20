import React, { Dispatch, FunctionComponent, SetStateAction } from "react";
import { useFormik } from "formik";

const TravelForm: FunctionComponent<{
  origin: string;
  destination: string;
  setOrigin: Dispatch<SetStateAction<string>>;
  setDestination: Dispatch<SetStateAction<string>>;
}> = ({ origin, destination, setOrigin, setDestination }) => {
  const formik = useFormik({
    initialValues: {
      origin,
      destination,
    },
    onSubmit: (values) => {
      setOrigin(values.origin.toUpperCase());
      setDestination(values.destination.toUpperCase());
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="flex-col md:flex-row flex items-center md:items-end justify-center"
    >
      <div className="mr-4">
        <label className="block text-white" htmlFor="origin">
          Origin
        </label>
        <input
          maxLength={2}
          type="text"
          id="origin"
          name="origin"
          className="text-input outline-none"
          onChange={formik.handleChange}
          value={formik.values.origin}
        />
      </div>
      <div className="mr-4">
        <label className="block text-white" htmlFor="destination">
          Destination
        </label>
        <input
          maxLength={2}
          id="destination"
          type="text"
          className="text-input mr-4 outline-none"
          onChange={formik.handleChange}
          value={formik.values.destination}
        />
      </div>
      <button
        disabled={!formik.values.origin || !formik.values.destination}
        className="mt-15 md:mt-0 md:ml-8 primary-button disabled:bg-gray"
        type="submit"
      >
        Submit
      </button>
    </form>
  );
};

export default TravelForm;
