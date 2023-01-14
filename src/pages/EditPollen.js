import {useRef, useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom"

const EditPollen = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    console.log("id", id);
    const [province, setProvince] = useState('');
    const [value, setValue] = useState(''); 
    const [color, setColor] = useState('');
    const [forecast, setForecast] = useState('');
    const [pro_id, setPro_id] = useState('');
    const [loc, setLoc] = useState('');
    const [existingPollen, setExistingPollen] = useState({});

    useEffect(() => {
        fetchPollen();
    }   
    , []);

    const fetchPollen = async () => {
        const res = await fetch(`http://localhost:3000/pollen/${id}`);
        const data = await res.json();

        console.log("data", data.province);
        setProvince(data.province);
        setValue(data.value);
        setColor(data.color);
        setForecast(data.forecast);
        setPro_id(data.pro_id);
        setLoc(data.loc);
        setExistingPollen(data);
    }
    console.log("existingPollen", existingPollen);

    const handleEdit = async (e) => {
        e.preventDefault();
        const longitude = 41.8781;
        const latitude = -87.6298;
        const coordinates = [longitude, latitude];
        const loc = {
            type: "Point",  
            coordinates: coordinates
        }

        const formData = new FormData();
        formData.append('province', province);
        formData.append('value', value);
        formData.append('color', color);    
        formData.append('forecast', forecast);
        formData.append('pro_id', pro_id);
        console.log(formData);
        // formData.append('loc', loc);
        


        const response = await fetch(`/update-pollen/${id}`, {
        method: 'PUT',
        body: formData,
        });
        const data = await response.json();
        console.log("data in editstore.js", data);
        navigate('/');
    }


    return (
        <div className="container">
            <form id="contact" onSubmit={handleEdit}>
                <h4>Edit your pollen</h4>
                <div >
                    <label >Province</label>
                    <select name="province" value={province} onChange={(e) => setProvince(e.target.value)}>
                        <option value="AB">Alberta</option>
                        <option value="BC">British Columbia</option>
                        <option value="MB">Manitoba</option>
                        <option value="NB">New Brunswick</option>
                        <option value="NL">Newfoundland and Labrador</option>
                        <option value="NS">Nova Scotia</option>
                        <option value="NT">Northwest Territories</option>
                        <option value="NU">Nunavut</option>
                        <option value="ON">Ontario</option>
                        <option value="PE">Prince Edward Island</option>
                        <option value="QC">Quebec</option>
                        <option value="SK">Saskatchewan</option>
                    </select>
                </div>
                <div >
                    <label >Value</label>
                    <input type="text" name="value" value={value} onChange={(e) => setValue(e.target.value)} />
                </div>
                <div >
                    <label >Color</label>
                    <input type="text" name="color" value={color} onChange={(e) => setColor(e.target.value)} />
                </div>
                <div >
                    <label >Forecast</label>
                    <input type="text" name="forecast" value={forecast} onChange={(e) => setForecast(e.target.value)} />
                </div>
                <div >
                    <label >Pro_id</label>
                    <input type="text" name="pro_id" value={pro_id} onChange={(e) => setPro_id(e.target.value)} />
                </div>
                <div >
                    <label >Loc</label>
                    <input type="text" name="loc" value={loc} onChange
                    ={(e) => setLoc(e.target.value)} />
                </div>
                <div >
                    <button type="submit">Update</button>
                </div>
            </form>
        </div>
    );
}

export default EditPollen;



    
