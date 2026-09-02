// Profile.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link component
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import { useSelector } from 'react-redux';

import "../styles/Profile.scss";

const UserProfile = () => {
  const userId = useSelector(state => state.user._id);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:3001/users/${userId}/profile`, {
          method: 'GET'
        });
        const data = await response.json();
        setUser(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch user:', error);
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  return (
    <>
      <Navbar />
      {loading ? (
        <Loader />
      ) : (
        <div className="user-profile">
          <h1>User Profile</h1>
          <div className="user-details">
            <h2>Name: {user.firstName} {user.lastName}</h2>
            <h3>Email: {user.email}</h3>
            <img
              src={`http://localhost:3001/${user.profileImagePath.replace(
                "public",
                ""
              )}`}
              alt="profile photo"
            />
            {/* Add button to navigate to edit profile page */}
            <Link to={`/${user._id}/editprofile`}>
              <button>Edit Profile</button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default UserProfile;
