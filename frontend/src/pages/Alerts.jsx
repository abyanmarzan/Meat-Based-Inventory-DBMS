import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// Chart.js
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const AlertsDashboard = () => {
  const [alerts, setAlerts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    batch_number: '',
    alert_type: '',
    message: '',
    alert_date: ''
  });

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = () => {
    axios.get('http://localhost:3000/auth/allalerts')
      .then(res => setAlerts(res.data))
      .catch(err => console.error("Fetch error:", err));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this alert?")) {
      axios.delete(`http://localhost:3000/auth/deletealert/${id}`)
        .then(() => setAlerts(prev => prev.filter(a => a.alert_id !== id)))
        .catch(err => console.error("Delete error:", err));
    }
  };

  const handleEdit = (alert) => {
    setEditing(alert.alert_id);
    setForm({
      batch_number: alert.batch_number,
      alert_type: alert.alert_type,
      message: alert.message,
      alert_date: alert.alert_date?.split('T')[0]
    });
  };

  const handleUpdate = () => {
    axios.put(`http://localhost:3000/auth/updatealert/${editing}`, form)
      .then(() => {
        setAlerts(prev => prev.map(a =>
          a.alert_id === editing ? { ...a, ...form } : a
        ));
        setEditing(null);
      })
      .catch(err => console.error("Update error:", err));
  };

  const generateChartData = () => {
    const dateCounts = alerts.reduce((acc, a) => {
      const date = a.alert_date?.split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    const labels = Object.keys(dateCounts);
    const data = Object.values(dateCounts);

    return {
      labels,
      datasets: [
        {
          label: 'Alerts Per Day',
          data,
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      tooltip: { enabled: true }
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

  const totalAlerts = alerts.length;
  const uniqueBatchNumbers = [...new Set(alerts.map(a => a.batch_number))].length;
  const uniqueTypes = [...new Set(alerts.map(a => a.alert_type))].length;

  return (
    <div className="container mt-5">
      <div className="text-center">
        <h3 className="text-decoration-underline">Alerts Dashboard</h3>
      </div>

      {/* Summary Cards */}
      <div className="row mt-4">
        <div className="col-md-4">
          <div className="card shadow-sm p-3">
            <h5 className="text-center">Total Alerts</h5>
            <h3 className="text-center">{totalAlerts}</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm p-3">
            <h5 className="text-center">Unique Batches</h5>
            <h3 className="text-center">{uniqueBatchNumbers}</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm p-3">
            <h5 className="text-center">Alert Types</h5>
            <h3 className="text-center">{uniqueTypes}</h3>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card mt-4 p-4">
        <table className="table table-bordered text-center">
          <thead className="table-dark">
            <tr>
              <th>Alert ID</th>
              <th>Batch Number</th>
              <th>Alert Type</th>
              <th>Message</th>
              <th>Alert Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map(alert => (
              <tr key={alert.alert_id}>
                <td>{alert.alert_id}</td>
                <td>{alert.batch_number}</td>
                <td>{alert.alert_type}</td>
                <td>{alert.message}</td>
                <td>{alert.alert_date?.split('T')[0]}</td>
                <td>
                  <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(alert)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(alert.alert_id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 mb-4">
        <Link to="/addalerts" className="btn btn-outline-dark">
          Add New Alert
        </Link>
      </div>

      {/* Edit Form */}
      {editing && (
        <div className="card p-3 mt-4">
          <h5>Edit Alert</h5>
          {['batch_number', 'alert_type', 'message', 'alert_date'].map(field => (
            <input
              key={field}
              className="form-control mb-2"
              type={field === 'alert_date' ? 'date' : 'text'}
              value={form[field]}
              onChange={e => setForm({ ...form, [field]: e.target.value })}
              placeholder={field}
            />
          ))}
          <div className="d-flex gap-2">
            <button className="btn btn-success" onClick={handleUpdate}>Update</button>
            <button className="btn btn-secondary" onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="mt-5">
        <h5 className="text-center mb-3">Alerts Frequency Over Time</h5>
        <div className="card p-3 shadow-sm">
          <Bar data={generateChartData()} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default AlertsDashboard;



