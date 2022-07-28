import { apiBaseUrl } from '../../utilities/base-url';

const checkAuth = async () => {
    const response = await fetch(`${apiBaseUrl}/users/check-auth`, {
        method: "GET",
        // Need credentials to pass cookie data into request
        credentials: "include"
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
