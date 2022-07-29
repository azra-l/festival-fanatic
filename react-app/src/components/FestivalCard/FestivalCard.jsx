import React from "react";
import "./FestivalCard.css";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FaRegHeart, FaHeart, FaCalendar } from "react-icons/fa";
import { BsArchive, BsArchiveFill } from "react-icons/bs";
import { updateFestivalAsync } from "../../redux/festivals/thunks";

export default function FestivalCard({ festival, position }) {
  const dispatch = useDispatch();

  const { date, name, city, region, saved, archived, artists, _id } = festival;
  const dateParsed = new Date(date);

  // from: https://stackoverflow.com/questions/12246394/how-to-get-month-from-string-in-javascript
  const shortMonthName = new Intl.DateTimeFormat("en-US", { month: "short" })
    .format;
  const month = shortMonthName(dateParsed).toUpperCase();
  const day = dateParsed.getDate();
  const year = dateParsed.getFullYear();

  const handleSaveButtonClick = (e) => {
    e.preventDefault();
    const action = saved ? "unsave" : "save";
    dispatch(updateFestivalAsync({ _id, action }));
  };

  const handleArchiveButtonClick = (e) => {
    e.preventDefault();
    const action = archived ? "unarchive" : "archive";
    dispatch(updateFestivalAsync({ _id, action }));
  };

  return (
    <div className={`festival-card card-${position}`}>
      <div className="btn">
        <button className="save-btn" onClick={handleSaveButtonClick}>
          {saved ? (
            <FaHeart color="white" size={35} />
          ) : (
            <FaRegHeart size={35} color="white" />
          )}
        </button>
        <button className="delete-btn" onClick={handleArchiveButtonClick}>
          {archived ? (
            <BsArchiveFill color="white" size={35} />
          ) : (
            <BsArchive color="white" size={35} />
          )}
        </button>
      </div>
      <div className="festival-information">
        <div className="date-container">
          <FaCalendar color="white" size={30} />
          <div className="festival-day">{day}</div>
          <div className="festival-month">{month}</div>
          <div className="festival-year">{year}</div>
        </div>
        <div className="festival-info">
          <div className="festival-name">{name}</div>
          <div className="festival-location">{`${city}, ${region}`}</div>
          <Link
            to="detailed-results"
            className="festival-link"
            state={festival}
          >
            See details
          </Link>
        </div>
        <div className="matched-artists">
          <div className="num">{artists.length}</div>
          <div className="text">
            {artists.length > 1 ? "ARTISTS MATCHED" : "ARTIST MATCHED"}
          </div>
        </div>
      </div>
    </div>
  );
}
