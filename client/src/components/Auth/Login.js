import React, {
    useState, useContext, useRef, useCallback
} from "react";
import { useHistory } from "react-router-dom";
import Typography from "@mui/material/Typography";

import { UserContext } from "../../userContext";
import { loginUser, setAuthTokenToLocalStorage } from "../../api";
import TextField from "../common/TextField";
import LoadingButton from "../common/LoadingButton";
import ShowSnackbarAlert from "../common/SnackBarAlert";
import * as ValidateUtils from "./utils";

export default function Login() {
    const { setUserData } = useContext(UserContext);
    const history = useHistory();

    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const btnRef = useRef(null);

    const validate = useCallback((email, password) => {
        emailRef.current.setError(email ? null : "Please enter the email address");
        passwordRef.current.setError(password ? null : "Please enter the password");
        return email && password;
    }, []);

    const handleSubmit = async () => {
        try {
            const email = emailRef.current.value();
            const password = passwordRef.current.value();

            const isEmailValid = ValidateUtils.validateEmail(email, emailRef.current);
            const isPasswordValid = ValidateUtils.validatePassword(password, passwordRef.current);

            if (!isEmailValid || !isPasswordValid) {
                throw new Error();
            }

            const { token, user } = await loginUser({ email, password });
            setUserData({ token, user, fetched: true });
            setAuthTokenToLocalStorage(token);
            ShowSnackbarAlert({ message: "Logged in successfully" });
        } catch (err) {
            ShowSnackbarAlert({ message: err.response.data.msg, severity: "error" });
        }
    };

    const handleKeyDown = useCallback((event) => {
        if (event.key === "Enter") {
            btnRef.current.click();
        }
    });

    return (
        <div className="container">
            <div className="content login">
                <Typography color="primary" variant="h5" noWrap component="div">
                    Login
                </Typography>
                <form>
                    <TextField label="Email" ref={emailRef} autoFocus onKeyDown={handleKeyDown} />
                    <TextField label="Password" ref={passwordRef} type="password" onKeyDown={handleKeyDown} />
                    <Typography
                        color="primary"
                        align="right"
                        sx={{
                            textDecoration: "underline",
                            mt: 3,
                            cursor: "pointer",
                            display: "inline-block",
                            float: "right"
                        }}
                        onClick={() => { history.push("/register"); }}
                    >
                        Register
                    </Typography>
                    <LoadingButton
                        ref={btnRef}
                        label="Login"
                        onClick={handleSubmit}
                        sx={{ mt: 3, width: 120 }}
                    />
                </form>
            </div>
        </div>
    );
}
