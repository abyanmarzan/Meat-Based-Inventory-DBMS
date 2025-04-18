import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddMeatPrepProcedure = () => {
  const [form, setForm] = useState({
    product_id: '',
    MeatCutType: '',
    Weight: '',
    FatPercentage: '',
    Texture: '',
    Temperature: ''
  });

  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/auth/addmeatprep', form);
      alert("Record added successfully!");
      navigate('/meatprepprocedure');
    } catch (err) {
      console.error(err);
      alert("Failed to add record.");
    }
  };

  return (
    <div className='d-flex justify-content-center align-items-center h-95'>
      <div className='p-4 rounded w-50 border'>
        <h2 className='mb-4 text-center'>Add Meat Prep Procedure</h2>
        <form onSubmit={handleSubmit}>
          {Object.keys(form).map(key => (
            <div className="mb-3" key={key}>
              <label><strong>{key.replace(/([A-Z])/g, ' $1').toUpperCase()}</strong></label>
              <input
                type={key === 'Weight' || key === 'FatPercentage' || key === 'Temperature' ? 'number' : 'text'}
                name={key}
                value={form[key]}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
          ))}
          <button type="submit" className="btn btn-outline-dark w-100">Add Record</button>
        </form>
      </div>
    </div>
  );
};

export default AddMeatPrepProcedure;
