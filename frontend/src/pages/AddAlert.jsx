import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddAlert = () => {
  const [form, setForm] = useState({
    batch_number: '',
    alert_type: '',
    message: '',
    alert_date: ''
  });

  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/auth/addalert', form);
      alert("Alert added successfully!");
      navigate("/alerts");
    } catch (err) {
      console.error(err);
      alert("Failed to add alert.");
    }
  };

  return (
    <div className='d-flex justify-content-center align-items-center h-75'>
      <div className='p-4 rounded w-50 border'>
        <h2 className='mb-4 text-center'>Add New Alert</h2>
        <form onSubmit={handleSubmit}>
          {['batch_number', 'alert_type', 'message'].map(field => (
            <div className='mb-3' key={field}>
              <label><strong>{field.replace('_', ' ').toUpperCase()}:</strong></label>
              <input
                type="text"
                name={field}
                value={form[field]}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
          ))}
          <div className='mb-3'>
            <label><strong>Alert Date:</strong></label>
            <input
              type="date"
              name="alert_date"
              value={form.alert_date}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <button type="submit" className="btn btn-outline-dark w-100">Add Alert</button>
        </form>
      </div>
    </div>
  );
};

export default AddAlert;
