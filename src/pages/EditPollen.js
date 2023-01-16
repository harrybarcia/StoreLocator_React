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
    const [long, setLong] = useState('');
    const [lat, setLat] = useState('');
    const [existingPollen, setExistingPollen] = useState({});


    useEffect(() => {
        fetchPollen();
    }   
    , []);

    const fetchPollen = async () => {
        const response = await fetch(`/pollen/${id}`);
        const result = await response.json();
        const data = result.data;

        console.warn("data", data.data);
        setProvince(data.province);
        setValue(data.value);
        setColor(data.color);
        setForecast(data.forecast);
        setPro_id(data.pro_id);
        setLong(data.loc.coordinates[0]);
        setLat(data.loc.coordinates[1]);
        setExistingPollen(data);
    }
    console.log("existingPollen", existingPollen);

    const handleEdit = async (e) => {
        console.log("handleEdit");
        e.preventDefault();
        
        const province = e.target.province.value;
        const value = e.target.value.value;
        const color = e.target.color.value;
        const forecast = e.target.forecast.value;
        const pro_id = e.target.pro_id.value;
        const long = e.target.long.value;
        const lat = e.target.lat.value;

        const loc = {
            "coordinates": [long, lat],
            "type": "Point"
        }
        const data = {
            province,
            value,
            color,
            forecast,
            pro_id,
            loc
        }
        console.log("data", data);
        const res = await fetch(`${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
            });
        navigate('/all-pollens');
    }
    console.log("province", province);

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
                    <label >Long</label>
                    <input type="number" name="long" value={long} onChange
                    ={(e) => setLong(e.target.value)} />
                </div>
                <div >
                    <label >Lat</label>
                    <input type="number" name="lat" value={lat} onChange
                    ={(e) => setLat(e.target.value)} />
                </div>
                <div >
                    <button type="submit">Update</button>
                </div>
            </form>
        </div>
    );
}

export default EditPollen;



    
