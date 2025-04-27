import axios from "axios";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Link } from "react-router-dom";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const EnvironmentalConditions = () => {
  const [records, setRecords] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    batch_number: "",
    timestamp: "",
    temperature_celsius: "",
    humidity_percent: "",
    location: "",
  });
  const [searchTerm, setSearchTerm] = useState(""); // Search term state

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = () => {
    axios
      .get("http://localhost:3000/auth/allenvironment")
      .then((res) => setRecords(res.data))
      .catch((err) => console.error("Error fetching data:", err));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      axios
        .delete(`http://localhost:3000/auth/deleteenvironment/${id}`)
        .then(() =>
          setRecords((prev) => prev.filter((r) => r.record_id !== id))
        )
        .catch((err) => console.error("Delete error:", err));
    }
  };

  const handleEdit = (record) => {
    setEditing(record.record_id);
    setForm({
      batch_number: record.batch_number,
      timestamp: record.timestamp.slice(0, 16),
      temperature_celsius: record.temperature_celsius,
      humidity_percent: record.humidity_percent,
      location: record.location,
    });
  };

  const handleUpdate = () => {
    axios
      .put(`http://localhost:3000/auth/updateenvironment/${editing}`, form)
      .then(() => {
        setRecords((prev) =>
          prev.map((r) => (r.record_id === editing ? { ...r, ...form } : r))
        );
        setEditing(null);
      })
      .catch((err) => console.error("Update error:", err));
  };

  const avgTemp = records.length
    ? (
        records.reduce(
          (sum, r) => sum + parseFloat(r.temperature_celsius || 0),
          0
        ) / records.length
      ).toFixed(2)
    : 0;

  const avgHumidity = records.length
    ? (
        records.reduce(
          (sum, r) => sum + parseFloat(r.humidity_percent || 0),
          0
        ) / records.length
      ).toFixed(2)
    : 0;

  const uniqueBatches = [...new Set(records.map((r) => r.batch_number))].length;

  // Filter records based on search term
  const filteredRecords = records.filter((record) => {
    const search = searchTerm.toLowerCase();
    return (
      String(record.batch_number).toLowerCase().includes(search) ||
      String(record.location).toLowerCase().includes(search)
    );
  });

  // Chart data
  const generateChartData = () => {
    const labels = records.map((r) => new Date(r.timestamp).toLocaleString());
    const tempData = records.map((r) => r.temperature_celsius);
    const humidityData = records.map((r) => r.humidity_percent);

    return {
      labels,
      datasets: [
        {
          label: "Temperature (°C)",
          data: tempData,
          borderColor: "rgba(255, 99, 132, 1)",
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          tension: 0.3,
        },
        {
          label: "Humidity (%)",
          data: humidityData,
          borderColor: "rgba(54, 162, 235, 1)",
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          tension: 0.3,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: { enabled: true },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="container mt-5">
      <h3 className="text-center text-decoration-underline">
        Environmental Conditions Dashboard
      </h3>

      {/* Summary Cards */}
      <div className="row mt-4">
        <div className="col-md-4">
          <div className="card shadow-sm p-3">
            <h5 className="text-center">Average Temperature</h5>
            <div className="text-center">
              <h3>{avgTemp} °C</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm p-3">
            <h5 className="text-center">Average Humidity</h5>
            <div className="text-center">
              <h3>{avgHumidity} %</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm p-3">
            <h5 className="text-center">Unique Batches</h5>
            <div className="text-center">
              <h3>{uniqueBatches}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="d-flex justify-content-between align-items-center my-4 flex-wrap gap-2">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search by Batch or Location"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Link to="/addenvironmental" className="btn btn-outline-dark ms-3">
          Add Environmental Record
        </Link>
      </div>

      {/* Table */}
      <div className="card p-4">
        <table className="table table-bordered text-center">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Batch</th>
              <th>Timestamp</th>
              <th>Temperature (°C)</th>
              <th>Humidity (%)</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((record) => (
              <tr key={record.record_id}>
                <td>{record.record_id}</td>
                <td>{record.batch_number}</td>
                <td>{new Date(record.timestamp).toLocaleString()}</td>
                <td>{record.temperature_celsius}</td>
                <td>{record.humidity_percent}</td>
                <td>{record.location}</td>
                <td>
                  <button
                    className="btn btn-sm btn-primary me-2"
                    onClick={() => handleEdit(record)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(record.record_id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Form */}
      {editing && (
        <div className="card p-3">
          <h5>Edit Environmental Record</h5>
          {Object.keys(form).map((field) => (
            <input
              key={field}
              className="form-control mb-2"
              type={field === "timestamp" ? "datetime-local" : "text"}
              name={field}
              value={form[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              placeholder={field}
            />
          ))}
          <div className="d-flex gap-2">
            <button className="btn btn-success" onClick={handleUpdate}>
              Update
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setEditing(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="mt-5">
        <h5 className="text-center mb-3">Temperature and Humidity Over Time</h5>
        <div className="card p-3 shadow-sm">
          <Line data={generateChartData()} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default EnvironmentalConditions;


