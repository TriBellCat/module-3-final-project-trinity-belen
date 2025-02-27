/* eslint-disable react/prop-types */

import React from 'react';
import axiosInstance from '../axiosInstance.jsx';

function UserProfile({ onLogout }) {
  const [userProfile, setUserProfile] = React.useState(null);

  React.useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        console.log("No token found, user not logged in.");
        return;
      }

      const response = await axiosInstance.get('/user', { headers: { Authorization: `Bearer ${token}` } });
      setUserProfile(response.data.user);
    };

    fetchUserProfile();
  }, [onLogout]);

  const clearLocalStorageButton = () => {
    if (confirm("WARNING: This will delete all your data, including your profile(s)!")) {
      localStorage.clear();
      alert("Local storage is now empty!");
      onLogout();
    }
  };

  //Calls delete from backend
  const deleteAccount = async () => {
    if (confirm("WARNING: This will permanently delete your account! Are you sure?")) {
      const token = localStorage.getItem('token');

      const response = await axiosInstance.delete('/delete-account', {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log("Account deletion successful:", response.data);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      alert(response.data.message || "Your account has been deleted.");
      onLogout();
    }
  };

  return (
    <div className='mt-6'>
      <h2 className='text-5xl text-gray-900 dark:text-white'>
        User Profile
      </h2>
      {userProfile ? (
        <div>
          <p>Welcome, {userProfile.user_name}!</p>
          <p>Email: {userProfile.email}</p>
        </div>
      ) : (
        <p>Loading user profile...</p>
      )
      }
      <button 
        onClick={onLogout}
        className='px-6 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80'  
      >Logout</button>
      <button 
        onClick={deleteAccount}
        className='px-6 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80'    
      >
        Delete Account</button>
      <button 
        onClick={clearLocalStorageButton}
        className='px-6 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80'  
      >Reset Local Storage</button>
    </div>
  );
}
export default UserProfile;
