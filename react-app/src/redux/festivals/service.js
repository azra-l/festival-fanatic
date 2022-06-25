import { fest } from "./sampleResults";

const getUpcomingArtistEvents = async (artistName) => {
  const response = await fetch(`http://localhost:3001/bandsintown/all-events`, {
    // TODO: Investigate best way to store JWT token for security
    // https://stackoverflow.com/questions/27067251/where-to-store-jwt-in-browser-how-to-protect-against-csrf?rq=1
    method: "GET",
    // Need credentials to pass cookie data into request
    credentials: "include",
    headers: {
      "Access-Control-Allow-Origin": "http://localhost:3000",
    },
  });

  const data = await response.json();
  if (!response.ok) {
    const errorMsg = data?.message;
    throw new Error(errorMsg);
  }
 
  const res = data.eventsList;
  const parsedResults = [];

  res.forEach((result) => {
    const {lineup} = result;
    const artists = [];
    lineup.forEach((player) => {
      const artist = {
        name: player.name,
        external_urls: `https://open.spotify.com/artist/${player.spotify_id}`,
        id: player.spotify_id,
      }
      artists.push(artist);
    });
    
    const festival = {
      id: result.id,
      date: result.datetime,
      name: result.name,
      city: result.venue.city,
      state: result.venue.region,
      saved: false,
      artists,
      link: result.url,
    };
    parsedResults.push(festival);
  });
  
  return parsedResults
};

const festivalService = {
  getUpcomingArtistEvents,
};

export default festivalService;
