import React, { useState } from "react";
import "./EmailModal.css";
import { AiOutlineClose } from "react-icons/ai";
import { apiBaseUrl, appBaseUrl } from "../../utilities/base-url";

const EmailModal = ({ onClose, festival }) => {
  const [mailForm, setMailForm] = useState({
    sender: "",
    receiver: "",
    to: "",
  });

  const handleChange = (e) => {
    setMailForm((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleShareClick = async(e) => {
    e.preventDefault();
    const mail = {
      to: mailForm.to,
      sender: mailForm.sender,
      receiver: mailForm.receiver,
      name: festival.name,
      link: festival.link,
      tickets: festival.tickets,
    };

    try {
      await fetch(`${apiBaseUrl}/email`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-type": "application/json",
          "Access-Control-Allow-Origin": appBaseUrl,
        },
        body: JSON.stringify(mail)
      });
      alert('email sent');
    } catch (e) {
      alert('cannot send');
    }
  };

  return (
    <div className="email-modal">
      <button className="close-btn" onClick={onClose}>
        <AiOutlineClose style={{ color: "white" }} />
      </button>
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
            placeholder=""
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
    </div>
  );
};

export default EmailModal;
