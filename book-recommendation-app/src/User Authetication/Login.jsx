/* eslint-disable react/prop-types */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login({ onLogin }) {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const navigate = useNavigate();

  const loginSubmit = async (e) => {
    e.preventDefault();

    try {
      //POST to /login
      const response = await axios.post('http://localhost:3001/login', { username, password });

      console.log('Login successful:', response.data);
      localStorage.setItem('token', response.data.jwt); //Stores JWT token
      localStorage.setItem('user', JSON.stringify({ userId: response.data.userId, username: response.data.username })); //Stores user info
      onLogin(response.data.username); //Updates login state in App.jsx
      navigate('/');
    }

    catch (error) {
      console.error('Login failed:', error.response ? error.response.data : error.message);

      //Show error message from backend if possible
      alert((error.response && error.response.data && error.response.data.message) || 'Login failed. Invalid credentials!');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={loginSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Log In</button>
      </form>
    </div>
  );
}

export default Login;
