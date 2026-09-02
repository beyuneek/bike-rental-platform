import React from 'react'

import { useEffect, useState } from "react";
import { categories } from "../data";
import "../styles/EbikeListings.scss";
import ListingCard from "./ListingCard";
import Loader from "./Loader";
import { useDispatch, useSelector } from "react-redux";
import { setListings } from "../redux/state";



const EbikeListings = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
  
    const [selectedCategory, setSelectedCategory] = useState("All");
    const listings = useSelector((state) => state.listings || []);

    const getFeedListings = async () => {
      try {
        const response = await fetch(
          selectedCategory !== "All"
            ? `http://localhost:3001/ebikes?category=${selectedCategory}`
            : "http://localhost:3001/ebikes",
          {
            method: "GET",
          }
        );
  
        const data = await response.json();
        dispatch(setListings({ listings: data }));
        setLoading(false);
      } catch (err) {
        console.log("Fetch Listings Failed", err.message);
      }
    };
  
    useEffect(() => {
      getFeedListings();
    }, [selectedCategory]);
    
    //Used at line 65 instead of listings to filter out rented bikes via availability property
    const filteredListings = listings.filter((listing) => listing.availability === 'yes');
    return (
      <>
        <div className="category-list">
          {categories?.map((category, index) => (
            <div
              className={`category ${category.label === selectedCategory ? "selected" : ""}`}
              key={index}
              onClick={() => setSelectedCategory(category.label)}
            >
              <div className="category_icon">{category.icon}</div>
              <p>{category.label}</p>
            </div>
          ))}
        </div>
  
        {loading ? (
          <Loader />
        ) : (
          <div className="listings">
            {filteredListings.map(
              ({
                _id,
                creator,
                listingPhotoPaths,
                city,
                province,
                country,
                category,
                model,
                availability,
                batteryLife,
                weight,
                price,
                booking=false
              }) => (
                <ListingCard
                  listingId={_id}
                  creator={creator}
                  listingPhotoPaths={listingPhotoPaths}
                  city={city}
                  province={province}
                  country={country}
                  category={category}
                  model={model}
                  availability={availability}
                  batteryLife={batteryLife}
                  weight={weight}
                  price={price}
                  booking={booking}
                />
              )
            )}
          </div>
        )}
      </>
    );
  };

export default EbikeListings;