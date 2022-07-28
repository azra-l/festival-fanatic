import ArtistCard from "../../components/ArtistCard/ArtistCard";
import Navbar from "../../components/Navbar/Navbar";
import { useSelector } from "react-redux";

export default function TopArtists() {
    const spotifyUserTopItems = useSelector(
        (state) => state.spotify.spotifyTopArtists
    );
    return (
        <>
            <Navbar />
            <h2>Your Top Artists</h2>
            {spotifyUserTopItems.items.map((artist) => (
                <ArtistCard artist={artist} key={artist.id} />
            ))}
        </>
    );
}
