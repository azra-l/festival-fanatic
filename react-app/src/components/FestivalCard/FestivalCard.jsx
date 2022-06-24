import React from "react";
import "./FestivalCard.css";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FaRegHeart, FaHeart, FaTimes } from "react-icons/fa";
import { deleteFestival, saveFestival } from "../../redux/festivals/reducer";

export default function FestivalCard({ festival }) {
  const dispatch = useDispatch();

  const { date, name, city, state, img, saved, id } = festival;
  const dateParsed = new Date(date);

  // from: https://stackoverflow.com/questions/12246394/how-to-get-month-from-string-in-javascript
  const shortMonthName = new Intl.DateTimeFormat("en-US", { month: "short" })
    .format;
  const month = shortMonthName(dateParsed).toUpperCase();
  const day = dateParsed.getDate();
  const year = dateParsed.getFullYear();

  const handleSaveButtonClick = (e) => {
    e.preventDefault();
    dispatch(saveFestival(id));
  };

  const handleDeleteButtonClick = (e) => {
    e.preventDefault();
    dispatch(deleteFestival(id));
  };

  return (
    <div className="festival-card">
      <div className="btn">
        <button className="save-btn" onClick={handleSaveButtonClick}>
          {saved ? (
            <FaHeart color="red" size={24} />
          ) : (
            <FaRegHeart size={24} color="white" />
          )}
        </button>
        {!saved && (
          <button className="delete-btn" onClick={handleDeleteButtonClick}>
            <FaTimes color="white" size={20} />
          </button>
        )}
      </div>
      <div className="festival-information">
        <div className="date-container">
          <div className="festival-day">{day}</div>
          <div>{month}</div>
          <div>{year}</div>
        </div>
        <div className="festival-info">
          <div>{name}</div>
          <div>{`${city}, ${state}`}</div>
          {/**
           * TODO: Update this link later to view full details component
           */}
          <Link
            to="detailed-results"
            className="festival-link"
            state={festival}
          >
            See details
          </Link>
        </div>
        <img src={img} className="festival-img" alt="festival-img" />
      </div>
    </div>
  );
}
