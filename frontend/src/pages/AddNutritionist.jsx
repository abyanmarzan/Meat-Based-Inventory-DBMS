import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddNutritionist = () => {
  const [form, setForm] = useState({ name: '', qualification: '', contactNumber: '', email: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/auth/addnutritionist', form);
      alert('Nutritionist added!');
      navigate('/nutritionists');
    } catch (err) {
      console.error(err);
      alert('Failed to add nutritionist');
    }
  };

  return (
    <div className='d-flex justify-content-center align-items-center h-75'>
      <div className='p-4 rounded w-50 border'>
        <h2 className='mb-4 text-center'>Add Nutritionist</h2>
        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="form-control mb-2" required />
          <input name="qualification" placeholder="Qualification" value={form.qualification} onChange={handleChange} className="form-control mb-2" required />
          <input name="contactNumber" placeholder="Contact Number" value={form.contactNumber} onChange={handleChange} className="form-control mb-2" required />
          <input name="email" placeholder="Email" type="email" value={form.email} onChange={handleChange} className="form-control mb-2" required />
          <button type="submit" className="btn btn-outline-dark w-100">Add Nutritionist</button>
        </form>
      </div>
    </div>
  );
};

export default AddNutritionist;
