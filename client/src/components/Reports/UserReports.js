import React from "react";
import { Bar } from "react-chartjs-2";
import { Typography } from "@mui/material";
import { chartOptions, getLimitExceededData } from "./utils";

export default function UserReports({ data, showMsg = true }) {
    if (!data.limitExceededData.length) {
        if (showMsg) {
            return (
                <div className="userReport noData">
                    <Typography variant="h5" align="center" gutterBottom color="primary">
                        You did not exceed your daily calorie limit yet.
                    </Typography>
                </div>
            );
        }

        return "";
    }

    const { labels, dataset } = getLimitExceededData(data.limitExceededData);

    return (
        <div className="userReportsContainer">
            <div className="userReport">
                <Typography variant="subtitle2" align="center" gutterBottom sx={{ color: "rgba(98, 192, 192)" }}>
                    {`Your daily calorie limit (${data.dailyCalorieLimit}) exceeded days`}
                </Typography>
                <Bar
                    options={chartOptions}
                    data={{
                        labels,
                        datasets: [
                            {
                                type: "line",
                                label: "Daily limit",
                                data: Array(data.limitExceededData.length).fill(data.dailyCalorieLimit),
                                borderColor: "rgb(0, 0, 0)",
                                borderWidth: 2
                            },
                            dataset
                        ],
                        barPercentage: 0.5
                    }}
                />
            </div>
        </div>
    );
}
