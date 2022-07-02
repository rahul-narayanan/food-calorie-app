/* eslint-disable no-bitwise */

const stringToColor = (string = "") => {
    let hash = 0;
    let i;

    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 6) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }

    return color;
};

export const stringAvatar = (name = "") => ({
    sx: {
        bgcolor: stringToColor(name)
    },
    children: `${name?.charAt(0) || "A"}`
});
