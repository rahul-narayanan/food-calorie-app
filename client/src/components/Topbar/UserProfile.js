import React, { useCallback, useContext, useState } from "react";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Typography from "@mui/material/Typography";
import ShowSnackbarAlert from "../common/SnackBarAlert";

import { UserContext } from "../../userContext";
import { setAuthTokenToLocalStorage } from "../../api";
import { stringAvatar } from "./utils";

export default function UserProfile() {
    const [anchorEl, setAnchorEl] = useState(null);
    const { userData, setUserData } = useContext(UserContext);

    const handleShowOptions = useCallback((event) => {
        setAnchorEl(event.currentTarget);
    }, []);

    const handleClose = useCallback(() => {
        setAnchorEl(null);
    }, []);

    const handleLogout = useCallback(() => {
        setUserData({
            token: undefined,
            user: undefined,
            fetched: true
        });
        setAuthTokenToLocalStorage("");
        handleClose();
        ShowSnackbarAlert({ message: "Logged out successfully" });
    }, []);

    return (
        <div className="userProfileContent">
            <IconButton
                size="large"
                aria-label="User account"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleShowOptions}
                color="inherit"
            >
                <Avatar {...stringAvatar(userData.user?.displayName)} />
                <Typography variant="h6" noWrap component="div" sx={{ ml: 1, fontSize: 18 }}>
                    {userData.user?.displayName || ""}
                </Typography>
            </IconButton>
            <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right"
                }}
                keepMounted
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right"
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
        </div>
    );
}
