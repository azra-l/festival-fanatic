const getUpcomingArtistEvents = async (id) => {
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

const updateFestival = async ({ user, festival }) => {
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
