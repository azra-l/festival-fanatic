import React from "react";
import ArtistCard from "../../components/ArtistCard/ArtistCard";
import { useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import "./detailed-results.css";

export default function DetailedResults() {
  const location = useLocation();
  const festival = location.state;

  const { date, name, city, state, artists, link } = festival;

  // from: https://stackoverflow.com/questions/12246394/how-to-get-month-from-string-in-javascript
  const dateParsed = new Date(date);
  const shortMonthName = new Intl.DateTimeFormat("en-US", { month: "short" })
    .format;
  const month = shortMonthName(dateParsed).toUpperCase();
  const day = dateParsed.getDate();
  const year = dateParsed.getFullYear();

  return (
    <>
      <Navbar />
      <h2>{name}</h2>
      <h3>{`${day} ${month} ${year}, ${city}, ${state}`}</h3>
      <a href={link} className="official-page">Official website</a>
      <h4>Artists</h4>
      {artists.map((artist) => (
          <ArtistCard artist={artist} key={artist.id}/>
      ))}
    </>
  );
}
