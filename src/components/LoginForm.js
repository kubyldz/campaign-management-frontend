import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/auth.css';
import api from '../utils/api';

const LoginForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', formData);
            
            if (response.data && response.data.token) {
                localStorage.setItem('token', response.data.token);
                
                api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
                
                localStorage.setItem('user', JSON.stringify(response.data.user));
                
                navigate('/campaigns');
            } else {
                setError('Geçersiz yanıt alındı');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Login failed.');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 className="auth-title">Login</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit} autoComplete="on">
                    <div className="form-group">
                        <input
                            type="text"
                            name="username"
                            className="form-control"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            autoComplete="username"
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            autoComplete="current-password"
                        />
                    </div>
                    <button type="submit" className="auth-button">
                        Login
                    </button>
                </form>
                <Link to="/register" className="auth-link">
                    Create Acccount
                </Link>
            </div>
        </div>
    );
};

export default LoginForm;
