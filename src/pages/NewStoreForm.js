import { useRef, useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { memo } from "react"
import "./NewStoreForm.css";
import axios from "axios";
import { fetchFields } from "../components/functions/fetchFields";

const SimpleInput = (props) => {

  const [address, setAddress] = useState(props.data?.address || "");
  const [city, setCity] = useState(props.data?.city || "");
  const [image, setFile] = useState(props.data?.image || "");
  const [price, setPrice] = useState(props.data?.price || "");
  const [rating, setRating] = useState(props.data?.rating || "");
  const isEditMode = props.isEditMode
  const [inputData, setInputData] = useState(props.data?.typeObject || []);

  useEffect(() => {
    // Fetch data when the component mounts
    const fetchData = async () => {
      const response = await fetchFields();
      setInputData(response); // Update the state with the fetched data
    };
    const fetchColors = async () => {
      const response = await axios.get("/all-colors");
    }
    if (inputData.length === 0) {
      fetchData();
    }
    fetchColors();
  }, []); // Empty dependency array to run the effect once when the component mounts

  useEffect(() => {
  }, [inputData]); // Empty dependency array to run the effect once when the component mounts
  // useEffect( () => {
  //   try {
  //     // Make a POST request to add data
  //     async function fetchData(itemData) {
  //       axios.post("/add-store-from-click", itemData);

  //     // Make a GET request to fetch updated data
  //     const response = await axios.get("/allStores");
  //     const data = response.data;

  //     // Use the fetched data as needed
  //     console.log(data);
  //     }
  //     props.dataFromCsv.map((data) => {
  //       fetchData(data);
  //     })
      
  //   } catch (error) {
  //     // Handle errors if any
  //     console.error('Error:', error);
  //   }
    
  // }, [props.dataFromCsv]);


  const navigate = useNavigate();
  const handleAddressChange = (evt) => {
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

  const handleInputChange = (selectKey, selectData) => {
    console.log('selectKey', selectKey);
    console.log('data', selectData);
    console.log('inputData', inputData[0].data);
    console.log("here");
  
    const updatedData = inputData.map((item, index) => {
      if (!item.data) {
        console.log("noitemdata");
        item.data = [];
      }
      if (index === selectKey) {
        // Replace the existing value in item.data with data
        item.data = [selectData]; // Use an array with the new selectData
      } else if (!item.data.length) {
        // Add the first value from colors array to item.data if it's empty
        item.data.push(item.colors[0]);
      }

      return item;
    });
    console.log('inputData', inputData);
  
    console.log('updatedData', updatedData);
    setInputData(updatedData);
  };

  
  const handleSubmit = async (evt) => {
    evt.preventDefault();
    const latitude = props.latitude;
    const longitude = props.longitude;
    const isEditMode = props.isEditMode;
    const location = { coordinates: [longitude, latitude] }
    let data; 

    console.log('inputData', inputData);

    inputData.map((item, index) => {
      if (!item.data){
        item.data = [];
        item.data.push(item.colors[0]);
      return item;
      }
    });

    const formFields = {
      address,
      city,
      image,
      price,
      rating,
      latitude,
      longitude,
      typeObject: JSON.stringify(inputData),
    };
    const formData = new FormData();
    Object.entries(formFields).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      let data;
      if (isEditMode) {
        const jsonString = JSON.stringify(location);
        formData.append("location", jsonString);
        const id = props.data._id;
        const response = await axios.put(`/edit-store/${id}?bypassGeocode=true`, formData);
        data = response.data;
        console.log('data', data);
      } else if (props.newPlace) {
        // const test = props.dataFromCsv
        // console.log('test', test);
        
        await axios.post("/add-store-from-click", formData);
        const response = await axios("/allStores");
        data = response.data;
      } else {
        const response = await axios.post("/add-store", formData);
        data = response.data;
        navigate("/");
      }
      props.onClose(data);
    } catch (error) {
      console.error('Error:', error);
      // Handle errors as needed
    }

  }

  console.log('inputData', inputData);

  return (
    <div className="flex justify-center bg-white overflow-auto">
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
          {inputData?.sort((a, b) => a.order - b.order).map((item, index) => (
            <div key={index} data-rbd-draggable-id={item.id} data-rbd-drag-handle-draggable-id={item.id} index={index}>
              {item.visibility && (
                <div className="mr-8">
                  <label className="block text-gray-700 font-bold mb-2">{item?.key}</label>
                  {item.colors.length > 0 ? (
                    <select
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={item.data && item.data[0].name}
                      onChange={(e) => {
                        handleInputChange(index, item.colors.find(color => color.name === e.target.value));
                      }}
                    >
                      {item?.colors.map((color, colorIndex) => {
                        return (
                          <option
                            key={colorIndex}
                            value={color.name }
                          >
                            {item.data && color.name === item.data[0].name ? item.data[0].name : color.name}
                          </option>
                        );
                      })}
                    </select>
                  ) : (
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      type="text"
                      value={item.data}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                    />
                  )}
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
