import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [email, setEmail] = React.useState('');
  const navigate = useNavigate();

  const registerSubmit = async (e) => {
    e.preventDefault();

    try {
      //POST to /register
      const response = await axios.post('http://localhost:3001/register', { username, password, email });

      console.log('Registration successful:', response.data);

      //Show message from backend if available
      alert(response.data.message || 'Registration successful. Please log in.');
      
      navigate('/login');
    }
    catch (error) {
      console.error('Registration failed:', error.response ? error.response.data : error.message);

      //Show error message from backend if available
      alert((error.response && error.response.data && error.response.data.message) || 'Registration failed. Please try again.');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={registerSubmit}>
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
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            minLength="8"
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
