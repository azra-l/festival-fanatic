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

  useEffect(() => {
    dispatch(getUpcomingArtistEventsAsync("Illenium"));
  }, []);

  const dummyFestivals = useSelector((state) => state.festivals.festivals);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const savedFestivals = dummyFestivals.filter(
    (festival) => festival.saved === true
  );

  return (
    <>
      <Navbar />
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Festivals for you" value="1" sx={{ color: "white" }} />
            <Tab label="Saved Festivals" value="2" sx={{ color: "white" }} />
          </TabList>
        </Box>
        <TabPanel value="1">
          <div className="festival-results-container">
            {dummyFestivals ? (
              dummyFestivals.map((festival) => (
                <FestivalCard festival={festival} key={festival.id} />
              ))
            ) : (
              <p>Loading or Error, No data {JSON.stringify(dummyFestivals)}</p>
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
      </TabContext>
    </>
  );
}
