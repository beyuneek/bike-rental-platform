import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import "../styles/AllReviews.scss";

const AllReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('http://localhost:3001/reviews');
        const data = await response.json();
        setReviews(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  return (
    <>
      <Navbar />
      <div className="reviews-container">
        <h1>All Reviews</h1>
        {loading ? (
          <Loader />
        ) : (
          <div className="reviews-list">
            {reviews.map(review => (
              <div className="review-card" key={review._id}>
                <h2 className="review-heading">{review.category} : {review.model}</h2>
                <p className="review-text-name">Reviewed By User: {review.reviewer}</p>
                <p className="review-text">{review.review}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default AllReviews;
