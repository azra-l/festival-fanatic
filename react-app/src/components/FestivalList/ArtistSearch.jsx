import { styled } from '@mui/material/styles';
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
    return (
        <div className="search-div">
            <DrawerHeader>
                <SearchBar/>
            </DrawerHeader>
        </div>
    )
}

export default ArtistSearch;