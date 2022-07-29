import Navbar from "../../components/Navbar/Navbar";
import FestivalCard from "../../components/FestivalCard/FestivalCard";
import "./results.css";
import { useSelector, useDispatch } from "react-redux";
import { getUpcomingArtistEventsAsync } from "../../redux/festivals/thunks";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import TabList from "@mui/lab/TabList";
import Tab from "@mui/material/Tab";
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";

export default function Results() {
  const dispatch = useDispatch();
  const [value, setValue] = useState("1");
  const [results, setResults] = useState([]);

  useEffect(() => {
    dispatch(getUpcomingArtistEventsAsync());
  }, [dispatch]);

  const festivals = useSelector((state) => state.festivals.festivals);

  useEffect(() => {
    const festivalArr = Object.keys(festivals).map((key) => festivals[key]);
    const festivalsToDisplay = festivalArr.filter(
      (festival) => festival.archived === undefined || festival.archived === false
    );
    setResults(festivalsToDisplay)
  }, [festivals]);

  

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const savedFestivals = results.filter(
    (festival) => festival.saved !== undefined && festival.saved === true
  );

  const archivedFestivals = results.filter(
    (festival) => festival.archived !== undefined && festival.archived === true
  );

  // TODO: Need make festival cards responsive for mobile
  return (
    <>
      <Navbar />
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Festivals for you" value="1" sx={{ color: "white" }} />
            <Tab label="Saved Festivals" value="2" sx={{ color: "white" }} />
            <Tab label="Archived Festivals" value="3" sx={{ color: "white" }} />
          </TabList>
        </Box>
        <TabPanel value="1">
          <div className="sort-container">
          </div>
          <div className="festival-results-container">
            {results? (
              results.map((festival, i) => (
                <FestivalCard
                  festival={festival}
                  key={festival.id}
                  position={i % 5}
                />
              ))
            ) : (
              <p>Loading or Error, No data {JSON.stringify(festivals)}</p>
            )}
          </div>
        </TabPanel>
        <TabPanel value="2">
          <div className="festival-results-container">
            {savedFestivals ? (
              savedFestivals.map((festival) => (
                <FestivalCard festival={festival} key={festival.id} />
              ))
            ) : (
              <p>You have no saved festivals</p>
            )}
          </div>
        </TabPanel>
        <TabPanel value="3">
          <div className="festival-results-container">
            {archivedFestivals ? (
              archivedFestivals.map((festival) => (
                <FestivalCard festival={festival} key={festival.id} />
              ))
            ) : (
              <p>You have no archived festivals</p>
            )}
          </div>
        </TabPanel>
      </TabContext>
    </>
  );
}
