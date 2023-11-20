import { useRef, useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { memo } from "react"
import "./NewStoreForm.css";
import axios from "axios";
import {fetchFields} from "./Fields"

const SimpleInput = (props) => {
  console.log(props)
  
  const [address, setAddress] = useState(props.data?.address || "");
  const [city, setCity] = useState(props.data?.city || "");
  const [image, setFile] = useState(props.data?.image || "");
  const [price, setPrice] = useState(props.data?.price || "");
  const [rating, setRating] = useState(props.data?.rating || "");
  const isEditMode = props.isEditMode
  const [inputData, setInputData] = useState(props.data?.typeObject || []);
  console.log(props.data?.typeObject)

  useEffect(() => {
    // Fetch data when the component mounts

    const fetchData = async () => {
      const response = await fetchFields();
      setInputData(response); // Update the state with the fetched data
    };
    if (inputData.length === 0) {
      fetchData();
    }
    
  }, []); // Empty dependency array to run the effect once when the component mounts

  useEffect(() => {
    
  }, [inputData]); // Empty dependency array to run the effect once when the component mounts

  console.log("inputData", inputData.length === 0)
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

  const handleInputChange = (key, data) => {
    // Find the index of the object with the specified key
    const updatedData = inputData.map(item =>
      item.key === key ? { ...item, data } : item
    );
    setInputData(updatedData);
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
      formData.append("typeObject",JSON.stringify(inputData) )
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
      formData.append("typeObject",JSON.stringify(inputData) )
      const location = { coordinates: [longitude, latitude] }
      const jsonString = JSON.stringify(location);
      formData.append("location", jsonString)
      const id = props.id
      console.log(id)
      const response = axios.put(`/edit-store/${id}?bypassGeocode=true`, formData);
      const data = await response;
      props.onClose(data)
      console.log(data);
    }
    if (!isEditMode && !props.newPlace) {
      formData.append("address", address);
      formData.append("city", city);
      formData.append("image", image);
      formData.append("price", price);
      formData.append("rating", rating);
      formData.append("typeObject",JSON.stringify(inputData) )
      const response = axios.post("/add-store", formData);
      const data = await response;
      navigate("/");
      console.log(data);
    }
    console.log(formData)
  }

  const handleDragEnd = () => {
    console.log("in handleDragEnd function")
    // if (!result.destination) return;

    // const updatedOrder = [...newOrder];
    // const [movedItem] = updatedOrder.splice(result.source.index, 1);
    // updatedOrder.splice(result.destination.index, 0, movedItem);

    // setNewOrder(updatedOrder);
  };

  return (

    <div className="flex justify-center h-[400px] overflow-auto">
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
          {inputData.sort((a, b) => a.order - b.order).map((item, index) => (
            <div key={index} draggable onDragEnd={handleDragEnd} data-rbd-draggable-id={item.id} data-rbd-drag-handle-draggable-id={item.id} index={index}>
              {item.visibility && (
                <div className="mr-8">
                  <label className="block text-gray-700 font-bold mb-2">{item.key}</label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="text"
                    value={item.data}
                    onChange={(e) => handleInputChange(item.key, e.target.value)}
                  />
                </div>
              )}
            </div>
          ))}
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
              </button>) : (
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
