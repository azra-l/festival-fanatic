import React, { } from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { checkAuthAsync } from "../redux/auth/thunks";

// adapted from: https://dev.to/akanstein/protected-routes-with-react-router-and-redux-3e62
//  and https://gist.github.com/mjackson/d54b40a094277b7afdd6b81f51a0393f
const ProtectedRoute = ({ redirectTo, children }) => {


    const dispatch = useDispatch();

    const isAuth = useSelector((store) => store.auth.isAuthenticated);

    const [tryAuth, setTryAuth] = useState(null);

    useEffect(() => {
        (async () => {

            await dispatch(checkAuthAsync())
            setTryAuth(isAuth);

        })();
    });
    // if (tryAuth) return <p>Checking...</p>;
    // else
    if (tryAuth === null) {
        return <h1>Loading...</h1>
    } else
        return isAuth ? <Outlet /> : <Navigate to={redirectTo} />;
};

export default ProtectedRoute;


