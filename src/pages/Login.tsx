import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogIn } from 'lucide-react';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('username', username);
            formData.append('password', password);

            const response = await axios.post('/api/auth/login', formData);
            const { access_token, role } = response.data; // Assuming backend returns role

            localStorage.setItem('token', access_token);
            localStorage.setItem('role', role || (username === 'admin' ? 'admin' : 'staff'));

            if (role === 'admin' || username === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/staff/dashboard');
            }
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card glass">
                <div className="login-header">
                    <img src="/images/neco.png" alt="NECO Logo" className="logo" />
                    <h1>Staff Data Portal</h1>
                    <p>Sign in to manage your information</p>
                </div>

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="username">Username (File No)</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your File No"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password (YYMMDD)</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter date of birth"
                            required
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" className="btn-primary login-btn" disabled={loading}>
                        {loading ? 'Authenticating...' : <><LogIn size={20} /> Login</>}
                    </button>
                </form>
            </div>

            <style>{`
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #008844 0%, #004422 100%);
          padding: 1rem;
        }
        .login-card {
          width: 100%;
          max-width: 400px;
          padding: 2.5rem;
          text-align: center;
        }
        .login-header {
          margin-bottom: 2rem;
        }
        .logo {
          width: 80px;
          margin-bottom: 1rem;
        }
        .login-header h1 {
          font-size: 1.5rem;
          color: var(--primary);
          margin-bottom: 0.5rem;
        }
        .login-header p {
          color: var(--text-muted);
          font-size: 0.9rem;
        }
        .form-group {
          text-align: left;
          margin-bottom: 1.5rem;
        }
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          font-size: 0.9rem;
        }
        .login-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 1rem;
        }
        .error-message {
          color: var(--error);
          background-color: rgba(229, 57, 53, 0.1);
          padding: 0.8rem;
          border-radius: 6px;
          margin-bottom: 1rem;
          font-size: 0.85rem;
        }
      `}</style>
        </div>
    );
};

export default Login;
