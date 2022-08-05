import React, { useState, useEffect, useCallback } from "react";
import ArtistCard from "../../components/ArtistCard/ArtistCard";
import { useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import "./detailed-results.css";
import { BsCalendarFill } from "react-icons/bs";
import { MdLocationPin } from "react-icons/md";
import { GoLinkExternal } from "react-icons/go";
import { FaShare } from "react-icons/fa";
import Map, { Marker } from "react-map-gl";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import EmailModal from "../../components/EmailModal/EmailModal";

import { apiBaseUrl, appBaseUrl } from "../../utilities/base-url";

// Temp bug fix: https://github.com/visgl/react-map-gl/issues/1266#issuecomment-753686953
mapboxgl.workerClass =
  // eslint-disable-next-line import/no-webpack-loader-syntax
  require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

export default function DetailedResults() {
  const location = useLocation();
  const festival = location.state;

  const [isLoading, setIsLoading] = useState(true);
  const [artistDetails, setArtistDetails] = useState([]);
  const [isSharing, setIsSharing] = useState(false);

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
    description
  } = festival;

  const artistURLs = artists.map((artist) => `${apiBaseUrl}/artists/${artist}`);

  const getArtists = useCallback(async () => {
    setIsLoading(true);
    const results = await Promise.all(
      artistURLs.map((url) =>
        fetch(url, {
          method: "GET",
          credentials: "include",
          headers: {
            "Access-Control-Allow-Origin": appBaseUrl,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const onShareClick = (e) => {
    e.preventDefault();
    setIsSharing(!isSharing);
  };

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
                <button onClick={onShareClick}>
                  <FaShare />
                  Share
                </button>
              </div>
            </div>

            {description === "" ? 
            <div></div> : 
            <div className="description">
              <p className="lineup">Description</p>
              <p> {description}</p>
            </div>}

            <div className="artist-container">
              <p className="lineup">Artist Lineup</p>
              <div className="artists">
                {artistDetails.map((artist, i) => (
                  <ArtistCard artist={artist} key={i} />
                ))}
              </div>
            </div>
            <div className="share-container">
              {isSharing && (
                <EmailModal onClose={onShareClick} festival={festival} />
              )}
            </div>
            {latitude && longitude && (
              <div className="map">
                <Map
                  initialViewState={{
                    longitude: long,
                    latitude: lat,
                    zoom: 10,
                  }}
                  style={{
                    height: "50vh",
                    width: "50vw",
                  }}
                  mapStyle="mapbox://styles/mapbox/light-v10"
                  mapboxAccessToken={process.env.REACT_APP_MAP_BOX_TOKEN}
                >
                  <Marker longitude={long} latitude={lat} anchor="bottom">
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
