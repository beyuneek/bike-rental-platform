import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import PaymentForm from '../components/PaymentForm';
import { useSelector } from "react-redux";
import "../styles/EbikeDetails.scss";

const EbikeDetails = () => {
  const [loading, setLoading] = useState(true);
  const [listing, setListing] = useState(null);
  const [hours, setHours] = useState(1);
  const navigate = useNavigate();
  const customerId = useSelector((state) => state?.user?._id);
  const { listingId } = useParams();

  useEffect(() => {
    const getListingDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3001/ebikes/${listingId}`);
        const data = await response.json();
        setListing(data);
        setLoading(false);
      } catch (err) {
        console.log("Fetch Listing Details Failed", err.message);
      }
    };

    getListingDetails();
  }, [listingId]);

  const handlePaymentSuccess = async () => {
    try {
      // Assuming the price needs to be in cents for the backend
      const rentalForm = {
        customerId,
        ebikelistingId: listing._id,
        category: listing.category,
        model: listing.model,
        rentalDate: new Date().toDateString(),
        rentTime: new Date().toLocaleTimeString(),
        duration: hours,
        price: listing.price * hours , // Convert to cents if needed
      };

      const response = await fetch("http://localhost:3001/rentals/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rentalForm),
      });

      if (!response.ok) {
        throw new Error("Submit Rental Failed.");
      }

      const responseAvailability = await fetch(`http://localhost:3001/ebikes/${listing._id}/update-availability`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ availability: "no" }),
      });

      if (!responseAvailability.ok) {
        throw new Error("Update Availability Failed.");
      }

      navigate(`/${customerId}/rentals`);
    } catch (err) {
      console.log(err.message);
    }
  };

  if (loading) {
    return <Loader />;
  }

  // Calculate total price in cents for Stripe
  const totalPriceInCents = listing.price * hours * 100;

  return (
    <>
      <Navbar />
      <div className='listing-details'>
        <div className='Category'>
          <h1>{listing.category}: {listing.model}</h1>
        </div>
        <div className="photos">
          {listing.listingPhotoPaths?.map((item, index) => (
            <img
              key={index}
              src={`http://localhost:3001/${item.replace("public", "")}`}
              alt="E-bike"
            />
          ))}
        </div>
        <div>
          <h2>Location:</h2>
          <p>{listing.streetAddress} APT/SUITE: {listing.aptSuite}</p>
          <p>{listing.city}, {listing.province}, {listing.country}</p>
          <h3>Battery Life: {listing.batteryLife}</h3>
          <h3>Weight: {listing.weight}</h3>
        </div>
        <div>
          <h2>Rent Duration (Hours):</h2>
          <input
            type="number"
            min="1"
            value={hours}
            onChange={(e) => setHours(Math.max(1, parseInt(e.target.value, 10)))}
          />
          <h2>Total Price: ${totalPriceInCents / 100}</h2> {/* Show price in dollars */}
        </div>
        <div>
          <PaymentForm amount={totalPriceInCents} onSuccess={handlePaymentSuccess} />
        </div>
      </div>
    </>
  );
};

export default EbikeDetails;
