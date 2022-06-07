import React from "react";
import "./FestivalCard.css";
import { Link } from "react-router-dom";

export default function FestivalCard({ festival }) {
  const { date, name, city, state, img } = festival;
  const dateParsed = new Date(date);

  // from: https://stackoverflow.com/questions/12246394/how-to-get-month-from-string-in-javascript
  const shortMonthName = new Intl.DateTimeFormat("en-US", { month: "short" })
    .format;
  const month = shortMonthName(dateParsed).toUpperCase();
  const day = dateParsed.getDate();
  const year = dateParsed.getFullYear();

  return (
    <div className="festival-card">
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
        <Link to="/" className="festival-link">
          See details
        </Link>
      </div>
      <img src={img} className="festival-img" alt="festival-img" />
    </div>
  );
}
