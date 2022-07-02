import {
    forwardRef, useCallback, useImperativeHandle, useState
} from "react";
import MUITextField from "@mui/material/TextField";

const TextField = forwardRef((props, ref) => {
    const [value, setValue] = useState(props.value || "");
    const [errorMsg, setErrorMsg] = useState(null);

    const handleBlur = useCallback(() => {
        setErrorMsg(null);
        props.onBlur && props.onBlur();
    }, []);

    const handleChange = useCallback((event) => {
        setValue(event.target.value);
    }, [value]);

    useImperativeHandle(ref, () => ({
        value: () => String(value).trim(),
        setError: (msg) => setErrorMsg(msg),
        setValue: (val) => setValue(val)
    }));

    return (
        <MUITextField
            {...props}
            ref={ref}
            value={value}
            onChange={handleChange}
            error={errorMsg !== null}
            helperText={errorMsg || ""}
            onBlur={handleBlur}
        />
    );
});

TextField.defaultProps = {
    margin: "normal",
    variant: "standard",
    fullWidth: true,
    required: true
};

export default TextField;
