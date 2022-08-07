import * as React from 'react';
import { useState, useEffect, useRef, useMemo } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import throttle from 'lodash/throttle';
import parse from 'autosuggest-highlight/parse';


/*
Based off this design for an autocomplete MUI component
https://mui.com/material-ui/react-autocomplete/#search-as-you-type
*/
function loadScript(src, position, id) {
    if (!position) {
      return;
    }
  
    const script = document.createElement('script');
    script.setAttribute('async', '');
    script.setAttribute('id', id);
    script.src = src;
    position.appendChild(script);
}

const autocompleteService = { current: null };

export default function SearchBar() {
    const [value, setValue] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [options, setOptions] = useState([]);
    const loaded = useRef(false);

    if (typeof window !== 'undefined' && !loaded.current) {
        if (!document.querySelector('#spotify-search')) {
          loadScript(
            `https://api.spotify.com/v1/search?q=${inputValue}&type=artist`,
            document.querySelector('head'),
            'spotify-search',
          );
        }
    
        loaded.current = true;
    }

    const fetch = useMemo(
        () =>
          throttle((request, callback) => {
            autocompleteService.current.getPlacePredictions(request, callback);
          }, 200),
        [],
    );

    useEffect(() => {
        let active = true;
    
        if (!autocompleteService.current && window.google) {
          autocompleteService.current =
            new window.google.maps.places.AutocompleteService();
        }
        if (!autocompleteService.current) {
          return undefined;
        }
    
        if (inputValue === '') {
          setOptions(value ? [value] : []);
          return undefined;
        }
    
        fetch({ input: inputValue }, (results) => {
          if (active) {
            let newOptions = [];
    
            if (value) {
              newOptions = [value];
            }
    
            if (results) {
              newOptions = [...newOptions, ...results];
            }
    
            setOptions(newOptions);
          }
        });
    
        return () => {
          active = false;
        };
    }, [value, inputValue, fetch]);

    return (
        <Autocomplete
            id="spotify-search"
            sx={{ width: 300 }}
            getOptionLabel={(option) =>
                typeof option === 'string' ? option : option.description
            }
            filterOptions={(x) => x}
            options={options}
            autoComplete
            includeInputInList
            filterSelectedOptions
            value={value}
            onChange={(event, newValue) => {
                setOptions(newValue ? [newValue, ...options] : options);
                setValue(newValue);
            }}
            onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
            }}
            renderInput={(params) => (
                <TextField {...params} label="Search a Spotify Artist" fullWidth />
            )}
            renderOption={(props, option) => {
                const matches = option.structured_formatting.main_text_matched_substrings;
                const parts = parse(
                option.structured_formatting.main_text,
                matches.map((match) => [match.offset, match.offset + match.length]),
                );

                return (
                <li {...props}>
                    <Grid container alignItems="center">
                    <Grid item>
                        <Box
                        component={LocationOnIcon}
                        sx={{ color: 'text.secondary', mr: 2 }}
                        />
                    </Grid>
                    <Grid item xs>
                        {parts.map((part, index) => (
                        <span
                            key={index}
                            style={{
                            fontWeight: part.highlight ? 700 : 400,
                            }}
                        >
                            {part.text}
                        </span>
                        ))}

                        <Typography variant="body2" color="text.secondary">
                        {option.structured_formatting.secondary_text}
                        </Typography>
                    </Grid>
                    </Grid>
                </li>
                );
            }}
        />
    );
}