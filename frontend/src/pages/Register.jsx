import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import bgImage from './inventory.webp';


const Register = () => {
    const [values, setValues] = useState({
        username: '',
        email: '',
        password: ''
    });

    const navigate = useNavigate();

    const handleChanges = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/auth/register', values);
            if (response.status === 201) {
                navigate('/login');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const cardStyle = {
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        padding: '30px',
        width: '400px',
        color: '#fff',
    };

    const navStyle = {
        backgroundColor: '#f8f9fa',
        padding: '10px 20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        position: 'relative',
        height: '60px',
    };

    const centerStyle = {
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: '20px',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    };

    const rightStyle = {
        position: 'absolute',
        right: '20px',
        top: '50%',
        transform: 'translateY(-50%)',
    };

    return (
        <>
            <nav style={navStyle}>
                <div style={centerStyle}>
                    <h4 className='text-black'>Meat Base Inventory</h4>
                </div>
                <div style={rightStyle}>
                    <Link to="/login" className="btn btn-outline-primary">Login</Link>
                </div>
            </nav>

        
            <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#f0f0f0' }}>
                <div className="card" style={cardStyle}>
                    <h2 className="text-center mb-4">Register</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">Username</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter Username"
                                name="username"
                                onChange={handleChanges}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Enter Email"
                                name="email"
                                onChange={handleChanges}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Enter Password"
                                name="password"
                                onChange={handleChanges}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-light w-100">Submit</button>
                    </form>
                    <div className="text-center mt-3">
                        <span style={{ color: '#fff' }}>Already have an account? </span>
                        <Link to="/login" style={{ color: '#fff', fontWeight: 'bold' }}>Login</Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Register;





