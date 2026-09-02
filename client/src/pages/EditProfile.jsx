import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import { useDispatch } from 'react-redux';
import { setProfilePhoto } from '../redux/state';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import "../styles/EditProfile.scss";

const EditProfile = () => {
  const userId = useSelector(state => state.user._id);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    profileImage: null
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:3001/users/${userId}/editprofile`, {
          method: 'GET'
        });
        const data = await response.json();
        console.log(data);
        setUser(data);
        setFormData({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          profileImage: data.profileImagePath
        });
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch user:', error);
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleChange = e => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'profileImage' ? files[0] : value
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const formDataToUpdate = new FormData();
      for (const key in formData) {
        formDataToUpdate.append(key, formData[key]);
      }
      const response = await fetch(`http://localhost:3001/users/${userId}/updateprofile`, {
        method: 'PUT',
        body: formDataToUpdate
      });
      const data = await response.json();
      console.log('User updated:', data);
      navigate(`/${userId}/profile`); // Redirect to profile page after successful update
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  return (
    <>
      <Navbar />
      {loading ? (
        <Loader />
      ) : (
        <div className="edit-profile">
          <h1>Edit Profile</h1>
          <form className="edit-profile-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            {user && (
              <img
                src={`http://localhost:3001/${user.profileImagePath.replace(
                  "public",
                  ""
                )}`}
                alt="profile photo"
              />
            )}

            <input
              type="file"
              id="image"
              name="profileImage"
              accept="image/*"
              onChange={handleChange}
              style={{ display: 'none' }}
            />
         <label htmlFor="image">
        {formData.profileImage && formData.profileImage instanceof File ? (
            <img
            src={URL.createObjectURL(formData.profileImage)}
            alt="profile photo"
            style={{ maxWidth: '80px' }}
            />
        ) : (
            <>
            <img src="/assets/addImage.png" alt="add profile photo" />
            <p>Upload New Photo</p>
            </>
        )}
        </label>


            <button type="submit">Save Changes</button>
          </form>
        </div>
      )}
    </>
  );
};

export default EditProfile;
