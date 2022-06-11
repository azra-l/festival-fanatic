import ArtistCard from "../../components/ArtistCard/ArtistCard";
import Navbar from "../../components/Navbar/Navbar";
import { spotifyUserTopItems } from "../../utilities/spotify-user-top-items";

export default function TopArtists() {
    return (
        <>
            <Navbar />
            <h2>Your Top Artists</h2>
            {spotifyUserTopItems.items.map((artist) =>
                <ArtistCard artist={artist} key={artist.id} />

            )}
        </>
    );
}
