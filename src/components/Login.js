import React, { useState } from 'react';
import '../assets/styles/Login.css';
import 'font-awesome/css/font-awesome.min.css';


const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:8083/api/auth/google'; // Redirect to backend for Google OAuth
    };

    const handleFacebookLogin = () => {
        window.location.href = 'http://localhost:8083/api/auth/facebook'; // Redirect to backend for Facebook OAuth
    };

    const handleTwitterLogin = () => {
        window.location.href = 'http://localhost:8083/api/auth/twitter'; // Redirect to backend for Twitter OAuth
    };


    const validateForm = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address');
            return false;
        }
        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters long');
            return false;
        }
        return true;
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:8083/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(formData),
            });

            // Log the entire response for debugging
            console.log('Response status:', response.status);
            const responseData = await response.json();
            console.log('Response data:', responseData);

            if (response.ok) {
                // Check the structure of the response
                const userData = responseData.user;
                console.log('User data:', userData);

                // Assuming the user object is nested in the response
                const userRole = userData?.role || 'ROLE_USER';

                // Store user data in localStorage for persistence
                localStorage.setItem('user', JSON.stringify(userData));

                // Redirect based on the user's role
                switch (userRole) {
                    case 'ROLE_ADMIN':
                        window.location.href = '/admindashboard';
                        break;
                    case 'ROLE_MANAGER':
                        window.location.href = '/managerdashboard';
                        break;
                    case 'ROLE_STAFF':
                        window.location.href = '/staffdashboard';
                        break;
                    case 'ROLE_ACCOUNTANT':
                        window.location.href = '/accountantdashboard';
                        break;
                    default:
                        window.location.href = '/userdashboard';
                }
            } else {
                // More detailed error handling
                const errorMessage = responseData.error || responseData.message || 'Login failed';
                setError(errorMessage);
                console.error('Login error:', errorMessage);
            }
        } catch (err) {
            console.error('Catch block error:', err);
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div>
            <div className="railway-lights"></div>
            <div className="train-track"></div>
            <div className="moving-train">
                🚂
                <span className="smoke" style={{ top: '-20px', left: '-10px' }}>💨</span>
                <span className="smoke" style={{ top: '-30px', left: '-20px' }}>💨</span>
            </div>

            <div className="container">
                <div className="login-container">
                    <div className="login-image">
                        <h1 className="mb-4">Welcome to SmartRail</h1>
                        <p className="text-center">Your journey begins here!</p>
                    </div>

                    <div className="login-form">
                        <h2 className="form-title">Hop Aboard</h2>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>

                            <div className="form-group position-relative">
                                <label htmlFor="password">Password</label>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="form-control"
                                    id="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    required
                                />
                                <i
                                    className={`password-toggle fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
                                    onClick={togglePasswordVisibility}
                                    title="Toggle password visibility"
                                ></i>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary w-100"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Logging in...' : 'Login'}
                            </button>
                        </form>

                        <div className="social-login-section">
                            <p className="social-login-text">___Or login with social media___</p>
                            <div className="social-login">
                                <button onClick={handleGoogleLogin} className="social-btn google"><i
                                    className="fab fa-google"></i></button>
                                <button onClick={handleFacebookLogin} className="social-btn facebook"><i
                                    className="fab fa-facebook"></i></button>
                                <button onClick={handleTwitterLogin} className="social-btn twitter"><i
                                    className="fab fa-twitter"></i></button>
                            </div>
                        </div>
                        <div className="links">
                            <a href="/forgot-password">Forgot Password?</a> | <a href="/register">Sign Up</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;