// Register.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {

  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    //Get users from local storage or initialize an empty array
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    console.log(storedUsers);

    //Check if username exist
    if (storedUsers.some(user => user.username === username)) {
      alert('Username already exists. Please choose a different username.');
      return;
    }

    const newUser = { username, password }; 
    storedUsers.push(newUser); //Adds new user to the user array
    localStorage.setItem('users', JSON.stringify(storedUsers)); 

    alert('Registration successful. Please log in.');
    navigate('/login');
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
