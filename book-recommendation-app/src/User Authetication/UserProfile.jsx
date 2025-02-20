/* eslint-disable react/prop-types */

function UserProfile({ username, onLogout }) {
  const clearLocalStorageButton = () => {
    if (confirm("WARNING: This will delete all your data, including your profile(s)!")) {
      localStorage.clear();
      alert("Local storage is now empty!");
      onLogout();
    }
  };

  const deleteAccount = () => {
    if (confirm("WARNING: This will delete your account!")) {
      localStorage.removeItem('user');
      alert("Your account is deleted!");
      onLogout();
    }
  };

  return (
    <div>
      <h2>User Profile</h2>
      <p>Welcome, {username}!</p>
      <button onClick={onLogout}>Logout</button>
      <button onClick={deleteAccount}>Delete Account</button>
      <button onClick={clearLocalStorageButton}>Reset Local Storage</button>

    </div>
  );
}
export default UserProfile;
