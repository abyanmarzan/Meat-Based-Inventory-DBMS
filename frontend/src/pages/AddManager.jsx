import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddManager = () => {
  const [values, setValues] = useState({
    name: '',
    phone_number: '',
    email: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/auth/addmanager', values);

      alert('Warehouse manager added successfully!');
      console.log(res.data);

      // Reset form
      setValues({
        name: '',
        phone_number: '',
        email: '',
      });

      navigate('/wareHouse');
    } catch (err) {
      console.error(err);
      alert('Failed to add warehouse manager. Please check your input or server.');
    }
  };

  return (
    <div className='d-flex justify-content-center align-items-center h-75'>
      <div className='p-4 rounded w-50 border'>
        <h2 className='mb-4 text-center'>Add a New Warehouse Manager</h2>
        <form onSubmit={handleSubmit}>
          <div className='mb-3'>
            <label htmlFor="name"><strong>Name:</strong></label>
            <input
              type="text"
              name="name"
              placeholder="Enter Name"
              value={values.name}
              onChange={handleChange}
              className="form-control rounded-0"
              required
            />
          </div>

          <div className='mb-3'>
            <label htmlFor="phone_number"><strong>Phone Number:</strong></label>
            <input
              type="text"
              name="phone_number"
              placeholder="Enter Phone Number"
              value={values.phone_number}
              onChange={handleChange}
              className="form-control rounded-0"
              required
            />
          </div>

          <div className='mb-3'>
            <label htmlFor="email"><strong>Email:</strong></label>
            <input
              type="email"
              name="email"
              autoComplete="off"
              placeholder="Enter Email"
              value={values.email}
              onChange={handleChange}
              className="form-control rounded-0"
              required
            />
          </div>
          <button type="submit" className="btn btn-outline-dark w-100 rounded-0">
            Add Warehouse Manager
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddManager;



