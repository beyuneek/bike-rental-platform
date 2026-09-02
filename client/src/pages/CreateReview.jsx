import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useSelector } from 'react-redux';
import '../styles/CreateReview.scss';

const CreateReview = () => {
  const userId = useSelector(state => state.user._id);
  const [review, setReview] = useState('');
  const [ebikeData, setEbikeData] = useState(null);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const ebikelistingId = searchParams.get('ebikelistingId');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEbikeDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3001/ebikes/${ebikelistingId}`);
        const data = await response.json();
        setEbikeData(data);
      } catch (error) {
        console.error('Error fetching e-bike details:', error);
      }
    };

    fetchEbikeDetails();
  }, [ebikelistingId]);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/reviews/createreview/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          category: ebikeData.category,
          model: ebikeData.model,
          review,
        }),
      });
      if (response.ok) {
        alert('Review created successfully');
        navigate('/');
      } else {
        const data = await response.json();
        alert(`Failed to create review: ${data.message}`);
      }
    } catch (error) {
      console.error('Error creating review:', error);
      alert('Failed to create review. Please try again later.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="create-review-container">
        <div className="card">
          <h1>Create Review</h1>
          <form onSubmit={handleSubmit}>
            {ebikeData && (
              <div className="ebike-details">
                <p>Category: {ebikeData.category}</p>
                <p>Model: {ebikeData.model}</p>
              </div>
            )}
            <div className="review-input">
              <label htmlFor="review">Review:</label>
              <textarea id="review" value={review} onChange={e => setReview(e.target.value)} />
            </div>
            <button type="submit">Submit Review</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateReview;
