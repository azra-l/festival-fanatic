import { TextField } from "@mui/material";
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
  const [searchBy, setSearchBy] = useState("artist");

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
      <div className="query-container">
        <div className="sort-container">
          <label>Sort By</label>
          <select onChange={(e) => setSortBy(e.target.value)}>
            <option value="artists">Matched artists (high - low)</option>
            <option value="name">Festival name (A - Z)</option>
            <option value="date">Date (newest - oldest)</option>
          </select>
        </div>

        <div className="search-container">
          <TextField className="search-param" label="Select" value={searchBy} onChange={handleSearchChange}></TextField>
          <TextField className="search-text-field" label="Search" variant="standard">Enter search parameter</TextField>
        </div>
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
