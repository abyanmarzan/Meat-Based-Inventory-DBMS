import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// Chart.js imports
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const SalesDistribution = () => {
  const [records, setRecords] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    batch_number: '',
    customer_id: '',
    quantity_sold: '',
    sale_date: '',
    destination: ''
  });

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = () => {
    axios.get('http://localhost:3000/auth/allsalesdistribution')
      .then(res => setRecords(res.data))
      .catch(err => console.error("Error fetching sales distribution records:", err));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this sales distribution record?")) {
      axios.delete(`http://localhost:3000/auth/deletesalesdistribution/${id}`)
        .then(() => setRecords(prev => prev.filter(r => r.sale_id !== id)))
        .catch(err => console.error("Delete error:", err));
    }
  };

  const handleEdit = (record) => {
    setEditing(record.sale_id);
    setForm({
      batch_number: record.batch_number,
      customer_id: record.customer_id,
      quantity_sold: record.quantity_sold,
      sale_date: record.sale_date.split('T')[0],
      destination: record.destination
    });
  };

  const handleUpdate = () => {
    axios.put(`http://localhost:3000/auth/updatesalesdistribution/${editing}`, form)
      .then(() => {
        setRecords(prev => prev.map(r =>
          r.sale_id === editing ? { ...r, ...form } : r
        ));
        setEditing(null);
      })
      .catch(err => console.error("Update error:", err));
  };

  // Chart Data
  const generateChartData = () => {
    const labels = records.map(r => r.sale_date?.split('T')[0]);
    const data = records.map(r => r.quantity_sold);

    return {
      labels,
      datasets: [
        {
          label: 'Quantity Sold',
          data,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      tooltip: {
        enabled: true
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  // Summary stats
  const totalQuantitySold = records.reduce((acc, r) => acc + parseFloat(r.quantity_sold || 0), 0);
  const totalRecords = records.length;
  const uniqueDestinations = [...new Set(records.map(r => r.destination))].length;

  return (
    <div className="container mt-5">
      <div className="text-center">
        <h3 className="text-decoration-underline">Sales Distribution Dashboard</h3>
      </div>

      {/* Summary Cards */}
      <div className="row mt-4">
        <div className="col-md-4">
          <div className="card shadow-sm p-3">
            <h5 className="text-center">Total Quantity Sold</h5>
            <div className="text-center">
              <h3>{totalQuantitySold.toFixed(2)} units</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm p-3">
            <h5 className="text-center">Total Sales Records</h5>
            <div className="text-center">
              <h3>{totalRecords}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm p-3">
            <h5 className="text-center">Unique Destinations</h5>
            <div className="text-center">
              <h3>{uniqueDestinations}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-4 mt-4">
        <table className="table table-bordered text-center">
          <thead className="table-dark">
            <tr>
              <th>Sale ID</th>
              <th>Batch Number</th>
              <th>Customer ID</th>
              <th>Quantity Sold</th>
              <th>Sale Date</th>
              <th>Destination</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map(record => (
              <tr key={record.sale_id}>
                <td>{record.sale_id}</td>
                <td>{record.batch_number}</td>
                <td>{record.customer_id}</td>
                <td>{record.quantity_sold}</td>
                <td>{record.sale_date?.split('T')[0]}</td>
                <td>{record.destination}</td>
                <td>
                  <button
                    className="btn btn-sm btn-primary me-2"
                    onClick={() => handleEdit(record)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(record.sale_id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 mb-4">
        <Link to="/addsalesdistribution" className="btn btn-outline-dark">
          Add Sales Distribution Record
        </Link>
      </div>

      {editing && (
        <div className="card p-3 mt-4">
          <h5>Edit Sales Distribution Record</h5>
          {['batch_number', 'customer_id', 'quantity_sold', 'sale_date', 'destination'].map(field => (
            <input
              key={field}
              className="form-control mb-2"
              type={field === 'sale_date' ? 'date' : 'text'}
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

      {/* Chart Section */}
      <div className="mt-5">
        <h5 className="text-center mb-3">Sales Quantity Over Time</h5>
        <div className="card p-3 shadow-sm">
          <Bar data={generateChartData()} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default SalesDistribution;


