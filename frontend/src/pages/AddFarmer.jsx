import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddFarmer = () => {
  const [form, setForm] = useState({ name: '', address: '', contactNumber: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/auth/addfarmer', form);
      alert('Farmer added!');
      navigate('/farmers');
    } catch (err) {
      console.error(err);
      alert('Failed to add farmer');
    }
  };

  return (
    <div className='d-flex justify-content-center align-items-center h-75'>
      <div className='p-4 rounded w-50 border'>
        <h2 className='mb-4 text-center'>Add Farmer</h2>
        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="form-control mb-2" required />
          <input name="address" placeholder="Address" value={form.address} onChange={handleChange} className="form-control mb-2" required />
          <input name="contactNumber" placeholder="Contact Number" value={form.contactNumber} onChange={handleChange} className="form-control mb-2" required />
          <button type="submit" className="btn btn-outline-dark w-100">Add Farmer</button>
        </form>
      </div>
    </div>
  );
};

export default AddFarmer;
