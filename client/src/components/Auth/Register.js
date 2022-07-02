import React, {
    useState, useContext, useRef, useCallback, useEffect
} from "react";
import { useHistory } from "react-router-dom";
import Typography from "@mui/material/Typography";

import { UserContext } from "../../userContext";
import { loginUser, registerNewUser, setAuthTokenToLocalStorage } from "../../api";
import ShowSnackbarAlert from "../common/SnackBarAlert";
import TextField from "../common/TextField";
import LoadingButton from "../common/LoadingButton";
import * as ValidateUtils from "./utils";

export default function Register() {
    const { setUserData } = useContext(UserContext);
    const history = useHistory();

    const nameRef = useRef(null);
    const emailRef = useRef(null);
    const passRef = useRef(null);
    const confirmPassRef = useRef(null);
    const btnRef = useRef(null);

    const handleEmailBlur = useCallback(() => {
        const email = emailRef.current.value();
        if (email) {
            const name = email.split("@")[0];
            name && nameRef.current.setValue(name.charAt(0).toUpperCase() + name.slice(1));
        }
    }, []);

    const handleSubmit = useCallback(async () => {
        try {
            const displayName = nameRef.current.value();
            const email = emailRef.current.value();
            const password = passRef.current.value();
            const confirmPassword = confirmPassRef.current.value();

            const isNameValid = ValidateUtils.validateName(displayName, nameRef.current);
            const isEmailValid = ValidateUtils.validateEmail(email, emailRef.current);
            const isPassValid = ValidateUtils.validatePassword(password, passRef.current, true);
            const isConfirmPassValid = ValidateUtils.validateConfirmPassword(password, confirmPassword, confirmPassRef.current);

            if (!isNameValid || !isEmailValid || !isPassValid || !isConfirmPassValid) {
                throw new Error();
            }

            await registerNewUser({
                displayName, email, password, confirmPassword
            });

            const { token, user } = await loginUser({ email, password });
            setUserData({ token, user, fetched: true });
            setAuthTokenToLocalStorage(token);
            ShowSnackbarAlert({ message: "Registered successfully" });
        } catch (err) {
            ShowSnackbarAlert({ message: err.response.data.msg, severity: "error" });
        }
    }, []);

    const handleKeyDown = useCallback((event) => {
        if (event.key === "Enter") {
            btnRef.current.click();
        }
    });

    return (
        <div className="container">
            <div className="content register">
                <Typography color="primary" variant="h5" noWrap component="div">
                    Register
                </Typography>
                <form>
                    <TextField label="Email" ref={emailRef} autoFocus onBlur={handleEmailBlur} onKeyDown={handleKeyDown} />
                    <TextField label="Name" ref={nameRef} onKeyDown={handleKeyDown} />
                    <TextField label="Password" ref={passRef} type="password" onKeyDown={handleKeyDown} />
                    <TextField label="Confirm Password" ref={confirmPassRef} type="password" onKeyDown={handleKeyDown} />
                    <Typography
                        color="primary"
                        align="right"
                        sx={{
                            textDecoration: "underline",
                            mt: 5,
                            cursor: "pointer",
                            display: "inline-block",
                            float: "right"
                        }}
                        onClick={() => { history.push("/register"); }}
                    >
                        Already registered?
                    </Typography>
                    <LoadingButton
                        ref={btnRef}
                        label="Register"
                        onClick={handleSubmit}
                        sx={{ mt: 5 }}
                    />
                </form>
            </div>
        </div>
    );
}
