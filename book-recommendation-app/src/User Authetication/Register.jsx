import React from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance.jsx';

function Register() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [email, setEmail] = React.useState('');
  const navigate = useNavigate();

  const registerSubmit = async (e) => {
    e.preventDefault();

    try {
      //POST to /register
      const response = await axiosInstance.post('/register', { username, password, email });

      console.log('Registration successful:', response.data);

      //Show message from backend if available
      alert(response.data.message || 'Registration successful. Please log in.');

      navigate('/login');
    }
    catch (error) {
      console.error('Registration failed:', error.response ? error.response.data : error.message);
      alert((error.response && error.response.data && error.response.data.message) || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200 dark:bg-gray-800">
      <div className="w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-700">
        <div className="px-6 py-4 ">
          <div className="flex justify-center mx-auto">
            <span
              className="bi--book-half cursor-pointer"
              onClick={() => navigate('/')}
            >
            </span>
          </div>
          <h3 className="mt-3 text-xl font-medium text-center text-gray-600 dark:text-gray-200">Welcome!</h3>
          <p className="mt-1 text-center text-gray-500 dark:text-gray-400">Register New Account</p>
          <form onSubmit={registerSubmit}>
            <div className="w-full mt-4">
              <label>Username</label>
              <input
                type="text"
                placeholder="Username"
                aria-label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>
            <div className="w-full mt-4">
              <label>Email</label>
              <input
                type="email"
                placeholder="Email"
                aria-label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>
            <div className="w-full mt-4">
              <label>Password</label>
              <input
                type="password"
                placeholder="Password"
                aria-label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>
            <div className="flex items-center justify-between mt-4">
              <button
                type="submit"
                className="px-6 py-2 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
              >Register</button>
              <a
                href="#"
                className="text-sm text-gray-600 dark:text-gray-200 hover:text-gray-500"
                onClick={() => navigate('/login')}
              >
                Login
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
