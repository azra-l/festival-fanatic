import React from "react";
import "./FestivalCard.css";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FaRegHeart, FaHeart  } from "react-icons/fa";
import { BsArchive, BsArchiveFill } from "react-icons/bs";
import { updateFestivalAsync } from "../../redux/festivals/thunks";

export default function FestivalCard({ festival, user }) {
  const dispatch = useDispatch();

  // TODO: Use a non-hard-coded image

  const {
    date,
    name,
    city,
    region,
    img = "https://cdn1.matadornetwork.com/blogs/1/2021/08/Music-festivals-2021-North-Coast-Festival-Chicago-1200x854.jpeg",
    saved,
    archived,
  } = festival;
  const dateParsed = new Date(date);

  // from: https://stackoverflow.com/questions/12246394/how-to-get-month-from-string-in-javascript
  const shortMonthName = new Intl.DateTimeFormat("en-US", { month: "short" })
    .format;
  const month = shortMonthName(dateParsed).toUpperCase();
  const day = dateParsed.getDate();
  const year = dateParsed.getFullYear();

  const handleSaveButtonClick = (e) => {
    e.preventDefault();
    const userObj = {
      user,
      festival: {...festival, saved: !saved}
    }
    dispatch(updateFestivalAsync(userObj));
  };

  const handleArchiveButtonClick = (e) => {
    e.preventDefault();
    const userObj = {
      user,
      festival: {...festival, archived: !archived}
    }
    dispatch(updateFestivalAsync(userObj));
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
        <button className="delete-btn" onClick={handleArchiveButtonClick}>
          {archived ? (
            <BsArchiveFill color="white" size={24} />
          ) : (
            <BsArchive color="white" size={20} />
          )}
        </button>
      </div>
      <div className="festival-information">
        <div className="date-container">
          <div className="festival-day">{day}</div>
          <div>{month}</div>
          <div>{year}</div>
        </div>
        <div className="festival-info">
          <div>{name}</div>
          <div>{`${city}, ${region}`}</div>
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
