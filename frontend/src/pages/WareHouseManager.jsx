import React, { useEffect, useState } from 'react';
import axios from 'axios';

const WareHouseManager = () => {
  const [managers, setManagers] = useState([]);
  const [editingManager, setEditingManager] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', phone_number: '', email: '' });

  useEffect(() => {
    fetchManagers();
  }, []);

  const fetchManagers = () => {
    axios.get('http://localhost:3000/auth/allmanagers')
      .then(res => setManagers(res.data))
      .catch(err => console.error("Error fetching managers:", err));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this manager?")) {
      axios.delete(`http://localhost:3000/auth/deletemanager/${id}`)
        .then(() => {
          setManagers(prev => prev.filter(manager => manager.id !== id));
        })
        .catch(err => console.error("Delete error:", err));
    }
  };

  const handleEdit = (manager) => {
    setEditingManager(manager.id);
    setEditForm({
      name: manager.name,
      phone_number: manager.phone_number,
      email: manager.email
    });
  };

  const handleUpdate = () => {
    axios.put(`http://localhost:3000/auth/updatemanager/${editingManager}`, editForm)
      .then(() => {
        setManagers(prev => prev.map(m =>
          m.id === editingManager ? { ...m, ...editForm } : m
        ));
        setEditingManager(null);
      })
      .catch(err => console.error("Update error:", err));
  };

  const totalManagers = managers.length;
  const lastAdded = managers[managers.length - 1];

  return (
    <div className='px-5 mt-5'>
      <div className='d-flex justify-content-center'>
        <h3 className="text-decoration-underline">Warehouse Manager Dashboard</h3>
      </div>

      {/* Cards Section */}
      <div className="row mt-4 mb-4">
        <div className="col-md-4">
          <div className="card text-black bg-white p-3 shadow-sm">
            <h5>Total Managers</h5>
            <h3>{totalManagers}</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-black bg-white p-3 shadow-sm">
            <h5>Latest Manager</h5>
            <h6>{lastAdded ? lastAdded.name : 'N/A'}</h6>
            <p className="mb-0">{lastAdded ? lastAdded.email : 'N/A'}</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-black bg-white p-3 shadow-sm">
            <h5>Contact (Last Added)</h5>
            <p className="mb-0">{lastAdded ? lastAdded.phone_number : 'N/A'}</p>
          </div>
        </div>
      </div>

      <table className="table table-bordered text-center">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Phone Number</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {managers.map(manager => (
            <tr key={manager.id}>
              <td>{manager.id}</td>
              <td>{manager.name}</td>
              <td>{manager.phone_number}</td>
              <td>{manager.email}</td>
              <td>
                <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(manager)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(manager.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className='mt-3 mb-3'>
        <a href="/addmanager" className="btn btn-outline-dark">Add Warehouse Manager</a>
      </div>

      {editingManager && (
        <div className="card p-3 mt-4">
          <h5>Edit Manager</h5>
          <input
            className="form-control mb-2"
            type="text"
            value={editForm.name}
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            placeholder="Name"
          />
          <input
            className="form-control mb-2"
            type="text"
            value={editForm.phone_number}
            onChange={(e) => setEditForm({ ...editForm, phone_number: e.target.value })}
            placeholder="Phone Number"
          />
          <input
            className="form-control mb-2"
            type="email"
            value={editForm.email}
            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
            placeholder="Email"
          />
          <div className="d-flex gap-2">
            <button className="btn btn-success" onClick={handleUpdate}>Update</button>
            <button className="btn btn-secondary" onClick={() => setEditingManager(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WareHouseManager;



