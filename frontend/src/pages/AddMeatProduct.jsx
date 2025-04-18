import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddMeatProduct = () => {
  const [form, setForm] = useState({
    meat_type: '', quantity_kg: '', processing_date: '',
    storage_location: '', batch_number: '', expiration_date: ''
  });
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/auth/addmeatproduct', form);
      alert("Meat product added.");
      navigate("/meatproducts");
    } catch (err) {
      console.error(err);
      alert("Error adding product.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center h-90">
      <div className="p-4 rounded w-50 border">
        <h2 className="mb-4 text-center">Add Meat Product</h2>
        <form onSubmit={handleSubmit}>
          {Object.keys(form).map(field => (
            <div key={field} className="mb-3">
              <label><strong>{field.replace('_', ' ').toUpperCase()}:</strong></label>
              <input type={field.includes("date") ? "date" : "text"} name={field}
                value={form[field]} onChange={handleChange} className="form-control" required />
            </div>
          ))}
          <button className="btn btn-outline-dark w-100" type="submit">Add</button>
        </form>
      </div>
    </div>
  );
};

export default AddMeatProduct;
