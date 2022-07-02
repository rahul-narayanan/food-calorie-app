const FoodNameRegex = /^[a-zA-Z0-9 ()-_.,&]+$/;

const isNumber = (value) => !Number.isNaN(Number(value));

export const TextFieldDefaultProps = {
    margin: "normal",
    variant: "standard",
    fullWidth: true,
    required: true
};

export function ValidateFoodName(value) {
    if (!value) {
        return "Please enter the food name";
    }

    if (!FoodNameRegex.test(value)) {
        return "Invalid food name";
    }

    return null;
}

export function ValidateCalorieCount(value) {
    if (!value) {
        return "Please enter the calorie value";
    }

    if (!isNumber(value) || Number(value) <= 0 || Number(value) >= 10000) {
        return "Invalid input. Calorie value should be in the range 1 to 10000";
    }

    return null;
}
