import { styled } from '@mui/material/styles';
import { useState } from "react";
import "./ArtistSearch.css";
import SearchBar from './SearchBar';

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
}));

const ArtistSearch = ({ matchedArtists }) => {
    const [selectedArtists, setSelectedArtists] = useState([]);

    return (
        <div className="search-div">
            <DrawerHeader>
                <SearchBar/>
            </DrawerHeader>
        </div>
    )
}

//<TextField className="search-text-field" label="Search" variant="standard" onChange={(e) => callSpotifySearch} inputProps={inputStyle} FormHelperTextProps={helperTextStyles} focused>Enter Spotify Artists</TextField>

export default ArtistSearch;