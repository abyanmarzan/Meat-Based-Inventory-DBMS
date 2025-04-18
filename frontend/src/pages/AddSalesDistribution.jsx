import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddSalesDistribution = () => {
  const [values, setValues] = useState({
    batch_number: '',
    customer_id: '',
    quantity_sold: '',
    sale_date: '',
    destination: ''
  });

  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/auth/addsalesdistribution', values);
      alert("Sales distribution record added successfully!");
      navigate("/salesdistribution");
    } catch (err) {
      console.error(err);
      alert("Failed to add sales distribution record. Please check your input or server.");
    }
  };

  return (
    <div className='d-flex justify-content-center align-items-center h-95'>
      <div className='p-4 rounded w-50 border'>
        <h2 className='mb-4 text-center'>Add New Sales Distribution Record</h2>
        <form onSubmit={handleSubmit}>
          {['batch_number', 'customer_id', 'quantity_sold', 'destination'].map(field => (
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
            <label><strong>Sale Date:</strong></label>
            <input
              type="date"
              name="sale_date"
              value={values.sale_date}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <button type="submit" className="btn btn-outline-dark w-100">
            Add Sales Distribution Record
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddSalesDistribution;
