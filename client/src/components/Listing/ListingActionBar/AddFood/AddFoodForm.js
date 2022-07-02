import React, {
    useRef, useCallback, useContext, useMemo
} from "react";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";

import DateTimePicker from "../../../common/DateTimePicker";
import SelectBox from "../../../common/SelectBox";
import TextField from "../../../common/TextField";
import LoadingButton from "../../../common/LoadingButton";
import { GreyCancelButton } from "../styles";
import ListingContext from "../../ListingContext";
import { UserContext } from "../../../../userContext";
import * as AddFoodUtils from "./utils";
import Checkbox from "../../../common/Checkbox";

export default function AddFoodForm(props) {
    const { selectedFood } = props;
    const { userData, isAdminUser } = useContext(UserContext);
    const { usersList, addNewFood, updateFood } = useContext(ListingContext);

    const userSelectRef = useRef(null);
    const nameRef = useRef(null);
    const timeRef = useRef(null);
    const calorieValueRef = useRef(null);
    const cheatMealRef = useRef(null);
    const addBtnRef = useRef(null);

    const isAdmin = useMemo(() => isAdminUser(), [isAdminUser]);

    const validateFoodName = useCallback((event) => {
        if (event) {
            event.stopPropagation();
        }

        const err = AddFoodUtils.ValidateFoodName(nameRef.current.value());
        nameRef.current.setError(err);
        return err === null;
    }, []);

    const validateCalorieValue = useCallback((event) => {
        if (event) {
            event.stopPropagation();
        }

        const err = AddFoodUtils.ValidateCalorieCount(calorieValueRef.current.value());
        calorieValueRef.current.setError(err);
        return err === null;
    }, []);

    const handleActionBtnClick = useCallback(async () => {
        const isNameValid = validateFoodName();
        const isCalorieValueValid = validateCalorieValue();

        if (isNameValid && isCalorieValueValid) {
            const params = {
                name: nameRef.current.value(),
                caloriesCount: Number(calorieValueRef.current.value()),
                takenAt: timeRef.current.getSelectedDate().getTime(),
                isCheatMeal: cheatMealRef.current.isChecked()
            };

            if (userSelectRef.current) {
                params.userId = userSelectRef.current.getSelectedValue();
            }

            if (selectedFood) {
                await updateFood(selectedFood._id, params);
            } else {
                await addNewFood(params);
            }
            props.closeDialog();
        } else {
            throw new Error();
        }
    }, []);

    const handleKeyDown = useCallback((event) => {
        if (event.key === "Enter") {
            addBtnRef.current.click();
        }
    });

    function renderUserSelectBox() {
        if (!isAdmin || !usersList) return "";

        const options = usersList.map((user) => ({
            name: `${user.displayName} (${user.email})`,
            value: user._id
        }));

        const selected = selectedFood
            ? usersList.find((user) => user._id === selectedFood.userId)?._id
            : usersList.find((user) => user._id === userData.user._id)?._id;

        return (
            <SelectBox
                id="addFoodForUser"
                ref={userSelectRef}
                label="Select user"
                options={options}
                selected={selected}
                disabled={!!selectedFood}
            />
        );
    }

    return (
        <>
            <DialogTitle>
                {selectedFood ? "Edit Food Entry" : "Add New Food Entry"}
            </DialogTitle>
            <DialogContent>
                <FormControl fullWidth sx={isAdmin ? { mt: 2 } : {}}>
                    {renderUserSelectBox()}
                    <TextField
                        {...AddFoodUtils.TextFieldDefaultProps}
                        ref={nameRef}
                        autoFocus
                        label="Food name"
                        onBlur={validateFoodName}
                        onKeyDown={handleKeyDown}
                        value={selectedFood?.name || ""}
                    />
                    <TextField
                        {...AddFoodUtils.TextFieldDefaultProps}
                        ref={calorieValueRef}
                        label="Calorie value"
                        onBlur={validateCalorieValue}
                        onKeyDown={handleKeyDown}
                        value={selectedFood?.caloriesCount || ""}
                    />
                    <DateTimePicker
                        ref={timeRef}
                        label="Time when the food was taken"
                        selected={selectedFood ? new Date(selectedFood.takenAt) : null}
                    />
                    <div style={{ marginTop: "10px" }}>
                        <Checkbox
                            ref={cheatMealRef}
                            label="Skip this meal in daily limit calculation"
                            checked={selectedFood?.isCheatMeal || false}
                        />
                    </div>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <GreyCancelButton onClick={props.closeDialog} size="large">Cancel</GreyCancelButton>
                <LoadingButton
                    ref={addBtnRef}
                    label={selectedFood ? "Save" : "Add"}
                    size="large"
                    onClick={handleActionBtnClick}
                    variant="text"
                />
            </DialogActions>
        </>
    );
}
