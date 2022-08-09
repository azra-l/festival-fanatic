import { Grid, TextField, InputLabel } from "@mui/material";
import { createTheme, ThemeProvider, } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import FestivalCard from "../FestivalCard/FestivalCard";
import "./FestivalList.css";

const searchParams = [
  // TODO Add back to search params once solution is found for querying artist names from festivals
  // {
  //   value: 'artist',
  //   label: 'Artist',
  // },
  {
    value: 'location',
    label: 'Location',
  },
  {
    value: 'venue',
    label: 'Venue',
  }
]


const inputStyle = {
  style: {
    color: "white",
  }
}

const helperTextStyles = { style: { color: "white" } }

const darkTheme = createTheme({
  palette: {
    type: "dark",
    primary: {
      main: '#FFFFFF'
    }
  },
})

const sortParams = [
  {
    value: 'artists',
    label: 'Matched artists (high - low)',
  },
  {
    value: 'name',
    label: 'Festival name (A - Z)',
  },
  {
    value: 'date',
    label: 'Date (soonest - furthest)',
  }
]

const FestivalList = ({ festivals }) => {
  const [results, setResults] = useState([]);
  const [sortBy, setSortBy] = useState("artists");
  const [searchBy, setSearchBy] = useState("");
  const [searchQuery, setSearchQuery] = useState("");


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

  useEffect(() => {
    const searchArray = (type) => {
      // TODO artists array contains ids and not names, find a way to query names?
      // if (type === "Artist") {
      //   const filter = festivals.filter(function(i,n){
      //     // slow af and doesn't work good
      //     return i.artists.filter(s => s.toLowerCase().startsWith(searchQuery.toLowerCase()));
      //     // trying this for speed
      //     // return i.artists.toString().toLowerCase().includes(searchQuery.toLowerCase());
      //   });
      if (type === "venue") {
        const filter = festivals.filter(function (i, n) {
          return i.venue.toLowerCase().startsWith(searchQuery.toLowerCase());
        });
        setResults(filter);
      } else if (type === "location") {
        const filter = festivals.filter(function (i, n) {
          return i.city.toLowerCase().startsWith(searchQuery.toLowerCase());
        });
        setResults(filter);
      }
    }
    searchArray(searchBy)
  }, [festivals, searchBy, searchQuery]);

  return (
    <>
      <div className="query-taskbar">
        <ThemeProvider theme={darkTheme}>
          <Grid container direction={"row"} spacing={5} display="flex" className="grid-container">
            <Grid item justifyContent="flex-start">
              <TextField select label="Sort By" value={sortBy} onChange={(e) => setSortBy(e.target.value)} helperText="Please select your sort category" SelectProps={{
                native: true,
              }} inputProps={inputStyle} FormHelperTextProps={helperTextStyles} focused>
                {sortParams.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid item justifyContent="flex-end">
              <TextField select label="Select" value={searchBy} onChange={(e) => setSearchBy(e.target.value)} helperText="Please select your search category" SelectProps={{ native: true }} inputProps={inputStyle} FormHelperTextProps={helperTextStyles} focused>
                {searchParams.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid item justifyContent="flex-end">
              <TextField className="search-text-field" label="Search" variant="standard" onChange={(e) => setSearchQuery(e.target.value)} inputProps={inputStyle} FormHelperTextProps={helperTextStyles} focused>Enter search parameter</TextField>
            </Grid>
          </Grid>
        </ThemeProvider>
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
