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

const MeatProducts = () => {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    meat_type: '',
    quantity_kg: '',
    processing_date: '',
    storage_location: '',
    batch_number: '',
    expiration_date: ''
  });

  useEffect(() => {
    axios.get('http://localhost:3000/auth/allmeatproducts')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Delete this meat product?")) {
      axios.delete(`http://localhost:3000/auth/deletemeatproduct/${id}`)
        .then(() => setProducts(prev => prev.filter(p => p.product_id !== id)))
        .catch(err => console.error(err));
    }
  };

  const handleEdit = (p) => {
    setEditing(p.product_id);
    setForm({ ...p });
  };

  const handleUpdate = () => {
    axios.put(`http://localhost:3000/auth/updatemeatproduct/${editing}`, form)
      .then(() => {
        setProducts(prev => prev.map(p =>
          p.product_id === editing ? { ...p, ...form } : p
        ));
        setEditing(null);
      })
      .catch(err => console.error(err));
  };

  // Chart data generation
  const generateChartData = () => {
    const quantitiesByType = products.reduce((acc, product) => {
      const type = product.meat_type;
      const quantity = parseFloat(product.quantity_kg);
      acc[type] = (acc[type] || 0) + (isNaN(quantity) ? 0 : quantity);
      return acc;
    }, {});

    const labels = Object.keys(quantitiesByType);
    const data = Object.values(quantitiesByType);

    return {
      labels,
      datasets: [
        {
          label: 'Total Quantity (kg)',
          data,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
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
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Quantity (kg)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Meat Type'
        }
      }
    }
  };

  // Stats Calculation for the Card
  const totalQuantity = products.reduce((acc, product) => acc + parseFloat(product.quantity_kg || 0), 0);
  const totalProducts = products.length;
  const meatTypes = [...new Set(products.map(p => p.meat_type))].length;

  return (
    <div className="container mt-5">
      <h3 className="text-center text-decoration-underline">Meat Products</h3>

      {/* Card for Stats */}
      <div className="row mt-4">
        <div className="col-md-4">
          <div className="card shadow-sm p-3">
            <h5 className="text-center">Total Quantity</h5>
            <div className="text-center">
              <h3>{totalQuantity.toFixed(2)} kg</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm p-3">
            <h5 className="text-center">Total Products</h5>
            <div className="text-center">
              <h3>{totalProducts}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm p-3">
            <h5 className="text-center">Meat Types</h5>
            <div className="text-center">
              <h3>{meatTypes}</h3>
            </div>
          </div>
        </div>
      </div>

      <table className="table table-bordered mt-4 text-center">
        <thead className="table-dark">
          <tr>
            <th>ID</th><th>Meat Type</th><th>Qty (kg)</th><th>Processed</th>
            <th>Storage</th><th>Batch</th><th>Expires</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.product_id}>
              <td>{p.product_id}</td><td>{p.meat_type}</td><td>{p.quantity_kg}</td>
              <td>{p.processing_date?.split('T')[0]}</td><td>{p.storage_location}</td>
              <td>{p.batch_number}</td><td>{p.expiration_date?.split('T')[0]}</td>
              <td>
                <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(p)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.product_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to="/addmeatproduct" className="btn btn-outline-dark">Add Meat Product</Link>

      {editing && (
        <div className="card p-3 mt-4">
          <h5>Edit Meat Product</h5>
          {Object.keys(form).map(field => (
            <input key={field} className="form-control mb-2" type={field.includes("date") ? "date" : "text"}
              value={form[field]} placeholder={field} onChange={e => setForm({ ...form, [field]: e.target.value })} />
          ))}
          <div className="d-flex gap-2">
            <button className="btn btn-success" onClick={handleUpdate}>Update</button>
            <button className="btn btn-secondary" onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Chart Section */}
      <div className="mt-5">
        <h5 className="text-center mb-3">Total Meat Quantity by Type</h5>
        <div className="card p-3 shadow-sm">
          <Bar data={generateChartData()} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default MeatProducts;


