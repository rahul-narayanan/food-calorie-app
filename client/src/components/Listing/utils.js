import EventEmitter from "eventemitter3";

export const ClientDateFormat = "dddd, MMMM Do YYYY, h:mm:ss a";

export const ServerDateFormat = "YYYY/MM/DD";

export const Headers = [
    {
        id: "name",
        label: "Food name",
        disablePadding: true,
        sx: {
            width: "25%"
        }
    },
    {
        id: "calories",
        numeric: true,
        label: "Calories",
        sx: {
            width: "15%"
        }
    },
    {
        id: "takenAt",
        label: "Taken at",
        sx: {
            width: "25%"
        }
    }
];

export function debounce(func, wait, immediate) {
    let timeout;
    // eslint-disable-next-line func-names
    return function () {
        const context = this; const
            // eslint-disable-next-line prefer-rest-params
            args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            timeout = null;
            if (!immediate) func.apply(context, args);
        }, wait);
        if (immediate && !timeout) func.apply(context, args);
    };
}

export const isScrollThresholdReached = (targetEl, scrollThresholdPercentage) => {
    const scrolledPercentage = (targetEl.scrollTop / (targetEl.scrollHeight - targetEl.clientHeight)) * 100;
    return Math.round(scrolledPercentage) >= scrollThresholdPercentage;
};

export const ListingEventEmitter = new EventEmitter();

export const OPEN_ADD_DIALOG_TO_EDIT_EVENT = "openAddFoodDialogToEdit";
