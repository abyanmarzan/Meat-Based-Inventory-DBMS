import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
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

const EnvironmentalConditions = () => {
  const [records, setRecords] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    batch_number: '',
    timestamp: '',
    temperature_celsius: '',
    humidity_percent: '',
    location: ''
  });

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = () => {
    axios.get('http://localhost:3000/auth/allenvironment')
      .then(res => setRecords(res.data))
      .catch(err => console.error("Error fetching data:", err));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      axios.delete(`http://localhost:3000/auth/deleteenvironment/${id}`)
        .then(() => setRecords(prev => prev.filter(r => r.record_id !== id)))
        .catch(err => console.error("Delete error:", err));
    }
  };

  const handleEdit = (record) => {
    setEditing(record.record_id);
    setForm({
      batch_number: record.batch_number,
      timestamp: record.timestamp.slice(0, 16),
      temperature_celsius: record.temperature_celsius,
      humidity_percent: record.humidity_percent,
      location: record.location
    });
  };

  const handleUpdate = () => {
    axios.put(`http://localhost:3000/auth/updateenvironment/${editing}`, form)
      .then(() => {
        setRecords(prev => prev.map(r =>
          r.record_id === editing ? { ...r, ...form } : r
        ));
        setEditing(null);
      })
      .catch(err => console.error("Update error:", err));
  };

  // --- Chart + Stats ---
  const avgTemp = records.length
    ? (records.reduce((acc, r) => acc + parseFloat(r.temperature_celsius || 0), 0) / records.length).toFixed(2)
    : 0;

  const avgHumidity = records.length
    ? (records.reduce((acc, r) => acc + parseFloat(r.humidity_percent || 0), 0) / records.length).toFixed(2)
    : 0;

  const generateChartData = () => {
    const dataByBatch = {};

    records.forEach(r => {
      const batch = r.batch_number || 'Unknown';
      const temp = parseFloat(r.temperature_celsius) || 0;
      const hum = parseFloat(r.humidity_percent) || 0;

      if (!dataByBatch[batch]) {
        dataByBatch[batch] = { tempSum: 0, humSum: 0, count: 0 };
      }

      dataByBatch[batch].tempSum += temp;
      dataByBatch[batch].humSum += hum;
      dataByBatch[batch].count += 1;
    });

    const labels = Object.keys(dataByBatch);
    const avgTemps = labels.map(b => (dataByBatch[b].tempSum / dataByBatch[b].count).toFixed(2));
    const avgHums = labels.map(b => (dataByBatch[b].humSum / dataByBatch[b].count).toFixed(2));

    return {
      labels,
      datasets: [
        {
          label: 'Avg Temp (°C)',
          data: avgTemps,
          backgroundColor: 'rgba(255, 99, 132, 0.6)'
        },
        {
          label: 'Avg Humidity (%)',
          data: avgHums,
          backgroundColor: 'rgba(54, 162, 235, 0.6)'
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
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Values' }
      },
      x: {
        title: { display: true, text: 'Batch Number' }
      }
    }
  };

  return (
    <div className="container mt-5">
      <h3 className="text-center text-decoration-underline">Environmental Conditions</h3>

      {/* Cards */}
      <div className="row mt-4">
        <div className="col-md-4">
          <div className="card shadow-sm p-3">
            <h6 className="text-center">Total Records</h6>
            <h3 className="text-center">{records.length}</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm p-3">
            <h6 className="text-center">Average Temp (°C)</h6>
            <h3 className="text-center">{avgTemp}</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm p-3">
            <h6 className="text-center">Average Humidity (%)</h6>
            <h3 className="text-center">{avgHumidity}</h3>
          </div>
        </div>
      </div>

      {/* Table */}
      <table className="table table-bordered text-center mt-4">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Batch</th>
            <th>Timestamp</th>
            <th>Temp (°C)</th>
            <th>Humidity (%)</th>
            <th>Location</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map(record => (
            <tr key={record.record_id}>
              <td>{record.record_id}</td>
              <td>{record.batch_number}</td>
              <td>{new Date(record.timestamp).toLocaleString()}</td>
              <td>{record.temperature_celsius}</td>
              <td>{record.humidity_percent}</td>
              <td>{record.location}</td>
              <td>
                <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(record)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(record.record_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Link to="/addenvironment" className="btn btn-outline-dark mt-3">Add Environmental Record</Link>

      {/* Edit Form */}
      {editing && (
        <div className="card p-3 mt-4">
          <h5>Edit Environmental Record</h5>
          {Object.keys(form).map(field => (
            <input
              key={field}
              className="form-control mb-2"
              type={field === 'timestamp' ? 'datetime-local' : 'text'}
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
        <h5 className="text-center mb-3">Avg Temperature & Humidity by Batch</h5>
        <div className="card p-3 shadow-sm">
          <Bar data={generateChartData()} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default EnvironmentalConditions;