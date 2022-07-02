import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Checkbox from "@mui/material/Checkbox";
import { Headers } from "./utils";

export default function ListingTableHead(props) {
    const {
        onSelectAllClick, numSelected, rowCount
    } = props;

    function renderCheckBox() {
        return (
            <TableCell padding="checkbox">
                <Checkbox
                    color="primary"
                    indeterminate={numSelected > 0 && numSelected < rowCount}
                    checked={rowCount > 0 && numSelected === rowCount}
                    onChange={onSelectAllClick}
                />
            </TableCell>
        );
    }

    function renderUserName() {
        if (!props.isAdmin) return "";

        return (
            <TableCell
                key="userName"
                padding="normal"
                sx={{ width: "23%" }}
            >
                Username
            </TableCell>
        );
    }

    return (
        <TableHead>
            <TableRow>
                {renderCheckBox()}
                {renderUserName()}
                <TableCell
                    key="name"
                    align="left"
                    padding="normal"
                    sx={{ width: props.isAdmin ? "25%" : "30%" }}
                >
                    Food name
                </TableCell>
                <TableCell
                    key="calories"
                    align="left"
                    padding="normal"
                    sx={{ width: props.isAdmin ? "10%" : "20%" }}
                >
                    Calories
                </TableCell>
                <TableCell
                    key="takenAt"
                    align="left"
                    padding="normal"
                    sx={{ width: props.isAdmin ? "22%" : "32%" }}
                >
                    Taken at
                </TableCell>
                <TableCell sx={{ width: "10%" }} />
                <TableCell sx={{ width: "10%" }} />
            </TableRow>
        </TableHead>
    );
}
