import { Grid, TextField } from "@mui/material";
import { createTheme, ThemeProvider, } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import FestivalCard from "../FestivalCard/FestivalCard";
import "./FestivalList.css";

const searchParams = [
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
  const [searchBy, setSearchBy] = useState("location");
  const [searchQuery, setSearchQuery] = useState("");


  

  useEffect(() => {
    function sortArray(filteredList) {
      const sortArray = (type) => {
        const types = {
          name: "name",
          date: "date",
          artists: "artists",
        };
        const sortProperty = types[type];
        if (sortProperty !== "artists") {
          const sorted = [...filteredList].sort((a, b) =>
            a[sortProperty].localeCompare(b[sortProperty])
          );
          setResults(sorted);
        } else {
          const sorted = [...filteredList].sort(
            (a, b) => b.personalizedLineup.length - a.personalizedLineup.length
          );
          setResults(sorted);
        }
      };
      sortArray(sortBy);
    };

    const searchArray = (type) => {
      if (type === "venue") {
        const filter = festivals.filter(function (i, n) {
          return i.venue.toLowerCase().startsWith(searchQuery.toLowerCase());
        });
        sortArray(filter);
      } else if (type === "location") {
        const filter = festivals.filter(function (i, n) {
          return i.city.toLowerCase().startsWith(searchQuery.toLowerCase());
        });
        sortArray(filter);
      }
    }
    if(searchQuery === "") {
      sortArray(festivals);
    } else {
      searchArray(searchBy);
    }
  }, [festivals, searchBy, searchQuery, sortBy]);

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
