import {useRef, useState, useEffect} from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PollenForm = () => {
    const [province, setProvince] = useState('');
    const [value, setValue] = useState('');
    const [color, setColor] = useState('');
    const [forecast, setForecast] = useState('');
    const [pro_id, setPro_id] = useState('');
    const navigate = useNavigate();
    const handleProvinceChange = (evt) => {
        setProvince(evt.target.value);
    }
    const handleValueChange = (evt) => {
        setValue(evt.target.value);
    }
    const handleColorChange = (evt) => {
        setColor(evt.target.value);
    }
    const handleForecastChange = (evt) => {
        setForecast(evt.target.value);
    }
    const handlePro_idChange = (evt) => {
        setPro_id(evt.target.value);
    }
    const handleSubmit = async (evt) => {
        evt.preventDefault();
        
        axios({
            method: 'post',
            url: '/add-pollen',
            data: {
              province: province,
                value: value,
                color: color,
                forecast: forecast,
                pro_id: pro_id
            }

          })
          .then(function (response) {
            console.log(response);
          } )

        navigate('/pollen');
    }
    return (
        <div className="container">
            <form id="contact" onSubmit={handleSubmit}>
                <h4>Add your new pollen</h4>
                <div >
                    <label >Province</label>
                    <select name="province" value={province} onChange={handleProvinceChange}>
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
                        <option value="YT">Yukon</option>
                    </select>
                    <br />
                    <label >Value</label>
                    <input
                        type="number"
                        name="value"
                        value={value}
                        onChange={handleValueChange} />
                    <label >Color</label>
                    <input
                        type="text"
                        name="color"
                        value={color}
                        onChange={handleColorChange} />
                                            <label >Forecast</label>
                    <input
                        type="number"
                        name="forecast"
                        value={forecast}
                        onChange={handleForecastChange} />
                                            <label >Pro_id</label>
                    <input
                        type="number"
                        name="pro_id"
                        value={pro_id}
                        onChange={handlePro_idChange} />
      <button name="submit" type="submit" id="contact-submit" data-submit="...Sending" >Submit</button>
                </div>
            </form>
        </div>
    )
}
export default PollenForm;
