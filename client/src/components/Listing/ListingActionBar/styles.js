import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import Button from "@mui/material/Button";

export const GreyCancelButton = styled(Button)(() => ({
    color: "#535456"
}));

export const FilterByDateContainer = styled("div")(() => ({
    marginLeft: 20,
    borderBottom: "1px solid rgba(223, 211, 211, .5)"
}));

export const CountContainer = styled("div")(() => ({
    position: "absolute",
    right: 10,
    p: {
        display: "inline-block",
        color: "grey",
        marginLeft: 5,
        marginRight: 5
    }
}));
