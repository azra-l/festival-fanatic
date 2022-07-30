import { Grid, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import FestivalCard from "../FestivalCard/FestivalCard";
import "./FestivalList.css";

const searchParams = [
  {
    value: 'artist',
    label: 'Artist',
  },
  {
    value: 'location',
    label: 'Location',
  }
]

const FestivalList = ({ festivals }) => {
  const [results, setResults] = useState([]);
  const [sortBy, setSortBy] = useState("artists");
  const [searchBy, setSearchBy] = useState("Artist");

  const handleSearchChange = (event) => {
    setSearchBy(event.target.value);
  };

  useEffect(() => {
    const sortArray = (type) => {
      const types = {
        name: "name",
        date: "date",
        artists: "artists",
      };
      const sortProperty = types[type];
      if (sortProperty !== "artists") {
        const sorted = [...festivals].sort((a, b) =>
          a[sortProperty].localeCompare(b[sortProperty])
        );
        setResults(sorted);
      } else {
        const sorted = [...festivals].sort(
          (a, b) => b.artists.length - a.artists.length
        );
        setResults(sorted);
      }
    };
    sortArray(sortBy);
  }, [festivals, sortBy]);

  return (
    <>
      <div className="query-taskbar">
        

        <Grid container direction={"row"} spacing={5} display="flex" className="grid-container">
          <Grid item justifyContent="flex-start">
            <div className="sort-container">
              <label>Sort By</label>
              <select onChange={(e) => setSortBy(e.target.value)}>
                <option value="artists">Matched artists (high - low)</option>
                <option value="name">Festival name (A - Z)</option>
                <option value="date">Date (newest - oldest)</option>
              </select>
            </div>
          </Grid>
          <Grid item justifyContent="flex-end">
            <TextField className="search-param" select label="Select" value={searchBy} onChange={handleSearchChange} helperText="Please select your search category" SelectProps={{native: true,}} focused color="secondary">
              {searchParams.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </TextField>
          </Grid>
          <Grid item justifyContent="flex-end">
            <TextField className="search-text-field" label="Search" variant="standard" focused color="secondary">Enter search parameter</TextField>
          </Grid>
        </Grid>
      </div>
      
      <div className="festival-results-container">
        {results.map((result, i) => (
          <FestivalCard festival={result} key={result.id} position={i % 5} />
        ))}
      </div>
    </>
  );
};

export default FestivalList;
