import React, { useContext } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

import { UserContext } from "./userContext";
import Register from "./components/Auth/Register";
import Login from "./components/Auth/Login";
import Listing from "./components/Listing/Listing";
import Reports from "./components/Reports/Reports";

export default function Home() {
    const { userData } = useContext(UserContext);

    if (!userData.fetched) {
        return (
            <div className="circleLoader">
                <CircularProgress />
            </div>
        );
    }

    return (
        <Switch>
            <Route path="/register">
                {userData.user ? <Redirect to="/home" /> : <Register />}
            </Route>
            <Route path="/login">
                {userData.user ? <Redirect to="/home" /> : <Login />}
            </Route>
            <Route path="/home">
                {userData.user ? <Listing /> : <Redirect to="/login" />}
            </Route>
            <Route path="/reports">
                {userData.user ? <Reports /> : <Redirect to="/login" />}
            </Route>
            <Route path="/">
                <Redirect to={userData.user ? "/home" : "/login"} />
            </Route>
        </Switch>
    );
}
