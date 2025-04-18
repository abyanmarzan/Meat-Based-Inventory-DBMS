import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddPreventativeMeasure = () => {
  const [values, setValues] = useState({
    batch_number: '',
    action_taken: '',
    responsible_person: '',
    date_implemented: '',
    effectiveness_note: ''
  });

  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/auth/addmeasure', values);
      alert("Preventative Measure added!");
      navigate('/preventativemeasures');
    } catch (err) {
      console.error(err);
      alert("Error adding preventative measure");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center h-97">
      <div className="p-4 rounded w-50 border">
        <h2 className="text-center mb-4">Add Preventative Measure</h2>
        <form onSubmit={handleSubmit}>
          {Object.keys(values).map(field => (
            <div className="mb-3" key={field}>
              <label><strong>{field.replace('_', ' ').toUpperCase()}:</strong></label>
              <input
                type={field.includes('date') ? 'date' : 'text'}
                name={field}
                value={values[field]}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
          ))}
          <button type="submit" className="btn btn-outline-dark w-100">Add</button>
        </form>
      </div>
    </div>
  );
};

export default AddPreventativeMeasure;
