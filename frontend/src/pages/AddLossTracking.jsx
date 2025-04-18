import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddLossTracking = () => {
  const [values, setValues] = useState({
    batch_number: '',
    stage: '',
    loss_quantity: '',
    reason: '',
    loss_date: ''
  });

  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/auth/addloss', values);
      alert("Loss record added successfully!");
      navigate("/losstracking");
    } catch (err) {
      console.error(err);
      alert("Failed to add loss record.");
    }
  };

  return (
    <div className='d-flex justify-content-center align-items-center h-98'>
      <div className='p-4 rounded w-50 border'>
        <h2 className='mb-4 text-center'>Add Loss Record</h2>
        <form onSubmit={handleSubmit}>
          {['batch_number', 'stage', 'loss_quantity', 'reason'].map(field => (
            <div className='mb-3' key={field}>
              <label><strong>{field.replace('_', ' ').toUpperCase()}:</strong></label>
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
          <div className='mb-3'>
            <label><strong>Loss Date:</strong></label>
            <input
              type="date"
              name="loss_date"
              value={values.loss_date}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <button type="submit" className="btn btn-outline-dark w-100">
            Add Loss Record
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddLossTracking;
