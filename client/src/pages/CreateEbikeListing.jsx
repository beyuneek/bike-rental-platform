import "../styles/CreateEbikeListing.scss"
import Navbar from "../components/Navbar"
import {categories} from "../data"

import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { IoIosImages } from "react-icons/io";
import { useState } from "react";
import { BiTrash } from "react-icons/bi";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CreateEbikeListing = () =>{
    const [category, setCategory] = useState("")

    /* LOCATION */
    const [formLocation, setFormLocation] = useState({
        streetAddress: "",
        aptSuite: "",
        city: "",
        province: "",
        country: "",
    });

    const handleChangeLocation = (e) => {
        const { name, value } = e.target;
        setFormLocation({
          ...formLocation,
          [name]: value,
        });
      };


    

    /* DESCRIPTION */
    const [formDescription, setFormDescription] = useState({
        model: "",
        availability: "",
        batteryLife: "",
        weight: "",
        price: 0,
    });

    const handleChangeDescription = (e) => {
        const { name, value } = e.target;
        setFormDescription({
        ...formDescription,
        [name]: value,
        });
    };


     /* UPLOAD, DRAG & DROP, REMOVE PHOTOS */
    const [photos, setPhotos] = useState([]);

    const handleUploadPhotos = (e) => {
    const newPhotos = e.target.files;
    setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
    };

    const handleDragPhoto = (result) => {
    if (!result.destination) return;

    const items = Array.from(photos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setPhotos(items);
    };

    const handleRemovePhoto = (indexToRemove) => {
    setPhotos((prevPhotos) =>
        prevPhotos.filter((_, index) => index !== indexToRemove)
    );
    };

    const creatorId = useSelector((state) => state.user._id);

    const navigate = useNavigate()

    
    const handlePost = async (e) => {
        e.preventDefault();
    
        try {
          /* Create a new FormData onject to handle file uploads */
          const listingForm = new FormData();
          listingForm.append("creator", creatorId);
          listingForm.append("category", category);/**from use state above */
          listingForm.append("model", formDescription.model);
          listingForm.append("availability", formDescription.availability);
          listingForm.append("streetAddress", formLocation.streetAddress);
          listingForm.append("aptSuite", formLocation.aptSuite);
          listingForm.append("city", formLocation.city);
          listingForm.append("province", formLocation.province);
          listingForm.append("country", formLocation.country);
          listingForm.append("price", formDescription.price);
          listingForm.append("batteryLife", formDescription.batteryLife);
          listingForm.append("weight", formDescription.weight);
    
          /* Append each selected photos to the FormData object */
          photos.forEach((photo) => {
            listingForm.append("listingPhotos", photo);
          });
    
          /* Send a POST request to server */
          const response = await fetch("http://localhost:3001/ebikes/create", {
            method: "POST",
            body: listingForm,
          });
    
          if (response.ok) {
            navigate("/");
          }
        } catch (err) {
          console.log("Publish Listing failed", err.message);
        }
    };




    return (
        <>
        <Navbar />

        <div className="create-ebike-listing">
            <h1>Add E-bike Listing</h1>
            <form onSubmit={handlePost}>
                <div className="create-ebike-listing_step1">
                <h2>E-bike Details</h2>
                <hr />
                <h3>Choose the category that best aligns with the e-bike.</h3>
                <div className="category-list">
                    {categories?.map((item, index) => (
                        <div className={`category ${
                            category === item.label ? "selected" : ""}`} key={index} onClick={() => setCategory(item.label)}>
                        <div className="category_icon">{item.icon}</div>
                        <p>{item.label}</p>
                        </div>
                    ))}
                </div>

                <h3>Where's is the E-bike located?</h3>
                <div className="full">
                    <div className="location">
                    <p>Street Address</p>
                    <input
                        type="text"
                        placeholder="Street Address"
                        name="streetAddress"
                        value={formLocation.streetAddress}
                        onChange={handleChangeLocation}
                        required
                    />
                    </div>
                </div>

                <div className="half">
                    <div className="location">
                    <p>Apartment, Suite, etc. (if applicable)</p>
                    <input
                        type="text"
                        placeholder="Apt, Suite, etc. (if applicable)"
                        name="aptSuite"
                        value={formLocation.aptSuite}
                        onChange={handleChangeLocation}
                        required
                    />
                    </div>
                    <div className="location">
                    <p>City</p>
                    <input
                        type="text"
                        placeholder="City"
                        name="city"
                        value={formLocation.city}
                        onChange={handleChangeLocation}
                        required
                    />
                    </div>
                </div>

                <div className="half">
                    <div className="location">
                    <p>Province</p>
                    <input
                        type="text"
                        placeholder="Province"
                        name="province"
                        value={formLocation.province}
                        onChange={handleChangeLocation}
                        required
                    />
                    </div>
                    <div className="location">
                    <p>Country</p>
                    <input
                        type="text"
                        placeholder="Country"
                        name="country"
                        value={formLocation.country}
                        onChange={handleChangeLocation}
                        required
                    />
                    </div>
                </div>
                

                <h3>Upload photos of the E-bike</h3>
                <DragDropContext onDragEnd={handleDragPhoto}>
                <Droppable droppableId="photos" direction="horizontal">
                    {(provided) => (
                    <div
                        className="photos"
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                    >
                        {photos.length < 1 && (
                        <>
                            <input
                            id="image"
                            type="file"
                            style={{ display: "none" }}
                            accept="image/*"
                            onChange={handleUploadPhotos}
                            multiple
                            />
                            <label htmlFor="image" className="alone">
                            <div className="icon">
                                <IoIosImages />
                            </div>
                            <p>Upload from your device</p>
                            </label>
                        </>
                        )}

                        {photos.length >= 1 && (
                        <>
                            {photos.map((photo, index) => {
                            return (
                                <Draggable
                                key={index}
                                draggableId={index.toString()}
                                index={index}
                                >
                                {(provided) => (
                                    <div
                                    className="photo"
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    >
                                    <img
                                        src={URL.createObjectURL(photo)}
                                        alt="place"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemovePhoto(index)}
                                    >
                                        <BiTrash />
                                    </button>
                                    </div>
                                )}
                                </Draggable>
                            );
                            })}
                            <input
                            id="image"
                            type="file"
                            style={{ display: "none" }}
                            accept="image/*"
                            onChange={handleUploadPhotos}
                            multiple
                            />
                            <label htmlFor="image" className="together">
                            <div className="icon">
                                <IoIosImages />
                            </div>
                            <p>Upload from your device</p>
                            </label>
                        </>
                        )}
                    </div>
                    )}
                </Droppable>
                </DragDropContext>
                
                <h3>E-bike Features and Pricing</h3>
                    <div className="description">
                    <p>Model</p>
                    <input
                        type="text"
                        placeholder="Model"
                        name="model"
                        value={formDescription.model}
                        onChange={handleChangeDescription}
                        required
                    />
                    <p>Availability</p>
                    <select
                        id="availability"
                        name="availability"
                        value={formDescription.availability}
                        onChange={handleChangeDescription}
                        required
                    >
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select>

                    <p>Battery Life</p>
                    <input
                        type="text"
                        placeholder="BatteryLife"
                        name="batteryLife"
                        value={formDescription.batteryLife}
                        onChange={handleChangeDescription}
                        required
                    />
                    <p>Weight</p>
                    <textarea
                        type="text"
                        placeholder="Weight"
                        name="weight"
                        value={formDescription.weight}
                        onChange={handleChangeDescription}
                        required
                    />
                    <p>Price Per Hour</p>
                    <span>$</span>
                    <input
                        type="number"
                        placeholder="10"
                        name="price"
                        className="price"
                        value={formDescription.price}
                        onChange={handleChangeDescription}
                        required
                    />
                    </div>

                </div>

                <button className="submit_btn" type="submit">
                CREATE E-BIKE LISTING
                </button>
            </form>
        </div>



        </>
    )
}

export default CreateEbikeListing