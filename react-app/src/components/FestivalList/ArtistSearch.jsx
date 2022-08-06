import { styled } from '@mui/material/styles';
import { TextField } from "@mui/material";
import "./ArtistSearch.css";

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
}));

const helperTextStyles = { style: { color: "white" } }

const inputStyle = {
    style: {
        color: "white",
    }
}

const ArtistSearch = ({ matchedArtists }) => {
    function callSpotifySearch() {
        // TODO make api search call
    };


    return (
        <div class="search-div">
            <DrawerHeader>
                "Artist Search Bar"
                <TextField className="search-text-field" label="Search" variant="standard" onChange={(e) => callSpotifySearch} inputProps={inputStyle} FormHelperTextProps={helperTextStyles} focused>Enter Spotify Artists</TextField>
            </DrawerHeader>
        </div>
    )
}

export default ArtistSearch;