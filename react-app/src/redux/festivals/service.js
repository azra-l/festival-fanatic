
const getUpcomingArtistEvents = async (artistName) => {

    const response = await fetch(`http://localhost:3001/bandsintown/all-events`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });

    const data = await response.json();
    if (!response.ok) {
        const errorMsg = data?.message;
        throw new Error(errorMsg)
    }

    return data;
};



const festivalService = {
    getUpcomingArtistEvents
}

export default festivalService;