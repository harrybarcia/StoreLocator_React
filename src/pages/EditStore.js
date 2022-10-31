import {useRef, useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";
const EditStore = (props) => {
    const params = useParams();
    const initialValues = {address:"", city:"", image:""};
    const [formValues, setFormValues] = useState(initialValues);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormValues({...formValues, [name]: value});
        console.log("formValues", formValues);
    }
    
    const navigate = useNavigate();
    const handleEdit = async (id) => {
        
        const data = await fetch(`/edit-store/${id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(formValues),
        });
        
    }
    
    return (
        <form onSubmit={() => handleEdit(params.id)}>
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

export default EditStore;