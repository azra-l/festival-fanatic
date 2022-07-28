
const getUpcomingArtistEvents = async () => {
  const response = await fetch(`http://localhost:3001/festivals`, {
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
  return data;
};

const updateFestival = async ({ _id, action }) => {
  let reqBody = {
    festivalId: _id,
    listCategory: action === 'saved' || action === 'unsaved' ? 'saved' : 'archived'
  };

  if (action === "save" || action === "archive") {
    reqBody.action = "add";
  } else {
    reqBody.action = "remove";
  }

  const response = await fetch(`http://localhost:3001/users/userlist`, {
    method: "PATCH",
    body: JSON.stringify(reqBody),
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

  return {_id, userAction: action};
};

const festivalService = {
  getUpcomingArtistEvents,
  updateFestival,
};

export default festivalService;
