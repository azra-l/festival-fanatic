import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getSelectedArtistsAsync,
  addSelectedArtistAsync,
  deleteSelectedArtistAsync,
} from "../../redux/festivals/thunks";
import { Fragment } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { FixedSizeList } from "react-window";
import IconButton from "@mui/material/IconButton";
import { FaTrashAlt } from "react-icons/fa";
import { Stack } from "@mui/material";

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

/*
Based off this design for an autocomplete MUI component
https://mui.com/material-ui/react-autocomplete/#search-as-you-type
*/
export default function SearchBar() {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const loading = open && options.length === 0;

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
    dispatch(getSelectedArtistsAsync());
  }, [dispatch, open]);

  const selectedArtists = useSelector(
    (state) => state.festivals.selectedArtists
  );

  function renderRow(props) {
    const { index, style } = props;

    return (
      <ListItem style={style} key={index} component="div" disablePadding>
        <ListItemButton>
          <ListItemText primary={`${selectedArtists[index].name}`} />
          <IconButton
            edge="end"
            aria-label="delete"
            onClick={(e) => handleDeleteSearchResult(e, index)}
          >
            <FaTrashAlt />
          </IconButton>
        </ListItemButton>
      </ListItem>
    );
  }

  function handleDeleteSearchResult(event, index) {
    console.log("The selectedArtists[index]", selectedArtists[index]);
    const id = selectedArtists[index]._id;
    dispatch(deleteSelectedArtistAsync(id));
  }

  async function handleAddSearchResult(value) {
    if (value === null) {
      return undefined;
    }
    dispatch(addSelectedArtistAsync(value));
  }

  async function handleSpotifySearch(value) {
    if (value === "") {
      return undefined;
    }

    const rawSpotifyArtistsResults = await fetch(
      `${apiBaseUrl}/spotify/search-artist?input=${value}`,
      {
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        return data;
      })
      .catch((e) => console.log(e));
    setOptions([...rawSpotifyArtistsResults.artists.items]);
  }

  return (
    <Stack>
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
                <Fragment>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </Fragment>
              ),
            }}
          />
        )}
      />
      <Box
        sx={{
          width: "100%",
          height: 400,
          maxWidth: 360,
          bgcolor: "background.paper",
        }}
      >
        <FixedSizeList
          height={400}
          width={300}
          itemSize={46}
          itemCount={selectedArtists.length}
          overscanCount={5}
        >
          {renderRow}
        </FixedSizeList>
      </Box>
    </Stack>
  );
}
