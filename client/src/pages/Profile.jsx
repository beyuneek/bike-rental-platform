import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link component
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import { useSelector } from 'react-redux';

import "../styles/Profile.scss";

const UserProfile = () => {
  const userId = useSelector(state => state.user._id);
  const [user, setUser] = useState(null);
  const [rentalHistory, setRentalHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`http://localhost:3001/users/${userId}/profile`, {
          method: 'GET'
        });
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };

    const fetchRentalHistory = async () => {
      try {
        const response = await fetch(`http://localhost:3001/rentals/${userId}/rentalhistory`, {
          method: 'GET'
        });
        const data = await response.json();
        console.log(data);
        setRentalHistory(data);
      } catch (error) {
        console.error('Failed to fetch rental history:', error);
      }
    };

    const fetchData = async () => {
      await Promise.all([fetchUserProfile(), fetchRentalHistory()]);
      setLoading(false);
    };

    fetchData();
  }, [userId]);

  return (
    <>
      <Navbar />
      {loading ? (
        <Loader />
      ) : (
        <div className="profile-container">
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
          <div className="rental-history">
            <h1>Rental History</h1>
            <div className="history-details">
              {rentalHistory?.map(({ ebikelistingId, category, model, rentalDate, duration}) => (
                <div className="rental-item">
                  <p>Category: {category}</p>
                  <p>Model: {model}</p>
                  <p>Rental Date: {rentalDate}</p>
                  <p>Duration: {duration} Hour(s)</p>
                  {/* Add button to navigate to create review page */}
                    <Link to={`/createreview?ebikelistingId=${ebikelistingId}`}>
                        <button>Create Review</button>
                    </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserProfile;
