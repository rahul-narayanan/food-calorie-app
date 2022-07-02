import React, {
    useState, useEffect, useCallback, useMemo, useRef, useLayoutEffect, useContext
} from "react";
import moment from "moment";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import Skeleton from "@mui/material/Skeleton";
import Tooltip from "@mui/material/Tooltip";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import LocalDiningIcon from "@mui/icons-material/LocalDining";

import ListingTableToolbar from "./ListingTableToolbar";
import ListingTableHead from "./ListingTableHead";
import ListingActionBar from "./ListingActionBar/ListingActionBar";
import * as api from "../../api";
import ListingContext from "./ListingContext";
import * as ListingUtils from "./utils";
import { UserContext } from "../../userContext";
import ShowConfirmDialog from "../common/ConfirmDialog";
import ShowSnackbarAlert from "../common/SnackBarAlert";

let filterFromDate = null;
let filterToDate = null;

let usersCache = null;
const foodsCache = [];
let isFetching = false;

export default function ListingTable() {
    const [usersList, setUsersList] = useState(usersCache);
    const [foods, setFoods] = useState(foodsCache || []);
    const [totalCount, setTotalCount] = useState(0);
    const [selected, setSelected] = useState([]);
    const [loading, setLoading] = useState(false);

    const { isAdminUser } = useContext(UserContext);
    const tableContainerRef = useRef(null);
    const loadingRowRef = useRef(null);

    const isAdmin = useMemo(() => isAdminUser(), [isAdminUser]);

    const getUserNameFromId = useCallback((id) => usersList?.find((user) => user._id === id)?.displayName || "", [usersList]);

    const fetchUsers = useCallback(async () => {
        if (!isAdmin || usersCache) return;

        const { users } = await api.fetchAllUsers();
        usersCache = users;
        setUsersList(users);
    }, []);

    const fetchFoods = useCallback(async (index = foods.length) => {
        setLoading(true);
        isFetching = true;
        const params = { index };
        if (filterFromDate && filterToDate) {
            params.fromDate = filterFromDate;
            params.toDate = filterToDate;
        }

        const { data } = await api.fetchFoods(params);
        const { foods: foodsList, totalCount: foodsTotalCount } = data;
        setFoods((oldFoods) => [...oldFoods, ...foodsList]);
        setTotalCount(foodsTotalCount);
        setLoading(false);
        setTimeout(() => {
            isFetching = false;
        }, 300);
    }, [foods, totalCount]);

    const fetchUsersAndFoods = useCallback(async () => {
        setLoading(true);
        await fetchUsers();
        await fetchFoods();
    }, []);

    const addNewFood = useCallback(async (food) => {
        const { data } = await api.addFood(food);
        filterFromDate = null;
        filterToDate = null;
        setFoods((oldFoods) => [data, ...oldFoods]);
        setTotalCount((oldCount) => oldCount + 1);
        ShowSnackbarAlert({ message: "Added successfully", duration: 2000 });
    }, []);

    const updateFood = useCallback(async (id, food) => {
        const { data } = await api.updateFood(id, food);
        const newFoods = [...foods];
        for (let i = 0; i < newFoods.length; i++) {
            if (newFoods[i]._id === id) {
                newFoods[i] = {
                    _id: id,
                    ...data
                };
                break;
            }
        }
        setFoods(newFoods);
        ShowSnackbarAlert({ message: "Updated successfully", duration: 2000 });
    }, [foods]);

    const updateTotalCount = useCallback((count) => setTotalCount(count), []);

    const isSelected = useCallback((id) => selected.indexOf(id) !== -1, [selected]);

    const handleUpdateFilter = useCallback(async (fromDate, toDate) => {
        filterFromDate = fromDate;
        filterToDate = toDate;
        setFoods([]);
        await fetchFoods(0);
        if (fromDate && toDate) {
            ShowSnackbarAlert({ message: "Filter applied successfully", duration: 2000 });
        }
    }, []);

    const handleScroll = useCallback(ListingUtils.debounce(() => {
        const isScrollThresholdReached = ListingUtils.isScrollThresholdReached(tableContainerRef.current, 80);
        if (isScrollThresholdReached) {
            if (foods.length < totalCount && !isFetching) {
                setLoading(true);
                setTimeout(() => {
                    fetchFoods();
                }, 0);
            }
        }
    }, 100), [foods, totalCount]);

    const handleSelectAllClick = useCallback((event) => {
        if (event.target.checked) {
            const newSelecteds = foods.map((food) => food._id);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    }, [foods]);

    const handleRowClick = useCallback((id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );
        }

        setSelected(newSelected);
    }, [selected]);

    const confirmAndDelete = useCallback((props, ids) => {
        ShowConfirmDialog({
            ...props,
            actionBtnName: "Delete",
            onConfirm: async () => {
                await api.deleteFoods(ids);
                ShowSnackbarAlert({ message: "Deleted successfully", duration: 2000 });
                setFoods([]);
                setSelected([]);
                setLoading(true);
                fetchFoods(0);
            }
        });
    }, []);

    const handleDeleteSelected = useCallback(() => {
        confirmAndDelete({
            title: "Delete foods",
            description: `Are you sure you want to delete these ${selected.length} entries?`
        }, selected);
    }, [selected]);

    const handleDeleteRow = useCallback((event, id) => {
        event.stopPropagation();
        confirmAndDelete({
            title: "Delete food",
            description: "Are you sure you want to delete this entry?"
        }, [id]);
    }, []);

    const handleEditRow = useCallback((event, row) => {
        event.stopPropagation();
        ListingUtils.ListingEventEmitter.emit(ListingUtils.OPEN_ADD_DIALOG_TO_EDIT_EVENT, row);
    }, []);

    function renderLoading() {
        if (!loading) {
            return "";
        }

        return [
            ...Array.from(Array(4).keys()).map((id) => (
                <TableRow key={`loading_${id}`} hover>
                    {Array.from(Array(7).keys()).map((cid) => <TableCell key={`loading_${id}_${cid}`}><Skeleton variant="text" /></TableCell>)}
                </TableRow>
            )),
            <TableRow key="loading_5" ref={loadingRowRef} hover>
                {Array.from(Array(7).keys()).map((cid) => <TableCell key={`loading_5_${cid}`}><Skeleton variant="text" /></TableCell>)}
            </TableRow>
        ];
    }

    function renderRows() {
        return foods.map((row, index) => {
            const isItemSelected = isSelected(row._id);
            const labelId = `food-table-checkbox-${index}`;

            return (
                <TableRow
                    // eslint-disable-next-line react/no-array-index-key
                    key={`food_${index}_${row._id}`}
                    hover
                    tabIndex={-1}
                    role="checkbox"
                    onClick={() => handleRowClick(row._id)}
                    selected={isItemSelected}
                    aria-checked={isItemSelected}
                    sx={row.isCheatMeal ? { backgroundColor: "rgba(210, 35, 35, 0.03)" } : {}}
                >
                    <TableCell padding="checkbox">
                        <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            inputProps={{
                                "aria-labelledby": labelId
                            }}
                        />
                    </TableCell>
                    {isAdmin ? (
                        <TableCell>
                            {getUserNameFromId(row.userId)}
                        </TableCell>
                    ) : "" }
                    <TableCell
                        id={labelId}
                        component="th"
                        scope="row"
                        padding={isAdmin ? "none" : "normal"}
                    >
                        {row.name}
                    </TableCell>
                    <TableCell>{row.caloriesCount}</TableCell>
                    <TableCell>{moment(row.takenAt).format(ListingUtils.ClientDateFormat)}</TableCell>
                    <TableCell>
                        {row.isCheatMeal
                            ? (
                                <Tooltip title="This meal will not be included in daily limit calculation">
                                    <span className="cheatMeal">
                                        <LocalDiningIcon color="error" sx={{ fontSize: 18 }} />
                                        Cheat Meal
                                    </span>
                                </Tooltip>
                            ) : ""}
                    </TableCell>
                    <TableCell>
                        <Tooltip title="Edit">
                            <EditRoundedIcon
                                color="success"
                                className="actionIcon"
                                fontSize="small"
                                sx={{ cursor: "pointer", mr: 3 }}
                                onClick={(event) => handleEditRow(event, row)}
                            />
                        </Tooltip>
                        <Tooltip title="Delete">
                            <DeleteIcon
                                color="error"
                                className="actionIcon"
                                fontSize="small"
                                sx={{ cursor: "pointer" }}
                                onClick={(event) => handleDeleteRow(event, row._id)}
                            />
                        </Tooltip>
                    </TableCell>
                </TableRow>
            );
        });
    }

    function renderNoResult() {
        if (!loading && !foods.length) {
            return (
                <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ opacity: 0.5 }}>
                        No foods found
                    </TableCell>
                </TableRow>
            );
        }

        return "";
    }

    useLayoutEffect(() => {
        tableContainerRef.current.addEventListener("scroll", handleScroll);

        return () => {
            tableContainerRef.current.removeEventListener("scroll", handleScroll);
        };
    }, [foods, totalCount]);

    useEffect(() => {
        loadingRowRef.current && loadingRowRef.current.scrollIntoView();
    }, [loading]);

    useEffect(() => {
        fetchUsersAndFoods();
    }, []);

    const contextValues = useMemo(() => ({
        currentCount: foods.length,
        totalCount,
        updateTotalCount,
        handleUpdateFilter,
        addNewFood,
        updateFood,
        usersList
    }), [foods, totalCount, usersList]);

    return (
        <div className="container">
            <div className="content">
                <ListingContext.Provider value={contextValues}>
                    <ListingTableToolbar numSelected={selected.length} onDelete={handleDeleteSelected} />
                    <ListingActionBar />
                    <TableContainer ref={tableContainerRef} sx={{ maxHeight: "70vh" }}>
                        <Table
                            stickyHeader
                            aria-labelledby="listingTableTitle"
                            size="medium"
                        >
                            <ListingTableHead
                                isAdmin={isAdmin}
                                numSelected={selected.length}
                                onSelectAllClick={handleSelectAllClick}
                                rowCount={foods.length}
                            />
                            <TableBody>
                                {renderRows()}
                                {renderLoading()}
                                {renderNoResult()}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </ListingContext.Provider>
            </div>
        </div>
    );
}
