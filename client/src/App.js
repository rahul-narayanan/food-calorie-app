import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Container, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";

import Topbar from "./components/Topbar/Topbar";
import { getCurrentUserData } from "./api";
import { UserContextProvider } from "./userContext";
import Home from "./Home";

const AppTheme = createTheme({
    typography: {
        fontFamily: "\"Lato\"",
        fontSize: 16,
        fontWeightLight: 300,
        fontWeightRegular: 400,
        fontWeightMedium: 600
    }
});

export default function App() {
    const [userData, setUserData] = useState({
        token: undefined,
        user: undefined,
        fetched: false
    });

    const checkIfUserLoggedIn = useCallback(async () => {
        const currentUserData = await getCurrentUserData();
        setUserData({
            ...(currentUserData || userData),
            fetched: true
        });
    }, []);

    const isAdminUser = useCallback(() => userData?.user?.isAdmin || false, [userData]);

    useEffect(() => {
        checkIfUserLoggedIn();
    }, []);

    return (
        <Router>
            <UserContextProvider value={{ userData, setUserData, isAdminUser }}>
                <ThemeProvider theme={AppTheme}>
                    <Container maxWidth={false} className="mainContainer">
                        <Topbar />
                        <Home />
                    </Container>
                </ThemeProvider>
            </UserContextProvider>
        </Router>
    );
}
