import React, { useState } from "react";
import "../styles/RentalCard.scss"; // Update the style file import if needed
import { ArrowForwardIos, ArrowBackIosNew, Favorite } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {  useSelector, useDispatch } from "react-redux";


const RentalCard = ({
  ebikelistingId,
  creator,
  listingPhotoPaths,
  city,
  province,
  country,
  category,
  price,
  rentalDate,
  rentTime,
  duration,
  totalPrice,
  booking,
}) => {
   /* SLIDER FOR IMAGES */
   const [currentIndex, setCurrentIndex] = useState(0);
   const userId = useSelector((state) => state.user._id);

   const goToPrevSlide = () => {
     setCurrentIndex(
       (prevIndex) =>
         (prevIndex - 1 + listingPhotoPaths.length) % listingPhotoPaths.length
     );
   };
 
   const goToNextSlide = () => {
     setCurrentIndex((prevIndex) => (prevIndex + 1) % listingPhotoPaths.length);
   };
 
   const navigate = useNavigate();
   const dispatch = useDispatch();
   
   //Calculating the expected end time of the rental.
   const calculateExpectedEndTime = () => {
    const [hours, minutes] = rentTime.split(":").map(Number);
    const durationInMinutes = duration * 60;
  
    let expectedEndMinutes = (hours * 60 + minutes + durationInMinutes) % 1440;
    const amPm = expectedEndMinutes < 720 ? "AM" : "PM";
  
    expectedEndMinutes = (expectedEndMinutes + 720) % 1440;
    const formattedHours = Math.floor(expectedEndMinutes / 60) % 12 || 12;
  
    return `${formattedHours}:${expectedEndMinutes % 60
      .toString()
      .padStart(2, "0")} ${amPm}`;
  };
  
  const handleSubmit = async () => {
    try {
  
      const responseAvailability = await fetch(`http://localhost:3001/ebikes/${ebikelistingId}/update-availability`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ availability: "yes" }),
      });
  
      if (!responseAvailability.ok) {
        throw new Error("Update Availability Failed.");
      }

      // Call createrentalhistory endpoint
      const responseCreateRentalHistory = await fetch(
        `http://localhost:3001/rentals/${userId}/createrentalhistory/${ebikelistingId}`,
        {
          method: "POST",
        }
      );

      if (!responseCreateRentalHistory.ok) {
        throw new Error("Create Rental History Failed.");
      }

      const responseDeleteEbike = await fetch(
        `http://localhost:3001/rentals/${ebikelistingId}`,
        {
          method: "DELETE",
        }
      );

      if (!responseDeleteEbike.ok) {
        throw new Error("Delete E-bike Failed.");
      }
      

      // Step 3: Navigate to Rentals Page
      navigate(`/`);
    } catch (err) {
      console.log(err.message);
    }
  }
  


   return (
     <div
       className="listing-card"
     >
       <div className="slider-container">
         <div
           className="slider"
           style={{ transform: `translateX(-${currentIndex * 100}%)` }}
         >
           {listingPhotoPaths?.map((photo, index) => (
             <div key={index} className="slide">
               <img
                 src={`http://localhost:3001/${photo?.replace("public", "")}`}
                 alt={`photo ${index + 1}`}
               />
               <div
                 className="prev-button"
                 onClick={(e) => {
                   e.stopPropagation();
                   goToPrevSlide(e);
                 }}
               >
                 <ArrowBackIosNew sx={{ fontSize: "15px" }} />
               </div>
               <div
                 className="next-button"
                 onClick={(e) => {
                   e.stopPropagation();
                   goToNextSlide(e);
                 }}
               >
                 <ArrowForwardIos sx={{ fontSize: "15px" }} />
               </div>
             </div>
           ))}
         </div>
       </div>
      <h3>
        {city}, {province}, {country}
      </h3>
      <p>{category}</p>

      {booking && (
        <>
          <p>
            Rental Date: {rentalDate}<br /> Time of Rental: {rentTime}<br />  Duration: {duration} hours
            
          </p>
          <p>
          Rental End Time: {calculateExpectedEndTime()}
          </p>
          <p></p>
          <p>
            <span>Price: ${price}</span> total
          </p>
          <button className="end-rental-button" onClick={handleSubmit}>
            End Rental
          </button>
        </>
      )}

      {!booking && (
        <>
          <p>
            <span>${price}</span> per night
          </p>
        </>
      )}
    </div>
  );
};

export default RentalCard;
