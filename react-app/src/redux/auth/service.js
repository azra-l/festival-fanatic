const checkAuth = async () => {
    const response = await fetch(`http://localhost:3001/users/check-auth`, {
        method: "GET",
        // Need credentials to pass cookie data into request
        credentials: "include",
        headers: {
            "Access-Control-Allow-Origin": "http://localhost:3000",
        },
    });

    console.log("The checkAuth response.status", response.status)

    const data = await response.json();
    if (!response.ok) {
        const errorMsg = data?.message;
        throw new Error(errorMsg);
    }

    if (response.status === 200)
        return true
    else return false
};


const authService = {
    checkAuth,
};

export default authService;
