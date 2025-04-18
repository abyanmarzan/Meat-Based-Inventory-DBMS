import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const AnimalRecord = () => {
  const [animals, setAnimals] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    FarmerID: '',
    Species: '',
    Weight: '',
    SlaughterDate: '',
    NutritionistID: '',
    CheckupDate: '',
    CheckupNotes: ''
  });

  useEffect(() => {
    fetchAnimals();
  }, []);

  const fetchAnimals = () => {
    axios.get('http://localhost:3000/auth/allanimals')
      .then(res => setAnimals(res.data))
      .catch(err => console.error("Error fetching animal data:", err));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this animal record?")) {
      axios.delete(`http://localhost:3000/auth/deleteanimal/${id}`)
        .then(() => setAnimals(prev => prev.filter(r => r.AnimalID !== id)))
        .catch(err => console.error("Delete error:", err));
    }
  };

  const handleEdit = (record) => {
    setEditing(record.AnimalID);
    setForm({
      FarmerID: record.FarmerID,
      Species: record.Species,
      Weight: record.Weight,
      SlaughterDate: record.SlaughterDate.split('T')[0],
      NutritionistID: record.NutritionistID,
      CheckupDate: record.CheckupDate.split('T')[0],
      CheckupNotes: record.CheckupNotes
    });
  };

  const handleUpdate = () => {
    axios.put(`http://localhost:3000/auth/updateanimal/${editing}`, form)
      .then(() => {
        setAnimals(prev => prev.map(r =>
          r.AnimalID === editing ? { ...r, ...form } : r
        ));
        setEditing(null);
      })
      .catch(err => console.error("Update error:", err));
  };

  const cowCount = animals.filter(a => a.Species.toLowerCase() === 'cow').length;
  const goatCount = animals.filter(a => a.Species.toLowerCase() === 'goat').length;

  const chartData = {
    labels: animals.map(a => a.SlaughterDate?.split('T')[0]),
    datasets: [
      {
        label: 'Animal Weight',
        data: animals.map(a => a.Weight),
        backgroundColor: 'rgba(75, 192, 192, 0.6)'
      }
    ]
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content mb-4">
        <div className="card text-black bg-white p-3 m-3 w-25">
          <h5>Total Cows</h5>
          <h3>{cowCount}</h3>
        </div>
        <div className="card text-black bg-White p-3 m-3 w-25">
          <h5>Total Goats</h5>
          <h3>{goatCount}</h3>
        </div>
      </div>

      <h3 className="text-center text-decoration-underline">Animal Records</h3>

      <table className="table table-bordered mt-3 text-center">
        <thead className="table-dark">
          <tr>
            <th>ID</th><th>Farmer</th><th>Species</th><th>Weight</th><th>Slaughter Date</th>
            <th>Nutritionist</th><th>Checkup Date</th><th>Notes</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {animals.map(a => (
            <tr key={a.AnimalID}>
              <td>{a.AnimalID}</td>
              <td>{a.FarmerID}</td>
              <td>{a.Species}</td>
              <td>{a.Weight}</td>
              <td>{a.SlaughterDate?.split('T')[0]}</td>
              <td>{a.NutritionistID}</td>
              <td>{a.CheckupDate?.split('T')[0]}</td>
              <td>{a.CheckupNotes}</td>
              <td>
                <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(a)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(a.AnimalID)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Link to="/addanimalrecord" className="btn btn-outline-dark mt-3">Add Animal</Link>

      {editing && (
        <div className="card mt-4 p-3">
          <h5>Edit Animal</h5>
          {Object.keys(form).map(key => (
            <input
              key={key}
              type={key.toLowerCase().includes("date") ? "date" : "text"}
              className="form-control mb-2"
              placeholder={key}
              value={form[key]}
              onChange={e => setForm({ ...form, [key]: e.target.value })}
            />
          ))}
          <div className="d-flex gap-2">
            <button className="btn btn-success" onClick={handleUpdate}>Update</button>
            <button className="btn btn-secondary" onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="mt-5">
        <h5 className="text-center">Animal Weight Distribution</h5>
        <div className="card p-3 shadow-sm">
          <Bar data={chartData} />
        </div>
      </div>
    </div>
  );
};

export default AnimalRecord;
