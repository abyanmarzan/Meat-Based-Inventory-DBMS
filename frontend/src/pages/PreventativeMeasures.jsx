import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const PreventativeMeasures = () => {
  const [measures, setMeasures] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    batch_number: '',
    action_taken: '',
    responsible_person: '',
    date_implemented: '',
    effectiveness_note: ''
  });

  useEffect(() => {
    fetchMeasures();
  }, []);

  const fetchMeasures = () => {
    axios.get('http://localhost:3000/auth/allmeasures')
      .then(res => setMeasures(res.data))
      .catch(err => console.error("Fetch error:", err));
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this preventative measure?")) {
      axios.delete(`http://localhost:3000/auth/deletemeasure/${id}`)
        .then(() => setMeasures(prev => prev.filter(m => m.measure_id !== id)))
        .catch(err => console.error("Delete error:", err));
    }
  };

  const handleEdit = (measure) => {
    setEditing(measure.measure_id);
    setForm({
      batch_number: measure.batch_number,
      action_taken: measure.action_taken,
      responsible_person: measure.responsible_person,
      date_implemented: measure.date_implemented?.split('T')[0],
      effectiveness_note: measure.effectiveness_note
    });
  };

  const handleUpdate = () => {
    axios.put(`http://localhost:3000/auth/updatemeasure/${editing}`, form)
      .then(() => {
        setMeasures(prev => prev.map(m => m.measure_id === editing ? { ...m, ...form } : m));
        setEditing(null);
      })
      .catch(err => console.error("Update error:", err));
  };

  return (
    <div className="container mt-5">
      <h3 className="text-center text-decoration-underline">Preventative Measures</h3>

      <table className="table table-bordered text-center mt-4">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Batch Number</th>
            <th>Action Taken</th>
            <th>Responsible Person</th>
            <th>Date Implemented</th>
            <th>Effectiveness</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {measures.map(measure => (
            <tr key={measure.measure_id}>
              <td>{measure.measure_id}</td>
              <td>{measure.batch_number}</td>
              <td>{measure.action_taken}</td>
              <td>{measure.responsible_person}</td>
              <td>{measure.date_implemented?.split('T')[0]}</td>
              <td>{measure.effectiveness_note}</td>
              <td>
                <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(measure)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(measure.measure_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Link to="/addpreventativemeasures" className="btn btn-outline-dark">Add New Measure</Link>

      {editing && (
        <div className="card p-3 mt-4">
          <h5>Edit Preventative Measure</h5>
          {Object.keys(form).map(key => (
            <input
              key={key}
              className="form-control mb-2"
              type={key.includes('date') ? 'date' : 'text'}
              placeholder={key}
              value={form[key]}
              onChange={e => setForm({ ...form, [key]: e.target.value })}
            />
          ))}
          <div className="d-flex gap-2">
            <button className="btn btn-success" onClick={handleUpdate}>Update</button>
            <button className="btn btn-secondary" onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreventativeMeasures;
