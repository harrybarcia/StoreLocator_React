import axios from "axios";
import React, { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
    }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input  autoFocus
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}/>
        <input  autoFocus
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}/>
        
        
        <button type="submit" disabled={!validateForm()}>
          Login
        </button>
      </form>
    </div>
  );
}