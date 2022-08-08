import React from "react";
import "./FestivalCard.css";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { BsArchive, BsArchiveFill, BsCircle } from "react-icons/bs";
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

      <div className="festival-information">
        <div className="date-container">
          <div className="festival-day">{day}</div>
          <div className="festival-month">{month}</div>
          <div className="festival-year">{year}</div>
          <button className="save-btn" onClick={handleSaveButtonClick}>

            {/* React icon stacking https://github.com/react-icons/react-icons/issues/79 */}
            {saved ? (
              <span className="animated" style={{ display: 'inline-block', position: 'relative' }}>
                <BsCircle textAnchor="middle" alignmentBaseline="middle" style={{ fontSize: '3em', color: 'white' }} />
                <FaHeart
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  style={{ fontSize: '1.5em', position: 'absolute', right: '.5em', top: '.5em', color: 'white' }}
                />
              </span>
            ) : (
              <span className="animated" style={{ display: 'inline-block', position: 'relative' }}>
                <BsCircle textAnchor="middle" alignmentBaseline="middle" style={{ fontSize: '3em', color: 'white' }} />
                <FaRegHeart
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  style={{ fontSize: '1.5em', position: 'absolute', right: '.5em', top: '.5em', color: 'white' }}
                />
              </span>
            )}
          </button>
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
          <div className="date-container">

          </div>
        </div>
        <div className="wrapper">
          <div className="matched-artists">
            <div className="num">{artists.length}</div>
            <div className="text">
              {artists.length > 1 ? "ARTISTS" : "ARTIST"}

            </div>


          </div>

          <button className="delete-btn" onClick={handleArchiveButtonClick}>

            {archived ? (
              <span className="animated" style={{ display: 'inline-block', position: 'relative' }}>
                <BsCircle textAnchor="middle" alignmentBaseline="middle" style={{ fontSize: '3em', color: 'white' }} />
                <BsArchiveFill
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  style={{ fontSize: '1.5em', position: 'absolute', right: '.5em', top: '.5em', color: 'white' }}
                />
              </span>
            ) : (
              <span className="animated" style={{ display: 'inline-block', position: 'relative' }}>
                <BsCircle textAnchor="middle" alignmentBaseline="middle" style={{ fontSize: '3em', color: 'white' }} />
                <BsArchive
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  style={{ fontSize: '1.5em', position: 'absolute', right: '.5em', top: '.5em', color: 'white' }}
                />
              </span>
            )}
          </button>


        </div>
      </div>
    </div>
  );
}
