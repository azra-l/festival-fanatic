import React, { useState, useEffect, useCallback } from "react";
import ArtistCard from "../../components/ArtistCard/ArtistCard";
import { useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import "./detailed-results.css";
import { BsCalendarFill } from "react-icons/bs";
import { MdLocationPin } from "react-icons/md";
import { GoLinkExternal } from "react-icons/go";
import ReactMapboxGl, { Marker } from "react-mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export default function DetailedResults() {
  const location = useLocation();
  const festival = location.state;

  const [isLoading, setIsLoading] = useState(true);
  const [artistDetails, setArtistDetails] = useState([]);

  const {
    date,
    name,
    city,
    region,
    artists,
    link,
    venue,
    tickets,
    country,
    latitude,
    longitude,
  } = festival;

  const baseURL = "http://localhost:3001/artists/";

  const artistURLs = artists.map((artist) => `${baseURL}/${artist}`);
  console.log(artistURLs);

  const getArtists = useCallback(async () => {
    setIsLoading(true);
    const results = await Promise.all(
      artistURLs.map((url) =>
        fetch(url, {
          method: "GET",
          credentials: "include",
          headers: {
            "Access-Control-Allow-Origin": "http://localhost:3000",
          },
        }).then((res) => res.json())
      )
    );
    setIsLoading(false);
    setArtistDetails(results);
    console.log(results);
  }, [artistURLs]);

  useEffect(() => {
    getArtists();
  }, []);

  // from: https://stackoverflow.com/questions/12246394/how-to-get-month-from-string-in-javascript
  const dateParsed = new Date(date);
  const shortMonthName = new Intl.DateTimeFormat("en-US", { month: "short" })
    .format;
  const month = shortMonthName(dateParsed).toUpperCase();
  const day = dateParsed.getDate();
  const year = dateParsed.getFullYear();
  const hour = dateParsed.getHours();

  const long = parseFloat(longitude);
  const lat = parseFloat(latitude);

  // Map adapted from: https://github.com/alex3165/react-mapbox-gl/blob/master/docs/API.md
  const Map = ReactMapboxGl({
    accessToken: process.env.REACT_APP_MAP_BOX_TOKEN,
  });

  return (
    <>
      {isLoading ? (
        <Navbar />
      ) : (
        <div>
          <Navbar />
          <div className="detailed-results-container">
            <div className="logistics-container">
              <p className="title">{name}</p>
              <div className="logistics">
                <div className="date-container">
                  <BsCalendarFill color="white" size={40} />
                  <div className="date-time">
                    <p className="info">{`${month} ${day}, ${year}`}</p>
                    <p> {`Starts at: ${hour}:00`}</p>
                  </div>
                </div>
                <div className="location-container">
                  <MdLocationPin color="white" size={40} />
                  <div className="location">
                    <p className="info">{venue}</p>
                    <p>{`${city} ${region && region}`}</p>
                    <p> {`${country}`}</p>
                  </div>
                </div>
              </div>
              <div className="links">
                <a href={tickets} target="_blank" rel="noopener noreferrer">
                  <GoLinkExternal />
                  Buy Tickets
                </a>
                <a href={link} target="_blank" rel="noopener noreferrer">
                  <GoLinkExternal />
                  Festival Webpage
                </a>
              </div>
            </div>
            <div className="artist-container">
              <p className="lineup">Lineup</p>
              <div className="artists">
                {artistDetails.map((artist) => (
               <ArtistCard artist={artist} />
             ))}
              </div>
            </div>
            {latitude && longitude && (
              <div className="map">
                <Map
                  // eslint-disable-next-line react/style-prop-object
                  style="mapbox://styles/mapbox/light-v10"
                  containerStyle={{
                    height: "50vh",
                    width: "50vw",
                  }}
                  center={[long, lat]}
                >
                  {/*Adapted from: https://www.tabnine.com/code/javascript/classes/react-map-gl/Marker */}
                  <Marker coordinates={[long, lat]} anchor="bottom">
                    <div
                      style={{
                        height: 15,
                        width: 15,
                        backgroundColor: "red",
                        borderRadius: 10,
                        textAlign: "center",
                      }}
                    ></div>
                  </Marker>
                </Map>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
