import {useRef, useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

const SimpleInput = () => {
  const initialValues = {address:"", city:"", image:""};
  const [formValues, setFormValues] = useState(initialValues);

  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormValues({...formValues, [name]: value});
    console.log(formValues);      

  }
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await fetch('/add-store', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(formValues)
        });
      navigate('/');
  }

  return (
    <form onSubmit={handleSubmit}>
      <div >
        <label >Your Address</label>
        <input 
        type="text" 
        name="address"
        value={formValues.address} 
        onChange={handleChange} />
        
        <label >Image</label>
        <input 
        name="image"
        type="text"
        value={formValues.image} 
        onChange={handleChange}
        />
        
        <label >City</label>
        <input 
        name="city"
        type="text"
        value={formValues.city} 
        onChange={handleChange}
        />
        
        
      </div>
      <div className="form-actions">
        <button>Submit</button>
      </div>
    </form>
  );
};

export default SimpleInput;