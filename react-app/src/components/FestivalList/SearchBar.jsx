import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import throttle from 'lodash/throttle';


const options = [
    { title: 'Skrillex' },
    { title: 'Excision' }
]

export default function SearchBar() {
    const [value, setValue] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [options, setOptions] = useState([]);

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
            <TextField {...params} label="Search Spotify for Artists" fullWidth />
        )}
        />
    );
}