import {useRef, useState, useEffect} from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import './NewStoreForm.css';
import axios from 'axios';

const SimpleInput = () => {
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [image, setFile] = useState('');
  const [price, setPrice] = useState('');
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

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    const formData = new FormData();
    formData.append('address', address);
    formData.append('city', city);
    formData.append('image', image);
    formData.append('price', price);
    const response = axios.post('/add-store', formData);
    const data = await response;
    console.log(data);
    navigate('/');
  }


  return (
    <div className="container">

    <form id="contact" onSubmit={handleSubmit}>
      <h4>Add your new store</h4>
      <div >
        <label >Your Address</label>
        <input 
        type="text" 
        name="address"
        value={address} 
        onChange={handleAddressChange} />
        
        <label >Image</label>
        <input 
        name="image"
        type="file"
        defaultValue={image}
        onChange= {handlePhotoSelect}
        />
        <br />
        <label >City</label>
        <input 
        name="city"
        type="text"
        value={city} 
        onChange={handleCityChange}
        />
        <br />
        <label >Price</label>
        <input
        name="price"
        type="number"
        value={price}
        onChange={handlePriceChange}
        />
        <br />
        
      <button name="submit" type="submit" id="contact-submit" data-submit="...Sending" >Submit</button>
      
        
      </div>
    </form>
    </div>
  );
};

export default SimpleInput;