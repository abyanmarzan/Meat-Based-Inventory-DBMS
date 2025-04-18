import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Nutritionist = () => {
  const [nutritionists, setNutritionists] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', qualification: '', contactNumber: '', email: '' });

  useEffect(() => {
    fetchNutritionists();
  }, []);

  const fetchNutritionists = () => {
    axios.get('http://localhost:3000/auth/allnutritionists')
      .then(res => setNutritionists(res.data))
      .catch(err => console.error(err));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this nutritionist?")) {
      axios.delete(`http://localhost:3000/auth/deletenutritionist/${id}`)
        .then(() => setNutritionists(prev => prev.filter(n => n.NutritionistID !== id)))
        .catch(err => console.error(err));
    }
  };

  const handleEdit = (nutritionist) => {
    setEditingId(nutritionist.NutritionistID);
    setForm({
      name: nutritionist.Name,
      qualification: nutritionist.Qualification,
      contactNumber: nutritionist.ContactNumber,
      email: nutritionist.Email,
    });
  };

  const handleUpdate = () => {
    axios.put(`http://localhost:3000/auth/updatenutritionist/${editingId}`, form)
      .then(() => {
        setNutritionists(prev =>
          prev.map(n => n.NutritionistID === editingId ? { ...n, ...form } : n)
        );
        setEditingId(null);
      })
      .catch(err => console.error(err));
  };

  const totalNutritionists = nutritionists.length;
  const latest = nutritionists[totalNutritionists - 1];

  return (
    <div className='px-5 mt-5'>
      <h3 className="text-center text-decoration-underline">Nutritionist Dashboard</h3>

      {/* Dashboard Cards */}
      <div className="row mt-4 mb-4">
        <div className="col-md-4">
          <div className="card text-black bg-white p-3 shadow-sm">
            <h5>Total Nutritionists</h5>
            <h3>{totalNutritionists}</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-black bg-white p-3 shadow-sm">
            <h5>Latest Nutritionist</h5>
            <h6>{latest ? latest.Name : 'N/A'}</h6>
            <p className="mb-0">{latest ? latest.Qualification : 'N/A'}</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-black bg-white p-3 shadow-sm">
            <h5>Email (Last Added)</h5>
            <p className="mb-0">{latest ? latest.Email : 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <table className="table table-bordered text-center mt-4">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Qualification</th>
            <th>Contact</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {nutritionists.map(n => (
            <tr key={n.NutritionistID}>
              <td>{n.NutritionistID}</td>
              <td>{n.Name}</td>
              <td>{n.Qualification}</td>
              <td>{n.ContactNumber}</td>
              <td>{n.Email}</td>
              <td>
                <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(n)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(n.NutritionistID)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="my-3">
        <Link to="/addnutritionist" className="btn btn-outline-dark">Add Nutritionist</Link>
      </div>

      {editingId && (
        <div className="card p-3 mt-4">
          <h5>Edit Nutritionist</h5>
          <input className="form-control mb-2" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="form-control mb-2" placeholder="Qualification" value={form.qualification} onChange={(e) => setForm({ ...form, qualification: e.target.value })} />
          <input className="form-control mb-2" placeholder="Contact Number" value={form.contactNumber} onChange={(e) => setForm({ ...form, contactNumber: e.target.value })} />
          <input className="form-control mb-2" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <div className="d-flex gap-2">
            <button className="btn btn-success" onClick={handleUpdate}>Update</button>
            <button className="btn btn-secondary" onClick={() => setEditingId(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Nutritionist;
