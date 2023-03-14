import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import './NewStoreForm.css';
import AuthContext from "../contexts/auth-context";
export default function Login() {

  

  const [loggedIn, setLoggedIn] = useState(false);
  console.log("loggedIn", loggedIn);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  
  
const authCtx = useContext(AuthContext);
	useEffect(() => {
		const storedUserLoggedInInformation = localStorage.getItem('isLoggedIn');

		if (storedUserLoggedInInformation === '1') {
			setLoggedIn(true);
		}
	}, []);

  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    axios({
      method: "post",
      url: "/login",
      
      data: {
        email: email,
        password: password
      },
    })
      
      .then(function (response) {
        console.log("response");
        console.log(response);
      })
      .then(() => authCtx.onLogin())
      
      .then(() => navigate("/"))
      
      
      .catch(function (error) {
        console.log(error);
      });
      
    }
    

  return (
    <div className="container">
      <form id="contact" onSubmit={handleSubmit}>
      <label >Email</label>
        <input  autoFocus
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}/>
      <label >Password</label>
        <input  autoFocus
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}/>
        
        
        <button name="submit" type="submit" id="contact-submit" data-submit="...Sending"  disabled={!validateForm()}>
          Login
        </button>
      </form>
    </div>
  );
}