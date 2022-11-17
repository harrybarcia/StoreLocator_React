import {useRef, useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";

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
  
  useEffect(() => {
    fetchStore();
  }, []);

  const fetchStore = async () => {
    const response = await fetch(`/api/${id}`);
    const result = await response.json();
    console.warn("data", result);
    
    setAddress(result.data.location.formattedAddress);
    setCity(result.data.city);
    setFile(result.data.image);
    setImagePath(result.data.image);
    
    
    
    
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
    const response = await fetch(`/edit-store/${storeId}`, {
      method: 'PUT',
      body: formData,
    });
    const data = await response.json();
    console.log("data in editstore.js", data);
    navigate('/');
  
  }
    
    return (
      <div className="container">
        <form id='contact' onSubmit={handleEdit}>
          <div >
            <label >Your Address</label>
            <input 
            type="text" 
            name="address"
            value={address} 
            
            onChange={
              (evt) => {
                setAddress(evt.target.value);
              }
            } />
            
            <label >Image</label>
            <input 
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
            
            <label >City</label>
            <input 
            name="city"
            type="text"
            value={city} 
            onChange={
              (evt) => {
                setCity(evt.target.value);
              }
            }
            
            />
          </div>
          <div className="form-actions">
            <button>Submit</button>
          </div>
        </form>
      </div>
      );
};

export default EditStore;