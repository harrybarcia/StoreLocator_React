import { useRef, useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {memo} from "react"
import "./NewStoreForm.css";
import axios from "axios";

const SimpleInput = (props) => {
  console.log(props)
  const [address, setAddress] = useState(props.data?.address || "");
  const [city, setCity] = useState(props.data?.city || "");
  const [image, setFile] = useState(props.data?.image || "");
  const [price, setPrice] = useState(props.data?.price || "");
  const [rating, setRating] = useState(props.data?.rating || "");
  const [latitude, setLatitude] = useState(props.data?.latitude || "");
  const [longitude, setLongitude] = useState(props.data?.latitude || "");
  const isEditMode = props.isEditMode

  console.log(props.newPlace)

  const navigate = useNavigate();

  const handleAddressChange = (evt) => {
    console.log(evt.target.value);
    setAddress(evt.target.value);
  };
  const handleCityChange = (evt) => {
    setCity(evt.target.value);
  };

  const handlePhotoSelect = (evt) => {
    setFile(evt.target.files[0]);
  };

  const handlePriceChange = (evt) => {
    setPrice(evt.target.value);
  };
  const handleRatingChange = (evt) => {
    setRating(evt.target.value);
  };

  const handleSubmit = async (evt) => {
    console.log(props.latitude)
    evt.preventDefault();
    const latitude = props.latitude;
    const longitude = props.longitude;
    const isEditMode = props.isEditMode;
    const formData = new FormData();

    if (props.newPlace) {
      formData.append("address", address);
      formData.append("city", city);
      formData.append("image", image);
      formData.append("price", price);
      formData.append("rating", rating);
      formData.append("latitude", latitude);
      formData.append("longitude", longitude);
      console.log(formData)
      const response = axios.post("/add-store-from-click", formData);
      const data = await response;
      axios("/allStores").then((response) => {
        const allData = response.data
        console.log(allData)
        props.onClose(allData)
      });
      
    } 
    if (isEditMode) {
      formData.append("address", address);
      formData.append("city", city);
      formData.append("image", image);
      formData.append("price", price);
      formData.append("rating", rating);
      const location= { coordinates: [longitude, latitude] }
      const jsonString = JSON.stringify(location);
      formData.append("location", jsonString)
      const id = props.id
      console.log(id)
      const response = axios.put(`/edit-store/${id}?bypassGeocode=true`, formData);
      const data = await response;
      props.onClose(data)
      console.log(data);
    } 
    if (!isEditMode && !props.newPlace ) {
      formData.append("address", address);
      formData.append("city", city);
      formData.append("image", image);
      formData.append("price", price);
      formData.append("rating", rating);
      const response = axios.post("/add-store", formData);
      const data = await response;
      navigate("/");
      console.log(data);
    }
    }

  return (
    
    <div className="flex justify-center">
      <form onSubmit={handleSubmit} >
        <h4>Add your new store</h4>
        <div className="p-3">
          <label className="block text-gray-700 font-bold mb-2">Your Address</label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
            type="text"
            name="address"
            value={address}
            onChange={handleAddressChange}
          />

          <label className="block text-gray-700 font-bold mb-2">Image</label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            name="image"
            type="file"
            onChange={handlePhotoSelect}
          />
          <br />
          <label className="block text-gray-700 font-bold mb-2">City</label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            name="city"
            type="text"
            value={city}
            onChange={handleCityChange}
          />
          <br />
          <label className="block text-gray-700 font-bold mb-2">Price</label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            name="price"
            type="number"
            value={price}
            onChange={handlePriceChange}
          />
          <br />

          <br />
          <label className="block text-gray-700 font-bold mb-2">Rating</label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            name="rating"
            type="number"
            value={rating}
            onChange={handleRatingChange}
          />
          <br />
          <div class="my-4 flex flex-row items-center justify-center">
          {isEditMode ? (
            <button
              className="custom-button"
              name="submit"
              type="submit"
              id="contact-submit"
              data-submit="...Sending"
            >
              Save Changes
            </button> ) : (
            <button
              className="custom-button"
              name="submit"
              type="submit"
              id="contact-submit"
              data-submit="...Sending"
            >
              Submit
            </button>
          )}
            <button 
              type="button" // Specify type as "button" to prevent form submission
              className="custom-button"
              onClick={() => {
                console.log('Cancel button clicked');
                props.onCancel();
              }} >Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SimpleInput;
