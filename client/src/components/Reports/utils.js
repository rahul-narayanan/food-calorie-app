import moment from "moment";
import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export const dateFormat = "MMMM Do";

export const getDate = (date) => moment(date).format(dateFormat);

export const chartOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: "top"
        }
    }
};

export const getAverageReportData = (dataArr) => {
    const date = new Date();
    date.setDate(date.getDate() - 6);

    const data = [];
    const labels = [];
    dataArr.forEach((val, index) => {
        const label = getDate(date);
        labels.push(label);
        data.push(val);
        date.setDate(date.getDate() + 1);
    });

    const dataset = {
        label: "No. of calories",
        data,
        backgroundColor: "rgb(160, 99, 255)",
        borderWidth: 2,
        barPercentage: 0.5
    };

    return { labels, dataset };
};

export function AverageReportTable({ totalCalories, totalUsersCount }) {
    return (
        <Paper elevation={8} sx={{ margin: "0 auto", mt: 7, width: "60%" }}>
            <TableContainer>
                <Table size="small" aria-label="a dense table">
                    <TableBody>
                        <TableRow key="totalCalories">
                            <TableCell component="th" scope="row">
                                Total Calories added in last 7 days
                            </TableCell>
                            <TableCell align="right">
                                {totalCalories}
                            </TableCell>
                        </TableRow>
                        <TableRow key="totalUsers">
                            <TableCell component="th" scope="row">
                                Total users
                            </TableCell>
                            <TableCell align="right">
                                {totalUsersCount}
                            </TableCell>
                        </TableRow>
                        <TableRow key="average">
                            <TableCell component="th" scope="row">
                                <b>Average calories per user</b>
                            </TableCell>
                            <TableCell align="right">
                                <b>
                                    {(totalCalories / totalUsersCount).toFixed(1)}
                                </b>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}

export const getLimitExceededData = (dataArr) => {
    const data = [];
    const labels = [];
    dataArr.forEach(({ date, totalCalories }, index) => {
        const label = getDate(+date);
        labels.push(label);
        data.push(totalCalories);
    });

    const dataset = {
        label: "Consumed Calories",
        data,
        backgroundColor: "rgb(98, 192, 192)",
        borderWidth: 2,
        barPercentage: 0.2
    };

    return { labels, dataset };
};
