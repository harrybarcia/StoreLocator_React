import {useRef, useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";
import "../index.css";

const EditStore = (props) => {

  const navigate = useNavigate();
  const [dataExistingStore, setDataExistingStore] = useState([]);
  
  const { id } = useParams();
  console.log("id", id);
  const storeId = useParams().id;
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [image, setFile] = useState('');
  const [imagePath, setImagePath] = useState('');
  const [price, setPrice] = useState('');
  
  useEffect(() => {
    fetchStore();
  }, [
    id, address, city, image, price
  ]);

  const fetchStore = async () => {
    const response = await fetch(`/api/${id}`);
    const result = await response.json();
    console.warn("data", result);
    console.log("result.data.location.formattedAddress", result.location.formattedAddress)
    
    setAddress(result.location.formattedAddress);
    setCity(result.city);
    setFile(result.image);
    setImagePath(result.image);
    setPrice(result.price);
    
    
    
    
  };
  console.log("address", address);
    
  const updateStore = async (evt) => {
    evt.preventDefault();
    console.log("updateStore", updateStore);
  };
  
  const handleEdit = async (evt) => {

    
    evt.preventDefault();
    const formData = new FormData();
    formData.append('address', address);
    formData.append('city', city);
    formData.append('image', image);
    formData.append('price', price);
    const response = await fetch(`/edit-store/${storeId}`, {
      method: 'PUT',
      body: formData,
    });
    const data = await response.json();
    console.log("data in editstore.js", data);
    navigate('/');
  
  }
    
    return (
      <div className="flex justify-center">
        <form className="w-full max-w-lg bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 mt-36" onSubmit={handleEdit}>
          <div >
          <label className="block text-gray-700 font-bold mb-2">Your Address</label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
            type="text" 
            name="address"
            value={address} 
            
            onChange={
              (evt) => {
                setAddress(evt.target.value);
              }
            } />
            
            <label className="block text-gray-700 font-bold mb-2">Image</label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
            name="image"
            type="file"
            defaultValue={image}

            onChange={
              (evt) => {
                
                setFile(evt.target.files[0]);
                setImagePath(evt.target.files[0].name);
              }
            }
            
            />
            <img src={"/images/"+imagePath} alt="store" style={{width:"100px"}}/>             
            
            <label className="block text-gray-700 font-bold mb-2">City</label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            name="city"
            type="text"
            value={city} 
            onChange={
              (evt) => {
                setCity(evt.target.value);
              }
            }
            
            />
            <label className="block text-gray-700 font-bold mb-2">Price</label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            name="price"
            type="text"
            value={price}
            onChange={
              (evt) => {
                setPrice(evt.target.value);
              }
            }
            />
          </div>
          <div className="form-actions">
            <button
            className="rounded-lg px-4 py-2 border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-gray-100 duration-300"
            >Submit</button>
          </div>
        </form>
      </div>
      );
};

export default EditStore;