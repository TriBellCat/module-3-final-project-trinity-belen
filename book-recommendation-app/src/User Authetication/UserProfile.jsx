/* eslint-disable react/prop-types */

import React from 'react';
import axios from 'axios';

function UserProfile({ onLogout }) {
  const [userProfile, setUserProfile] = React.useState(null);
  
  React.useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        console.log("No token found, user not logged in.");
        return;
      }

      try {
        const response = await axios.get('http://localhost:3001/user', { headers: { Authorization: `Bearer ${token}` }});
        setUserProfile(response.data.user);
      }

      catch (error) {
        console.error("Error fetching user profile:", error.response ? error.response.data : error.message);

        //A way to handle errors such as token expiration
        if (error.response && error.response.status === 401) {
          alert("Your session has expired. Please log in again.");
          onLogout();
        }
      }
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

      try {
          const response = await axios.delete('http://localhost:3001/delete-account', { 
              headers: { Authorization: `Bearer ${token}` }
          });

          console.log("Account deletion successful:", response.data);
          localStorage.removeItem('user');
          localStorage.removeItem('token'); 
          alert(response.data.message || "Your account has been deleted.");
          onLogout(); 
      }
      catch (error) {
          console.error("Error deleting account:", error.response ? error.response.data : error.message);
          alert((error.response && error.response.data && error.response.data.message) || "Failed to delete account. Please try again.");
      }
    }
  };

  return (
    <div>
      <h2>User Profile</h2>
      {userProfile ? (
        <div>
          <p>Welcome, {userProfile.user_name}!</p>
          <p>Email: {userProfile.email}</p>
        </div>
      ) : (
        <p>Loading user profile...</p>
      )
      }
      <button onClick={onLogout}>Logout</button>
      <button onClick={deleteAccount}>Delete Account</button>
      <button onClick={clearLocalStorageButton}>Reset Local Storage</button>

    </div>
  );
}
export default UserProfile;
