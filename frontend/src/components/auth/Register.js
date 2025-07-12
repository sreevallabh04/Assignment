import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import config, { getApiUrl } from '../../config/api';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await axios.post(getApiUrl(config.endpoints.auth.register), { username, email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/board');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          required 
        />
        <input 
          type="email" 
          placeholder="Email Address" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Password (min 6 characters)" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          minLength="6"
        />
        <button type="submit" disabled={loading}>
          {loading ? <span className="loading"></span> : 'Create Account'}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
      <p style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
        Already have an account? <Link to="/login" style={{ color: '#667eea', textDecoration: 'none', fontWeight: '600' }}>Sign In</Link>
      </p>
    </div>
  );
}

export default Register; 