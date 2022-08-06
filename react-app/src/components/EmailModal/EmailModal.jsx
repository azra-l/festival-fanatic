import React, { useState } from "react";
import "./EmailModal.css";
import { AiOutlineClose } from "react-icons/ai";
import {RiSendPlaneFill} from "react-icons/ri";
import {TbFaceIdError} from "react-icons/tb";
import { apiBaseUrl, appBaseUrl } from "../../utilities/base-url";

const EmailModal = ({ onClose, festival }) => {
  const [mailForm, setMailForm] = useState({
    sender: "",
    receiver: "",
    to: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setMailForm((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleClose = (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setMailForm({
      sender: "",
      receiver: "",
      to: "",
    });
    onClose(e);
  };

  const handleShareClick = async (e) => {
    e.preventDefault();
    const mail = {
      to: mailForm.to,
      sender: mailForm.sender,
      receiver: mailForm.receiver,
      name: festival.name,
      link: festival.link,
      tickets: festival.tickets,
      date: `${festival.day} ${festival.month} ${festival.year} at ${festival.hour}:00`
    };

    try {
      const res = await fetch(`${apiBaseUrl}/email`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-type": "application/json",
          "Access-Control-Allow-Origin": appBaseUrl,
        },
        body: JSON.stringify(mail),
      });
      if(res.ok){
        setSuccess(true);
      } else {
        throw new Error('Cannot send email');
      }
    } catch (e) {
      setError(true);
    }
  };

  return (
    <div className="email-modal">
      <button className="close-btn" onClick={handleClose}>
        <AiOutlineClose color="white" size={26} />
      </button>
      {error ? (
        <div className="message-container">
          <TbFaceIdError color="white" size={45}/>
          <p>Unable to send email, please try later</p>
          </div>
      ) : success ? (
        <div className="message-container">
          <RiSendPlaneFill color="white" size={45}/>
         <p>Your message is on its way!</p>
          </div>
      ) : (
        <form className="email-form">
          <fieldset>
            <legend>Email to a friend</legend>
            <label>Your name:</label>
            <input
              placeholder="Enter your name"
              onChange={handleChange}
              name="sender"
              value={mailForm.sender}
            />
            <br />
            <label>Your friend's name:</label>
            <input
              placeholder="Enter your friend's name"
              onChange={handleChange}
              name="receiver"
              value={mailForm.receiver}
            />
            <br />
            <label>To:</label>
            <input
              placeholder="Enter a valid email address"
              onChange={handleChange}
              name="to"
              value={mailForm.to}
            />
            <br />
            <button type="button" onClick={handleShareClick}>
              Share
            </button>
          </fieldset>
        </form>
      )}
    </div>
  );
};

export default EmailModal;
