import Logo from "./logo.png";

import React, { useContext } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { NavLink } from "react-router-dom";

import { UserContext } from "../../userContext";
import UserProfile from "./UserProfile";

export default function Topbar() {
    const { userData } = useContext(UserContext);

    return (
        <Box>
            <AppBar position="static">
                <Toolbar>
                    <img src={Logo} alt="logo" className="logo" />
                    <Typography variant="h6" noWrap component="div">
                        Calorie App
                    </Typography>
                    {userData.user ? (
                        <>
                            <NavLink
                                className="headerLink"
                                activeClassName="selected"
                                to="/home"
                            >
                                Home
                            </NavLink>
                            <NavLink
                                to="/reports"
                                className="headerLink"
                                activeClassName="selected"
                            >
                                Reports
                            </NavLink>
                            <UserProfile />
                        </>
                    ) : ""}
                </Toolbar>
            </AppBar>
        </Box>
    );
}
