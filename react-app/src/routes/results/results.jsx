import Navbar from "../../components/Navbar/Navbar";
import FestivalCard from "../../components/FestivalCard/FestivalCard";
import "./results.css";
import { useSelector, useDispatch } from 'react-redux';
import { getUpcomingArtistEventsAsync } from "../../redux/festivals/thunks";
import React, { useEffect } from 'react';


export default function Results() {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUpcomingArtistEventsAsync("Illenium"));
  }, []);


  const dummyFestivals = useSelector(
    (state) => state.festivals.festivals
  );
  return (
    <>
      <Navbar />
      <h2>Your results</h2>


{/* TODO: Update dummy festivals */}
      {JSON.stringify(dummyFestivals)}


      {/* {dummyFestivals ? (
        dummyFestivals.map((festival) => (
          <FestivalCard festival={festival} key={festival.id} />
        ))
      ) : (
        <p>Loading or Error, No data {JSON.stringify(dummyFestivals)}</p>
      )} */}
    </>
  );
}
