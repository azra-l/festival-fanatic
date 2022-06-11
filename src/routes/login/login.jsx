import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import "./login.css";
import logo from '../../images/spotify-logo.png';

export default function LogIn() {
  const initialUserInfo = {
    userName: "",
    password: "",
  };

  const [userInfo, setUserInfo] = useState(initialUserInfo);
  const navigate = useNavigate();

  // Adapted from: https://www.pluralsight.com/guides/handling-multiple-inputs-with-single-onchange-handler-react
  const handleChange = (e) => {
    e.preventDefault();
    const {name, value} = e.target;
    setUserInfo({
      ...userInfo,
      [name]: value,
    })
  }

  return (
    <>
      <Navbar />
      <div className="login-container">
        <img src={logo} alt="spotify-logo" className="logo"/>
        <h3>Log in with Spotify</h3>
        <form>
          <div className="input">
            <label>Username</label>
            <input value={userInfo.userName} name="userName" required  onChange={handleChange}/>
          </div>
          <div className="input">
            <label>Password</label>
            <input value={userInfo.password} name="password" required type="password" onChange={handleChange}/>
          </div>
          <button className="login-btn" onClick={() => {navigate("/results")}}>Log in</button>
        </form>
      </div>
    </>
  );
}
