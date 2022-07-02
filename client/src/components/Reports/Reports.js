import {
    useState, useEffect, useCallback, useContext, useMemo
} from "react";
import CircularProgress from "@mui/material/CircularProgress";

import {
    Chart,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";

import { UserContext } from "../../userContext";
import { fetchReports } from "../../api";
import AdminReports from "./AdminReports";
import UserReports from "./UserReports";

Chart.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);
Chart.defaults.font.size = 16;
Chart.defaults.font.weight = "700";

export default function Reports() {
    const [dataObj, setDataObj] = useState(null);
    const { isAdminUser } = useContext(UserContext);

    const isAdmin = useMemo(() => isAdminUser(), [isAdminUser]);

    const getReports = useCallback(async () => {
        const { data } = await fetchReports();
        setDataObj(data);
    }, []);

    useEffect(() => {
        getReports();
    }, []);

    if (!dataObj) {
        return (
            <div className="circleLoader">
                <CircularProgress />
            </div>
        );
    }

    return (
        <div className="container">
            <div className="content">
                <div className="reportsContainer">
                    <UserReports data={dataObj} showMsg={!isAdmin} />
                    {isAdmin ? <AdminReports data={dataObj} /> : ""}
                </div>
            </div>
        </div>
    );
}
