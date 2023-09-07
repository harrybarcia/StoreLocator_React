import { useRef, useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import "./NewStoreForm.css";
import axios from "axios";

const SimpleInput = (props) => {
  console.log(props)
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [image, setFile] = useState("");
  const [price, setPrice] = useState("");
  const [rating, setRating] = useState("");
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
      const response = axios.post("/add-store-from-click", formData);
      const data = await response;
      console.log(data);
    } 
    if (isEditMode) {
      formData.append("address", props.existingData.address);
      formData.append("city", props.existingData.city);
      formData.append("image", props.existingData.image);
      formData.append("price", props.existingData.price);
      formData.append("rating", props.existingData.rating);
      const id = props.id
      const response = axios.put(`/edit-store/${id}`, formData);
      const data = await response;
      console.log(data);
    } 
    if (!isEditMode ) {
      formData.append("address", address);
      formData.append("city", city);
      formData.append("image", image);
      formData.append("price", price);
      formData.append("rating", rating);
      const response = axios.post("/add-store", formData);
      const data = await response;
      console.log(data);
    }
    props.onClose();
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
            defaultValue={image}
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
            <button
              className="custom-button"
              name="submit"
              type="submit"
              id="contact-submit"
              data-submit="...Sending"
            >
              Save Changes
            </button>
            <button 
              className="custom-button"
              onClick={props.onCancel} >Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SimpleInput;
