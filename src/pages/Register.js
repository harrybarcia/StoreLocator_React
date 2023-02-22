import axios from 'axios';
import {useRef, useState, useEffect} from 'react';
import { Navigate, useNavigate } from 'react-router-dom';


const SimpleInput2 = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  
  const navigate = useNavigate();

  const handleEmailChange = (evt) => {
    setEmail(evt.target.value);
    
  };
  const handlePasswordChange = (evt) => {
    setPassword(evt.target.value);
  };
  const handleConfirmPasswordChange = (evt) => {
    setConfirmPassword(evt.target.value);
  };
  
  const handleSubmit2 = async (evt) => {
    evt.preventDefault();
    
    axios({
      method: 'post',
      url: '/register',
      data: {
        email: email,
        password: password,
        confirmPassword: confirmPassword
      }
    })
    .then(function (response) {
      console.log(response);
    } )
    
    
  }


  return (
    <div>

    <form  
    style={{display: 'flex', flexDirection: 'column', width: '300px', margin: "40px"}}
    onSubmit={handleSubmit2}>
      <div >
        <label >Your Email</label>
        <input 
        type="text" 
        name="email"
        value={email} 
        onChange={handleEmailChange} />
        
       
        
      </div>

      <div >
        <label >Password</label>
        <input
        type="password"

        name="password"
        value={password}
        onChange={handlePasswordChange}
        />
      </div>

      <div>
        <label> Confirm Password</label>
        <input
        type="password"
        name="confirmPassword"
        value={confirmPassword}
        onChange={handleConfirmPasswordChange}
        />
      </div>
      <div className="form-actions">
        <button>Submit</button>
      </div>
    </form>
    </div>
  );
};

export default SimpleInput2;