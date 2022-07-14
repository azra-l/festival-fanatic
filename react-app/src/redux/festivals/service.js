import { fest } from "./sampleResults";

const getUpcomingArtistEvents = async (artistName) => {
  // TODO: replace this hardcoded ID once we figure out how to get this on the frontend
  const response = await fetch(
    `http://localhost:3001/users/531629552196d9cfd8b3cbdd85a1807b`,
    {
      // TODO: Investigate best way to store JWT token for security
      // https://stackoverflow.com/questions/27067251/where-to-store-jwt-in-browser-how-to-protect-against-csrf?rq=1
      method: "GET",
      // Need credentials to pass cookie data into request
      credentials: "include",
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:3000",
      },
    }
  );

  const data = await response.json();
  if (!response.ok) {
    const errorMsg = data?.message;
    throw new Error(errorMsg);
  }

  const festivals = data.festivals;
  return festivals;
};

const festivalService = {
  getUpcomingArtistEvents,
};

export default festivalService;
