import React, { useState, useEffect } from 'react';
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

const MeatPrepProcedure = () => {
  const [records, setRecords] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    product_id: '',
    MeatCutType: '',
    Weight: '',
    FatPercentage: '',
    Texture: '',
    Temperature: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios.get('http://localhost:3000/auth/allmeatprep')
      .then(res => setRecords(res.data))
      .catch(err => console.error("Fetch error:", err));
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this meat prep record?")) {
      axios.delete(`http://localhost:3000/auth/deletemeatprep/${id}`)
        .then(() => setRecords(prev => prev.filter(r => r.PrepID !== id)))
        .catch(err => console.error("Delete error:", err));
    }
  };

  const handleEdit = (record) => {
    setEditing(record.PrepID);
    setForm({ ...record });
  };

  const handleUpdate = () => {
    axios.put(`http://localhost:3000/auth/updatemeatprep/${editing}`, form)
      .then(() => {
        setRecords(prev => prev.map(r => (r.PrepID === editing ? { ...form, PrepID: editing } : r)));
        setEditing(null);
      })
      .catch(err => console.error("Update error:", err));
  };

  // --- Chart + Stats logic ---
  const generateChartData = () => {
    const weightByCutType = records.reduce((acc, r) => {
      const type = r.MeatCutType || 'Unknown';
      const weight = parseFloat(r.Weight) || 0;
      acc[type] = (acc[type] || 0) + weight;
      return acc;
    }, {});

    return {
      labels: Object.keys(weightByCutType),
      datasets: [
        {
          label: 'Total Weight (kg)',
          data: Object.values(weightByCutType),
          backgroundColor: 'rgba(153, 102, 255, 0.6)',
          borderColor: 'rgba(153, 102, 255, 1)',
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
      y: { beginAtZero: true, title: { display: true, text: 'Weight (kg)' } },
      x: { title: { display: true, text: 'Meat Cut Type' } }
    }
  };

  const avgFat = records.length
    ? (records.reduce((acc, r) => acc + parseFloat(r.FatPercentage || 0), 0) / records.length).toFixed(2)
    : 0;

  const avgTemp = records.length
    ? (records.reduce((acc, r) => acc + parseFloat(r.Temperature || 0), 0) / records.length).toFixed(2)
    : 0;

  return (
    <div className="container mt-5">
      <h3 className="text-center text-decoration-underline">Meat Preparation Procedure</h3>

      {/* Cards */}
      <div className="row mt-4">
        <div className="col-md-4">
          <div className="card shadow-sm p-3">
            <h6 className="text-center">Total Prep Records</h6>
            <h3 className="text-center">{records.length}</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm p-3">
            <h6 className="text-center">Average Fat %</h6>
            <h3 className="text-center">{avgFat}%</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm p-3">
            <h6 className="text-center">Average Temperature (°C)</h6>
            <h3 className="text-center">{avgTemp}</h3>
          </div>
        </div>
      </div>

      {/* Table */}
      <table className="table table-bordered mt-4 text-center">
        <thead className="table-dark">
          <tr>
            <th>Prep ID</th><th>Product ID</th><th>Meat Cut Type</th><th>Weight</th>
            <th>Fat %</th><th>Texture</th><th>Temperature</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map(rec => (
            <tr key={rec.PrepID}>
              <td>{rec.PrepID}</td><td>{rec.product_id}</td><td>{rec.MeatCutType}</td><td>{rec.Weight}</td>
              <td>{rec.FatPercentage}</td><td>{rec.Texture}</td><td>{rec.Temperature}</td>
              <td>
                <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(rec)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(rec.PrepID)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Link to="/addmeatprep" className="btn btn-outline-dark mt-3">Add Meat Prep Procedure</Link>

      {/* Edit Form */}
      {editing && (
        <div className="card p-3 mt-4">
          <h5>Edit Meat Prep Procedure</h5>
          {Object.keys(form).map((key) => (
            <input
              key={key}
              className="form-control mb-2"
              type={['Weight', 'FatPercentage', 'Temperature'].includes(key) ? 'number' : 'text'}
              name={key}
              value={form[key]}
              onChange={e => setForm({ ...form, [key]: e.target.value })}
              placeholder={key}
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
        <h5 className="text-center mb-3">Total Weight by Meat Cut Type</h5>
        <div className="card p-3 shadow-sm">
          <Bar data={generateChartData()} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default MeatPrepProcedure;


