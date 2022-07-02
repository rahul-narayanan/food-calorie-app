import React from "react";
import { Bar } from "react-chartjs-2";
import { Typography } from "@mui/material";
import { AverageReportTable, chartOptions, getAverageReportData } from "./utils";

export default function AdminReports({ data }) {
    const { caloriesAddedForLast7Days, totalUsersCount } = data;
    const { labels, dataset } = getAverageReportData(caloriesAddedForLast7Days);
    const totalCalories = caloriesAddedForLast7Days.reduce((val, acc) => acc + val, 0);
    const average = (totalCalories / totalUsersCount).toFixed(1);

    return (
        <>
            <Typography variant="subtitle2" align="center" gutterBottom sx={{ color: "rgba(255, 99, 132)", mt: 2, mb: 2 }}>
                System Reports
            </Typography>
            <div className="adminReportsContainer">
                <div className="entriesReport">
                    <Typography variant="subtitle1" align="center" gutterBottom sx={{ color: "rgba(255, 99, 132)" }}>
                        Number of entries added in last 7 days vs Entries added the week before that
                    </Typography>
                    <Bar
                        options={chartOptions}
                        data={{
                            labels: ["Last 7 days", "A week before 7 days"],
                            datasets: [
                                {
                                    label: ["No. of entries"],
                                    data: [data.last7DaysCount, data.aWeekBefore7DaysCount],
                                    borderColor: "rgb(255, 99, 132)",
                                    backgroundColor: "rgba(255, 99, 132)",
                                    barPercentage: 0.2
                                }
                            ]
                        }}
                    />
                </div>
                <div className="averageReport">
                    <Typography variant="subtitle1" align="center" gutterBottom sx={{ color: "rgba(160, 99, 255)" }}>
                        Number of calories added by users for the last 7 days
                    </Typography>
                    <Bar
                        options={chartOptions}
                        data={{
                            labels,
                            datasets: [
                                {
                                    type: "line",
                                    label: "Average",
                                    data: Array(7).fill(average),
                                    borderColor: "rgb(0, 0, 0)",
                                    borderWidth: 2
                                },
                                dataset
                            ]
                        }}
                    />
                    <AverageReportTable
                        totalCalories={totalCalories}
                        totalUsersCount={totalUsersCount}
                    />
                </div>
            </div>
        </>
    );
}
