import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

const LossTracking = () => {
  const [records, setRecords] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    batch_number: '',
    stage: '',
    loss_quantity: '',
    reason: '',
    loss_date: ''
  });

  useEffect(() => {
    fetchLosses();
  }, []);

  const fetchLosses = () => {
    axios.get('http://localhost:3000/auth/alllosses')
      .then(res => setRecords(res.data))
      .catch(err => console.error("Error fetching loss data:", err));
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this loss record?")) {
      axios.delete(`http://localhost:3000/auth/deleteloss/${id}`)
        .then(() => setRecords(prev => prev.filter(r => r.loss_id !== id)))
        .catch(err => console.error("Delete error:", err));
    }
  };

  const handleEdit = (record) => {
    setEditing(record.loss_id);
    setForm({
      batch_number: record.batch_number,
      stage: record.stage,
      loss_quantity: record.loss_quantity,
      reason: record.reason,
      loss_date: record.loss_date?.split('T')[0]
    });
  };

  const handleUpdate = () => {
    axios.put(`http://localhost:3000/auth/updateloss/${editing}`, form)
      .then(() => {
        setRecords(prev =>
          prev.map(r => (r.loss_id === editing ? { ...r, ...form } : r))
        );
        setEditing(null);
      })
      .catch(err => console.error("Update error:", err));
  };

  const totalLossQty = records.reduce((sum, r) => sum + parseFloat(r.loss_quantity || 0), 0).toFixed(2);
  const uniqueStages = [...new Set(records.map(r => r.stage))].length;
  const uniqueLossBatches = [...new Set(records.map(r => r.batch_number))].length;

  const generateChartData = () => {
    const sorted = [...records].sort((a, b) => new Date(a.loss_date) - new Date(b.loss_date));
    const labels = sorted.map(r => new Date(r.loss_date).toLocaleDateString());
    const data = sorted.map(r => r.loss_quantity);

    return {
      labels,
      datasets: [{
        label: 'Loss Quantity',
        data,
        borderColor: 'rgba(255, 159, 64, 1)',
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        tension: 0.3
      }]
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

  return (
    <div className="container mt-5">
      <h3 className="text-center text-decoration-underline">Loss Tracking Dashboard</h3>

      {/* Summary Cards */}
      <div className="row mt-4">
        <div className="col-md-4">
          <div className="card shadow-sm p-3">
            <h5 className="text-center">Total Loss Quantity</h5>
            <div className="text-center"><h3>{totalLossQty}</h3></div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm p-3">
            <h5 className="text-center">Unique Stages</h5>
            <div className="text-center"><h3>{uniqueStages}</h3></div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm p-3">
            <h5 className="text-center">Unique Batches</h5>
            <div className="text-center"><h3>{uniqueLossBatches}</h3></div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card p-4 mt-4">
        <table className="table table-bordered text-center">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Batch</th>
              <th>Stage</th>
              <th>Loss Qty</th>
              <th>Reason</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map(record => (
              <tr key={record.loss_id}>
                <td>{record.loss_id}</td>
                <td>{record.batch_number}</td>
                <td>{record.stage}</td>
                <td>{record.loss_quantity}</td>
                <td>{record.reason}</td>
                <td>{record.loss_date?.split('T')[0]}</td>
                <td>
                  <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(record)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(record.loss_id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Link to="/addlosstracking" className="btn btn-outline-dark my-4">Add Loss Record</Link>

      {/* Edit Form */}
      {editing && (
        <div className="card p-3">
          <h5>Edit Loss Record</h5>
          {Object.keys(form).map(field => (
            <input
              key={field}
              className="form-control mb-2"
              type={field === 'loss_date' ? 'date' : 'text'}
              name={field}
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
        <h5 className="text-center mb-3">Loss Quantity Over Time</h5>
        <div className="card p-3 shadow-sm">
          <Line data={generateChartData()} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default LossTracking;

