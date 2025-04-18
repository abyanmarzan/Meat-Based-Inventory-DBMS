import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const LocalFarmer = () => {
  const [farmers, setFarmers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', address: '', contactNumber: '' });

  useEffect(() => {
    axios.get('http://localhost:3000/auth/allfarmers')
      .then(res => setFarmers(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleEdit = (farmer) => {
    setEditingId(farmer.FarmerID);
    setForm({
      name: farmer.Name,
      address: farmer.Address,
      contactNumber: farmer.ContactNumber,
    });
  };

  const handleUpdate = () => {
    axios.put(`http://localhost:3000/auth/updatefarmer/${editingId}`, form)
      .then(() => {
        setFarmers(prev => prev.map(f => f.FarmerID === editingId ? { ...f, ...form } : f));
        setEditingId(null);
      });
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this farmer?")) {
      axios.delete(`http://localhost:3000/auth/deletefarmer/${id}`)
        .then(() => setFarmers(prev => prev.filter(f => f.FarmerID !== id)));
    }
  };

  const totalFarmers = farmers.length;
  const lastAdded = farmers[totalFarmers - 1];

  return (
    <div className='px-5 mt-5'>
      <h3 className="text-center text-decoration-underline">Local Farmer Dashboard</h3>

      {/* Cards Section */}
      <div className="row mt-4 mb-4">
        <div className="col-md-4">
          <div className="card text-black bg-white p-3 shadow-sm">
            <h5>Total Farmers</h5>
            <h3>{totalFarmers}</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-black bg-white p-3 shadow-sm">
            <h5>Latest Farmer</h5>
            <h6>{lastAdded ? lastAdded.Name : 'N/A'}</h6>
            <p className="mb-0">{lastAdded ? lastAdded.Address : 'N/A'}</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-black bg-white p-3 shadow-sm">
            <h5>Contact (Last Added)</h5>
            <p className="mb-0">{lastAdded ? lastAdded.ContactNumber : 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <table className="table table-bordered text-center">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Address</th>
            <th>Contact</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {farmers.map(f => (
            <tr key={f.FarmerID}>
              <td>{f.FarmerID}</td>
              <td>{f.Name}</td>
              <td>{f.Address}</td>
              <td>{f.ContactNumber}</td>
              <td>
                <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(f)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(f.FarmerID)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Link to="/addfarmer" className="btn btn-outline-dark my-3">Add Farmer</Link>

      {editingId && (
        <div className="card p-3 mt-4">
          <h5>Edit Farmer</h5>
          <input className="form-control mb-2" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="form-control mb-2" placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          <input className="form-control mb-2" placeholder="Contact Number" value={form.contactNumber} onChange={(e) => setForm({ ...form, contactNumber: e.target.value })} />
          <div className="d-flex gap-2">
            <button className="btn btn-success" onClick={handleUpdate}>Update</button>
            <button className="btn btn-secondary" onClick={() => setEditingId(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocalFarmer;
