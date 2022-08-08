import { useState, useEffect, useRef, useMemo } from 'react';
import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';


/*
Based off this design for an autocomplete MUI component
https://mui.com/material-ui/react-autocomplete/#search-as-you-type
*/
function sleep(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

export default function SearchBar() {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const loading = open && options.length === 0;
  const inputValue = "Skrillex";
  const authToken = "";

  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      const rawSpotifyArtistsResults = await axios.get(
        `https://api.spotify.com/v1/search?q=${inputValue}&type=artist`, {
            params: { limit: 50, offset: 0 },
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${authToken}`,
                'Content-Type': 'application/json',
            },
        }
      )
      console.log(rawSpotifyArtistsResults.data);

      if (active) {
        setOptions([...rawSpotifyArtistsResults.data.artists.items]);
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

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
