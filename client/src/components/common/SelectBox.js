import {
    useState, useCallback, forwardRef, useImperativeHandle
} from "react";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

const SelectBox = forwardRef((props, ref) => {
    const [selected, setSelected] = useState(props.selected || "");

    const handleChange = useCallback((event) => {
        setSelected(event.target.value);
    }, []);

    useImperativeHandle(ref, () => ({
        getSelectedValue: () => selected
    }));

    function renderOptions() {
        return (
            props.options.map((option) => {
                if (typeof option === "string") {
                    return (
                        <MenuItem
                            key={`selectOption_${option}`}
                            value={option}
                        >
                            {option}
                        </MenuItem>
                    );
                }

                return (
                    <MenuItem
                        key={`selectOption_${option.value}`}
                        value={option.value}
                    >
                        {option.name}
                    </MenuItem>
                );
            })
        );
    }
    return (
        <FormControl fullWidth disabled={props.disabled || false}>
            <InputLabel id={`${props.id}-select-label`} required>{props.label}</InputLabel>
            <Select
                id={`${props.id}-select`}
                labelId={`${props.id}-select-label`}
                value={selected}
                label={props.label}
                onChange={handleChange}
                variant={props.variant}
                sx={props.sx}
            >
                {renderOptions()}
            </Select>
        </FormControl>
    );
});

export default SelectBox;
