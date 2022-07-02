import React, {
    useCallback, useState, useEffect
} from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import AddIcon from "@mui/icons-material/Add";

import { SlideTransition } from "../../../common/SlideTransition";
import AddFoodForm from "./AddFoodForm";
import { ListingEventEmitter, OPEN_ADD_DIALOG_TO_EDIT_EVENT } from "../../utils";

export default function AddDialog() {
    const [open, setOpen] = useState(false);
    const [selectedFood, setSelectedFood] = useState(null);

    const handleOpenDialog = useCallback(() => {
        setOpen(true);
    }, []);

    const handleCloseDialog = useCallback(() => {
        setSelectedFood(null);
        setOpen(false);
    }, []);

    const handleEditFood = useCallback((food) => {
        setSelectedFood(food);
        setOpen(true);
    }, []);

    useEffect(() => {
        ListingEventEmitter.on(OPEN_ADD_DIALOG_TO_EDIT_EVENT, handleEditFood);

        return () => {
            ListingEventEmitter.off(OPEN_ADD_DIALOG_TO_EDIT_EVENT, handleEditFood);
        };
    }, []);

    return (
        <>
            <Button variant="text" onClick={handleOpenDialog} startIcon={<AddIcon />}>
                Add new
            </Button>
            <Dialog
                open={open}
                fullWidth
                TransitionComponent={SlideTransition}
                TransitionProps={{
                    direction: "down"
                }}
            >
                <AddFoodForm
                    selectedFood={selectedFood}
                    closeDialog={handleCloseDialog}
                />
            </Dialog>
        </>
    );
}
