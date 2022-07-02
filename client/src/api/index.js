import axios from "axios";

const url = "http://localhost:8000/api";
const limit = 25;

const getAuthTokenFromLocalStorage = () => localStorage.getItem("auth-token");

export const setTokenInHeader = () => {
    axios.defaults.headers.common["x-auth-token"] = getAuthTokenFromLocalStorage();
};

export const setAuthTokenToLocalStorage = (authToken) => {
    localStorage.setItem("auth-token", authToken);
    setTokenInHeader();
};

export const getCurrentUserData = async () => {
    let token = getAuthTokenFromLocalStorage();

    if (!token) {
        setAuthTokenToLocalStorage("");
        token = "";
    }

    const tokenResponse = await axios.post(
        `${url}/user/isValidToken`,
        null,
        { headers: { "x-auth-token": token } }
    );

    if (tokenResponse.data) {
        const userRes = await axios.get(`${url}/user/`, {
            headers: { "x-auth-token": token }
        });

        return {
            token,
            user: userRes.data
        };
    }

    return null;
};

export const fetchAllUsers = async () => {
    const { data } = await axios.get(`${url}/users`);
    return data;
};

export const registerNewUser = async (user) => {
    await axios.post(`${url}/user/register`, user);
};

export const loginUser = async (params) => {
    const { data } = await axios.post(`${url}/user/login`, params);
    return data;
};

export const fetchFoods = (params) => axios.get(
    `${url}/foods`,
    {
        params: {
            ...params,
            limit
        }
    }
);

export const addFood = (newFood) => axios.post(`${url}/foods`, newFood);

export const updateFood = (id, updatedFood) => axios.patch(`${url}/foods/${id}`, updatedFood);

export const deleteFoods = (ids) => axios.post(`${url}/foods/delete`, ids);

export const fetchReports = () => axios.get(`${url}/reports`);
