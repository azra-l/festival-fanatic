import { fest } from './sampleResults';

const mockBackend = process.env.REACT_APP_MOCK_BACKEND === 'true';

const getUpcomingArtistEvents = async (id) => {
  if (mockBackend) return mockGetUpcomingArtistEvents(id);
  // TODO: replace this hardcoded ID once we figure out how to get this on the frontend
  const response = await fetch(`http://localhost:3001/users/self`, {
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

  const festivals = data.festivals;
  return festivals;
};

const mockGetUpcomingArtistEvents = async (id) => {
  const res = fest[0].eventsList;
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
      name: result.venue.name,
      city: result.venue.city,
      region: result.venue.region,
      saved: false,
      archived: false,
      artists,
      link: result.url,
    };
    parsedResults.push(festival);
  });
  
  return parsedResults
};

const mockUpdateFestival = async ({user, festival}) => {
  const festivals = await getUpcomingArtistEvents('');
  let indexOfFestival = -1;
  for (let i = 0; i < festivals.length; i++) {
    if (festivals[i].id === festival.id) {
      indexOfFestival = i;
    }
  }

  if (indexOfFestival !== -1) {
    festivals[indexOfFestival] = festival;
  }
  return {festivals};
};

const updateFestival = async ({ user, festival }) => {
  if (mockBackend) return mockUpdateFestival({ user, festival });
  const response = await fetch(`http://localhost:3001/users/self`, {
    method: "PATCH",
    body: JSON.stringify(festival),
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "http://localhost:3000",
    },

  });

  const data = await response.json();

  if (!response.ok) {
    const errorMsg = data?.message;
    throw new Error(errorMsg);
  }

  return data;  
};

const festivalService = {
  getUpcomingArtistEvents,
  updateFestival,
};

export default festivalService;
