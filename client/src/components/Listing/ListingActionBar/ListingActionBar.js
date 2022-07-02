import "rsuite/dist/rsuite.min.css";

import { React, useContext, useCallback } from "react";
import Toolbar from "@mui/material/Toolbar";
import moment from "moment";

import { FilterByDateContainer, CountContainer } from "./styles";
import AddDialog from "./AddFood/AddFood";
import DateRangePicker from "rsuite/DateRangePicker";
import ListingContext from "../ListingContext";
import { ServerDateFormat } from "../utils";

export default function ListingActionBar() {
    const context = useContext(ListingContext);

    const handleFilter = useCallback(([fromDate, toDate]) => {
        context.handleUpdateFilter(
            moment(fromDate).format(ServerDateFormat),
            moment(toDate).format(ServerDateFormat)
        );
    }, []);

    const handleClearFilter = useCallback(() => {
        context.handleUpdateFilter(null, null);
    }, []);

    function renderFilter() {
        return (
            <FilterByDateContainer>
                <DateRangePicker
                    appearance="subtle"
                    placeholder={(
                        <span style={{ display: "flex", paddingLeft: "10px" }}>
                            Filter by date
                        </span>
                    )}
                    size="md"
                    disabledDate={DateRangePicker.afterToday()}
                    format="MM/dd/yyyy"
                    character=" to "
                    showOneCalendar
                    style={{ width: 270 }}
                    placement="bottomStart"
                    onOk={handleFilter}
                    onClean={handleClearFilter}
                />
            </FilterByDateContainer>
        );
    }

    function renderCount() {
        if (context.totalCount) {
            return (
                <CountContainer>
                    <p>Showing</p>
                    {context.currentCount}
                    <p>of</p>
                    {context.totalCount}
                </CountContainer>
            );
        }

        return "";
    }

    return (
        <Toolbar>
            <AddDialog />
            {renderFilter()}
            {renderCount()}
        </Toolbar>
    );
}
