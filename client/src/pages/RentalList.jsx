import React, { useEffect, useState } from "react";
import "../styles/List.scss"; // Update the style file import if needed
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { setRentalList } from "../redux/state";
import RentalCard from "../components/RentalCard"; // Updated import
import ListingCard from "../components/ListingCard";

const RentalList = () => {
  const [loading, setLoading] = useState(true);
  const userId = useSelector((state) => state.user._id);
  const rentalList = useSelector((state) => state.user.rentalList);
  
  console.log(rentalList);

  const dispatch = useDispatch();

  const getRentalList = async () => {
    try {
      const response = await fetch(`http://localhost:3001/users/${userId}/rentals`, {
        method: "GET",
      });

      const data = await response.json();
      dispatch(setRentalList(data));
      setLoading(false);
    } catch (err) {
      console.log("Rental List retrieval failed!", err.message);
    }
  };



  useEffect(() => {
    getRentalList();
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      <h1 className="title-list">Your Rental List</h1>
      <div className="list">
        {rentalList?.map(({ customerId, ebikelistingId, category, model, rentalDate, rentTime, duration, price }) => (
          <RentalCard
            customerId={customerId._id}
            ebikelistingId={ebikelistingId._id}
            listingPhotoPaths = {ebikelistingId.listingPhotoPaths}
            city={ebikelistingId.city}
            province={ebikelistingId.province}
            country={ebikelistingId.country}
            category={category}
            model={model}
            rentalDate={rentalDate}
            rentTime={rentTime}
            duration={duration}
            price={price}
            booking
          />
        ))}
      </div>
    </>
  );
};

export default RentalList;
