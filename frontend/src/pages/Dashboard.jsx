import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios.get('http://localhost:3000/auth/allusers')
      .then(res => setUsers(res.data))
      .catch(err => console.error('Error fetching users:', err));
  };

  const handleEditClick = (user) => {
    setEditUser({ ...user });
  };

  const handleChange = (e) => {
    setEditUser(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:3000/auth/updateuser/${editUser.id}`, editUser)
      .then(() => {
        setEditUser(null);
        fetchUsers();
      })
      .catch(err => console.error('Error updating user:', err));
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">User Dashboard</h2>

      <div className="row">
        {users.map((user) => (
          <div className="col-md-4 mb-3" key={user.id}>
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{user.username || 'No Username'}</h5>
                <p className="card-text">{user.email || 'No Email'}</p>
                <button className="btn btn-primary mt-2" onClick={() => handleEditClick(user)}>
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editUser && (
        <div className="card mt-4 p-4 shadow-sm">
          <h4 className="mb-3">Edit User</h4>
          <form onSubmit={handleUpdate}>
            <div className="mb-3">
              <label><strong>Username</strong></label>
              <input
                type="text"
                name="username"
                value={editUser.username}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="mb-3">
              <label><strong>Email</strong></label>
              <input
                type="email"
                name="email"
                value={editUser.email}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <button type="submit" className="btn btn-success w-100">
              Update User
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Dashboard;



