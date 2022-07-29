import Navbar from "../../components/Navbar/Navbar";
import "./results.css";
import { useSelector, useDispatch } from "react-redux";
import { getUpcomingArtistEventsAsync } from "../../redux/festivals/thunks";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import TabList from "@mui/lab/TabList";
import Tab from "@mui/material/Tab";
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";
import FestivalList from "../../components/FestivalList/FestivalList";

export default function Results() {
  const dispatch = useDispatch();
  const [value, setValue] = useState("1");

  useEffect(() => {
    dispatch(getUpcomingArtistEventsAsync());
  }, [dispatch]);

  const festivals = useSelector((state) => state.festivals.festivals);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const savedFestivals = festivals.filter(
    (festival) => festival.saved !== undefined && festival.saved === true
  );

  const archivedFestivals = festivals.filter(
    (festival) => festival.archived !== undefined && festival.archived === true
  );

  const festivalArr = Object.keys(festivals).map((key) => festivals[key]);

  const festivalsToDisplay = festivalArr.filter(
    (festival) => festival.archived === undefined || festival.archived === false
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
          <FestivalList festivals={festivalsToDisplay} />
        </TabPanel>
        <TabPanel value="2">
          <div>
            {savedFestivals ? (
              <FestivalList festivals={savedFestivals} />
            ) : (
              <p>You have no saved festivals</p>
            )}
          </div>
        </TabPanel>
        <TabPanel value="3">
          <div>
            {archivedFestivals ? (
              <FestivalList festivals={archivedFestivals} />
            ) : (
              <p>You have no archived festivals</p>
            )}
          </div>
        </TabPanel>
      </TabContext>
    </>
  );
}
