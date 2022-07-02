import React, {
    useState, useCallback, forwardRef
} from "react";
import MUILoadingButton from "@mui/lab/LoadingButton";

const LoadingButton = forwardRef((props, ref) => {
    const [loading, setLoading] = useState(false);

    const handleClick = useCallback(async () => {
        try {
            setLoading(true);
            await props.onClick();
            setLoading(false);
        } catch (err) {
            setLoading(false);
        }
    }, []);

    return (
        <MUILoadingButton
            ref={ref}
            size={props.size || "small"}
            loading={loading}
            variant="contained"
            {...props}
            onClick={handleClick}
        >
            {props.label}
        </MUILoadingButton>
    );
});

export default LoadingButton;
