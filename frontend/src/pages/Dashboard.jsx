import axios from "axios";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import React, { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [envRecords, setEnvRecords] = useState([]);
  const [salesRecords, setSalesRecords] = useState([]);
  const [lossRecords, setLossRecords] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [measures, setMeasures] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/allmeatproducts")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));

    axios
      .get("http://localhost:3000/auth/allenvironment")
      .then((res) => setEnvRecords(res.data))
      .catch((err) => console.error("Environmental Error:", err));

    axios
      .get("http://localhost:3000/auth/allsalesdistribution")
      .then((res) => setSalesRecords(res.data))
      .catch((err) => console.error("Sales Error:", err));

    axios
      .get("http://localhost:3000/auth/alllosses")
      .then((res) => setLossRecords(res.data))
      .catch((err) => console.error("Loss Error:", err));

    axios
      .get("http://localhost:3000/auth/allalerts")
      .then((res) => setAlerts(res.data))
      .catch((err) => console.error("Alert Error:", err));

    axios
      .get("http://localhost:3000/auth/allmeasures")
      .then((res) => setMeasures(res.data))
      .catch((err) => console.error("Preventative Measures Fetch Error:", err));
  }, []);

  const generateMeatChartData = () => {
    const dataMap = products.reduce((acc, p) => {
      const type = p.meat_type;
      const qty = parseFloat(p.quantity_kg) || 0;
      acc[type] = (acc[type] || 0) + qty;
      return acc;
    }, {});
    return {
      labels: Object.keys(dataMap),
      datasets: [
        {
          label: "Total Quantity (kg)",
          data: Object.values(dataMap),
          backgroundColor: "rgba(153, 102, 255, 0.6)",
          borderColor: "rgba(153, 102, 255, 1)",
          borderWidth: 1,
        },
      ],
    };
  };

  const generateEnvChartData = () => {
    return {
      labels: envRecords.map((r) => new Date(r.timestamp).toLocaleString()),
      datasets: [
        {
          label: "Temperature (°C)",
          data: envRecords.map((r) => r.temperature_celsius),
          borderColor: "rgba(255, 99, 132, 1)",
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          tension: 0.3,
        },
        {
          label: "Humidity (%)",
          data: envRecords.map((r) => r.humidity_percent),
          borderColor: "rgba(54, 162, 235, 1)",
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          tension: 0.3,
        },
      ],
    };
  };

  const generateSalesChartData = () => {
    return {
      labels: salesRecords.map((r) => r.sale_date?.split("T")[0]),
      datasets: [
        {
          label: "Quantity Sold",
          data: salesRecords.map((r) => r.quantity_sold),
          backgroundColor: "rgba(54, 162, 235, 0.6)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    };
  };

  const generateLossChartData = () => {
    const sorted = [...lossRecords].sort(
      (a, b) => new Date(a.loss_date) - new Date(b.loss_date)
    );
    return {
      labels: sorted.map((r) => new Date(r.loss_date).toLocaleDateString()),
      datasets: [
        {
          label: "Loss Quantity (kg)",
          data: sorted.map((r) => parseFloat(r.loss_quantity || 0)),
          borderColor: "rgba(255, 159, 64, 1)",
          backgroundColor: "rgba(255, 159, 64, 0.3)",
          tension: 0.3,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { position: "top" }, tooltip: { enabled: true } },
    scales: { y: { beginAtZero: true } },
  };

  return (
    <div className="container mt-5">
      <div
        className="mb-4"
        style={{
          backgroundColor: "#f5f3f2",
          padding: "15px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        }}
      >
        <h3 className="text-center text-black mb-4">
          Traceability, Operational Efficiency, and Quality Control in the Meat
          Supply Chain
        </h3>
      </div>

      {/* Meat Products */}
      <Section
        title="Meat Products Summary"
        tableHeaders={[
          "ID",
          "Meat Type",
          "Qty (kg)",
          "Processed",
          "Storage",
          "Batch",
          "Expires",
        ]}
        tableData={products.map((p) => [
          p.product_id,
          p.meat_type,
          p.quantity_kg,
          p.processing_date?.split("T")[0],
          p.storage_location,
          p.batch_number,
          p.expiration_date?.split("T")[0],
        ])}
        chartTitle="Total Meat Quantity by Type"
        chart={
          <Bar
            data={generateMeatChartData()}
            options={chartOptions}
            height={220}
          />
        }
      />

      {/* Environmental */}
      <Section
        title="Environmental Conditions"
        tableHeaders={[
          "ID",
          "Batch",
          "Timestamp",
          "Temp (°C)",
          "Humidity (%)",
          "Location",
        ]}
        tableData={envRecords.map((r) => [
          r.record_id,
          r.batch_number,
          new Date(r.timestamp).toLocaleString(),
          r.temperature_celsius,
          r.humidity_percent,
          r.location,
        ])}
        chartTitle="Temp & Humidity Over Time"
        chart={
          <Line
            data={generateEnvChartData()}
            options={chartOptions}
            height={220}
          />
        }
      />

      {/* Sales */}
      <Section
        title="Sales Distribution Records"
        tableHeaders={[
          "Sale ID",
          "Batch",
          "Customer",
          "Qty Sold",
          "Date",
          "Destination",
        ]}
        tableData={salesRecords.map((r) => [
          r.sale_id,
          r.batch_number,
          r.customer_id,
          r.quantity_sold,
          r.sale_date?.split("T")[0],
          r.destination,
        ])}
        chartTitle="Sales Quantity Over Time"
        chart={
          <Bar
            data={generateSalesChartData()}
            options={chartOptions}
            height={220}
          />
        }
      />

      {/* Losses */}
      <Section
        title="Loss Tracking Records"
        tableHeaders={[
          "Loss ID",
          "Batch",
          "Stage",
          "Qty Lost",
          "Reason",
          "Date",
        ]}
        tableData={lossRecords.map((r) => [
          r.loss_id,
          r.batch_number,
          r.stage,
          r.loss_quantity,
          r.reason,
          r.loss_date?.split("T")[0],
        ])}
        chartTitle="Loss Quantity Over Time"
        chart={
          <Line
            data={generateLossChartData()}
            options={chartOptions}
            height={220}
          />
        }
      />

      {/* Preventative Measures */}
      <div className="mb-5">
        <h5 className="text-center">Preventative Measures</h5>
        <div className="table-responsive mt-3">
          <table className="table table-bordered text-center small">
            <thead className="table-success">
              <tr>
                <th>Measure ID</th>
                <th>Batch</th>
                <th>Action Taken</th>
                <th>Responsible</th>
                <th>Date</th>
                <th>Effectiveness</th>
              </tr>
            </thead>
            <tbody>
              {measures.map((m) => (
                <tr key={m.measure_id}>
                  <td>{m.measure_id}</td>
                  <td>{m.batch_number}</td>
                  <td>{m.action_taken}</td>
                  <td>{m.responsible_person}</td>
                  <td>{m.date_implemented?.split("T")[0]}</td>
                  <td>{m.effectiveness_note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alerts */}
      <div className="mb-5">
        <h5 className="text-center">Alerts</h5>
        <div className="table-responsive mt-3">
          <table className="table table-bordered text-center small">
            <thead className="table-danger">
              <tr>
                <th>Alert ID</th>
                <th>Batch</th>
                <th>Type</th>
                <th>Message</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((alert) => (
                <tr key={alert.alert_id}>
                  <td>{alert.alert_id}</td>
                  <td>{alert.batch_number}</td>
                  <td>{alert.alert_type}</td>
                  <td>{alert.message}</td>
                  <td>{alert.alert_date?.split("T")[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Reusable layout section component
const Section = ({ title, tableHeaders, tableData, chartTitle, chart }) => (
  <div className="d-flex flex-nowrap gap-4 mb-5">
    <div style={{ flex: "1", minWidth: "450px" }}>
      <h5 className="text-center">{title}</h5>
      <div className="table-responsive">
        <table className="table table-bordered mt-3 text-center small">
          <thead className="table-dark">
            <tr>
              {tableHeaders.map((h, idx) => (
                <th key={idx}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, rIdx) => (
              <tr key={rIdx}>
                {row.map((cell, cIdx) => (
                  <td key={cIdx}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    <div style={{ flex: "0.8", minWidth: "300px" }}>
      <h5 className="text-center mb-3">{chartTitle}</h5>
      <div className="card p-3 shadow-sm">{chart}</div>
    </div>
  </div>
);

export default Dashboard;



