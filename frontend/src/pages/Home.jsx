import axios from 'axios'
import { Link, Outlet } from 'react-router-dom'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './style.css'

const Home = () => {
  const navigate = useNavigate()

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('http://localhost:3000/auth/home', {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      if (response.status !== 201) {
        navigate('/login')
      }
    } catch (err) {
      navigate('/login')
      console.log(err)
    }
  }

  const handleLogout = (event) => {
    event.preventDefault() // Prevent default link behavior
    localStorage.removeItem('token') // Clear token
    navigate('/login') // Redirect to login
  }

  useEffect(() => {
    fetchUser()
  }, [])

  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
          <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
            <Link
              to=""
              className="d-flex align-items-center pb-3 mb-md-1 mt-md-3 me-md-auto text-white text-decoration-none"
            >
              <span className="fs-5 fw-bolder d-none d-sm-inline">
                DashBoard
              </span>
            </Link>
            <ul
              className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start"
              id="menu"
            >
              <li className="w-100">
                <Link
                  to="warehouse"
                  className="nav-link text-white px-0 align-middle"
                >
                  <i class="bi bi-people-fill"></i>
                  <span className="ms-2 d-none d-sm-inline">Warehouse Manager</span>
                </Link>
              </li>
              <li className="w-100">
                <Link
                  to="farmers"
                  className="nav-link text-white px-0 align-middle"
                >
                  <i class="bi bi-person"></i>
                  <span className="ms-2 d-none d-sm-inline">Local Farmer</span>
                </Link>
              </li>
              <li className="w-100">
                <Link
                  to="animalrecord"
                  className="nav-link text-white px-0 align-middle"
                > 
                  <i class="bi bi-bookmarks"></i>
                  <span className="ms-2 d-none d-sm-inline">Animal Record</span>
                </Link>
              </li>

              <li className="w-100">
                <Link
                  to="nutritionists"
                  className="nav-link text-white px-0 align-middle"
                >
                  <i class="bi bi-person"></i>
                  <span className="ms-2 d-none d-sm-inline">Nutritionist</span>
                </Link>
              </li>

              <li className="w-100">
                <Link
                  to="meatprep"
                  className="nav-link text-white px-0 align-middle"
                >
                  <i class="bi bi-cpu-fill"></i>
                  <span className="ms-2 d-none d-sm-inline">Meat Preparation Procedure</span>
                </Link>
              </li>

              <li className="w-100">
                <Link
                  to="meatproducts"
                  className="nav-link text-white px-0 align-middle"
                >
                  <i class="bi bi-archive"></i>
                  <span className="ms-2 d-none d-sm-inline">Meat Product</span>
                </Link>
              </li>

              <li className="w-100">
                <Link
                  to="environmentalconditions"
                  className="nav-link text-white px-0 align-middle"
                >
                  <i class="bi bi-thermometer-half"></i>
                  <span className="ms-2 d-none d-sm-inline">Environmental Conditions</span>
                </Link>
              </li>
              
              <li className="w-100">
                <Link
                  to="salesdistribution"
                  className="nav-link text-white px-0 align-middle"
                >
                  <i className="bi bi-clipboard2-data-fill"></i>
                  <span className="ms-2 d-none d-sm-inline">Sales Distribution</span>
                </Link>
              </li>
              <li className="w-100">
                <Link
                  to="losstracking"
                  className="nav-link text-white px-0 align-middle"
                >
                  <i className="bi bi-clipboard2-data-fill"></i>
                  <span className="ms-2 d-none d-sm-inline">Loss Tracking</span>
                </Link>
              </li>
              <li className="w-100">
                <Link
                  to="alerts"
                  className="nav-link text-white px-0 align-middle"
                >
                  <i class="bi bi-exclamation-triangle-fill"></i>
                  <span className="ms-2 d-none d-sm-inline">Alerts</span>
                </Link>
              </li>
              <li className="w-100">
                <Link
                  to="preventativemeasures"
                  className="nav-link text-white px-0 align-middle"
                >
                  <i class="bi bi-rulers"></i>
                  <span className="ms-2 d-none d-sm-inline">Preventative Measures</span>
                </Link>
              </li>
              <li className="w-100">
                <Link
                  to="/login"
                  onClick={handleLogout}
                  className="nav-link px-0 align-middle text-white"
                >
                  <i className="fs-4 bi-power ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Logout</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="col p-0 m-0">
            <div className="p-2 d-flex justify-content-center shadow bg-dark">
                <h4 className='text-white'>Meat Base Inventory</h4> 
            </div>
            <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Home



