import { useState, useEffect } from 'react';
import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';


/*
Based off this design for an autocomplete MUI component
https://mui.com/material-ui/react-autocomplete/#search-as-you-type
*/
export default function SearchBar() {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const loading = open && options.length === 0;
  const [selectedArtists, setSelectedArtists] =  useState([]);
  const authToken = "";

  function handleAddSearchResult(value) {
    setSelectedArtists([...selectedArtists, value]);
    console.log(selectedArtists);
  }

  async function handleSpotifySearch(value) {
    if (value === "") {
      return undefined;
    }

    const rawSpotifyArtistsResults = await axios.get(
      `https://api.spotify.com/v1/search?q=${value}&type=artist`, {
          params: { limit: 50, offset: 0 },
          headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${authToken}`,
              'Content-Type': 'application/json',
          },
      }
    )
    setOptions([...rawSpotifyArtistsResults.data.artists.items]);
  }

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  return (
    <Autocomplete
      id="asynchronous-demo"
      sx={{ width: 300 }}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      onInputChange={(event, newInputValue) => {
        handleSpotifySearch(newInputValue);
      }}
      onChange={(event, newValue) => {
        handleAddSearchResult(newValue);
        
      }}
      isOptionEqualToValue={(option, value) => option.title === value.title}
      getOptionLabel={(option) => option.name}
      options={options}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search Artists on Spotify"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
}
