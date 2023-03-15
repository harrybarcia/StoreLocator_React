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
    <div className="flex justify-center">
      <form className="w-full max-w-lg bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 mt-36" onSubmit={handleSubmit}>
      <label className="block text-gray-700 font-bold mb-2" >Email</label>
        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
          autoFocus
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}/>
      <label className="block text-gray-700 font-bold mb-2" >Password</label>
        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
          autoFocus
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}/>
        
        
        <button 
        className="rounded-lg px-4 py-2 border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-gray-100 duration-300"
        name="submit" type="submit" id="contact-submit" data-submit="...Sending"  disabled={!validateForm()}>
          Login
        </button>
      </form>
    </div>
  );
}