import { useRef, useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import "./NewStoreForm.css";
import axios from "axios";

const SimpleInput = () => {
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [image, setFile] = useState("");
  const [price, setPrice] = useState("");
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

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    const formData = new FormData();
    formData.append("address", address);
    formData.append("city", city);
    formData.append("image", image);
    formData.append("price", price);
    const response = axios.post("/add-store", formData);
    const data = await response;
    console.log(data);
    navigate("/");
  };

  return (
    <div className="flex justify-center">
      
      <form onSubmit={handleSubmit}>
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

          <button
            className="rounded-lg px-4 py-2 border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-gray-100 duration-300"
            name="submit"
            type="submit"
            id="contact-submit"
            data-submit="...Sending"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default SimpleInput;
