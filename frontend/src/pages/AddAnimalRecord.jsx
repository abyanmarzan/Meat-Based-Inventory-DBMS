import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddAnimalRecord = () => {
  const [form, setForm] = useState({
    FarmerID: '',
    Species: '',
    Weight: '',
    SlaughterDate: '',
    NutritionistID: '',
    CheckupDate: '',
    CheckupNotes: ''
  });

  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/auth/addanimal', form);
      alert("Animal record added successfully!");
      navigate("/animalrecord");
    } catch (err) {
      console.error(err);
      alert("Failed to add record");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center h-90">
      <div className="border rounded p-4 w-50">
        <h2 className="text-center mb-4">Add Animal Record</h2>
        <form onSubmit={handleSubmit}>
          {Object.keys(form).map(field => (
            <div className="mb-3" key={field}>
              <label><strong>{field.replace(/([A-Z])/g, ' $1')}</strong></label>
              <input
                type={field.toLowerCase().includes("date") ? "date" : "text"}
                name={field}
                value={form[field]}
                onChange={e => setForm({ ...form, [field]: e.target.value })}
                className="form-control"
                required
              />
            </div>
          ))}
          <button type="submit" className="btn btn-outline-dark w-100">Add Animal</button>
        </form>
      </div>
    </div>
  );
};

export default AddAnimalRecord;
