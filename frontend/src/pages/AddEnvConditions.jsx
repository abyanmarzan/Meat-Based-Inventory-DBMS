import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddEnvironmental = () => {
  const [values, setValues] = useState({
    batch_number: "",
    timestamp: "",
    temperature_celsius: "",
    humidity_percent: "",
    location: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/auth/addenvironmental", values);
      alert("Record added!");
      navigate("/environmentalconditions");
    } catch (err) {
      console.error(err);
      alert("Failed to add record.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center h-100">
      <div className="p-4 border rounded w-50">
        <h2 className="mb-4 text-center">Add Environmental Condition</h2>
        <form onSubmit={handleSubmit}>
          {[
            "batch_number",
            "temperature_celsius",
            "humidity_percent",
            "location",
          ].map((field) => (
            <div className="mb-3" key={field}>
              <label>
                <strong>{field.replace("_", " ").toUpperCase()}:</strong>
              </label>
              <input
                type="text"
                name={field}
                value={values[field]}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
          ))}
          <div className="mb-3">
            <label>
              <strong>Timestamp:</strong>
            </label>
            <input
              type="datetime-local"
              name="timestamp"
              value={values.timestamp}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <button className="btn btn-outline-dark w-100" type="submit">
            Add Record
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEnvironmental;
