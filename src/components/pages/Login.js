import React, { useState } from 'react';
import '../../styles/pages/Login.css';
import { useNavigate } from 'react-router-dom';


import logo from '../../images/Logo.svg';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isForgotPassword, setIsForgotPassword] = useState(false); // State to toggle between login and forgot password
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        const loginData = {
            email: email.trim(),
            password: password,
        };

        try {
            const response = await fetch('https://be-fitness-web-1.onrender.com/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });

            if (response.ok) {
                const data = await response.json();

                // Lưu token, userID và userName vào localStorage
                localStorage.setItem('token', data.token);
                localStorage.setItem('userID', data.userID);
                localStorage.setItem('userName', data.name);

                // Kiểm tra thông tin đã được lưu vào localStorage chưa
                console.log('Stored Token:', localStorage.getItem('token'));
                console.log('Stored UserID:', localStorage.getItem('userID'));
                console.log('Stored User Name:', localStorage.getItem('userName'));

                setError('');
                navigate('/dashboard');
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Login failed.');
            }
        } catch (error) {
            setError('An error occurred during login.');
        }
    };


    const handleForgotPassword = async () => {
        if (!email) {
            setError('Please enter your email');
            return;
        }

        // Send email to backend for reset password
        try {
            const response = await fetch('https://be-fitness-web-1.onrender.com/api/users/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                setError('Check your email for reset instructions.');
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Failed to send reset instructions.');
            }
        } catch (error) {
            setError('An error occurred.');
        }
    };

    return (
        <div className="login-container">
            <img src={logo} alt="Logo" className="logo-top-left" />

            <div className="login-box">
                {isForgotPassword ? (
                    // Forgot Password Case (Case 2)
                    <>
                        <h2 className='Forgot_pw'>Forgot Password</h2>
                        <p className='enter_email'>Enter the email you used to create your account so we can send you instructions on how to reset your password.</p>
                        <div className="input-container">
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value.trim())}
                            />
                        </div>
                        {error && <p className="error-message">{error}</p>}
                        <button onClick={() => setIsForgotPassword(false)} className="back-to-login-button">
                            Back to login
                        </button>
                        <button onClick={handleForgotPassword} className="reset-password-button">
                            Reset password
                        </button>
                    </>
                ) : (
                    // Login Case (Case 1)
                    <>
                        <h2>Welcome back</h2>
                        <div className="input-container">
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value.trim())}
                            />
                        </div>
                        <div className="input-container">
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        {error && <p className="error-message">{error}</p>}
                        <p className="forgot-password" onClick={() => setIsForgotPassword(true)}>
                            Forgot Password
                        </p>
                        <button onClick={handleLogin} className="login-button">
                            Login
                        </button>
                        <p className="or-divider">or</p>

                        <p className="signup-prompt">
                            You haven't had an account? <a href="/signup" className="signup-link">Sign up</a>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};

export default Login;
