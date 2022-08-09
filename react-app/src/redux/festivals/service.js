import { apiBaseUrl, appBaseUrl } from "../../utilities/base-url";

const getUpcomingArtistEvents = async () => {
  const response = await fetch(`${apiBaseUrl}/festivals`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Access-Control-Allow-Origin": appBaseUrl,
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
    listCategory:
      action === "save" || action === "unsaved" ? "saved" : "archived",
  };

  if (action === "save" || action === "archive") {
    reqBody.action = "add";
  } else {
    reqBody.action = "remove";
  }

  const response = await fetch(`${apiBaseUrl}/users/userlist`, {
    method: "PATCH",
    body: JSON.stringify(reqBody),
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": appBaseUrl,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMsg = data?.message;
    throw new Error(errorMsg);
  }

  return { _id, userAction: action };
};

const getSelectedArtists = async () => {
  const response = await fetch(`${apiBaseUrl}/artists/my-selected-artists`, {
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMsg = data?.message;
    throw new Error(errorMsg);
  }

  return data;
};

const addSelectedArtist = async (value) => {
  const result = await fetch(`${apiBaseUrl}/new-selected-artists`, {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      listOfArtists: [value],
    }),
  });

  const res = await result.json();
  if (!result.ok) {
    const errorMsg = res?.message;
    throw new Error(errorMsg);
  }

  const response = await fetch(`${apiBaseUrl}/artists/my-selected-artists`, {
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMsg = data?.message;
    throw new Error(errorMsg);
  }

  return data;
};

const deleteSelectedArtistAsync = async (id) => {
  const result = await fetch(
    `${apiBaseUrl}/users/remove-selected-artist?artistObjectId=${id}`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );
  const res = await result.json();
  if (!result.ok) {
    const errorMsg = res?.message;
    throw new Error(errorMsg);
  }

  const response = await fetch(`${apiBaseUrl}/artists/my-selected-artists`, {
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
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
  getSelectedArtists,
  addSelectedArtist,
  deleteSelectedArtistAsync,
};

export default festivalService;
