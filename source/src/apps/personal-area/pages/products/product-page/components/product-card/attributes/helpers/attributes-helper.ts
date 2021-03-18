export const convertToObject = (value: string): {} | any => {
    if (value === "") {
        return null;
    }
    return JSON.parse(value);
}

export const convertToString = (value: {}) => {
    if (value === null) {
        return "";
    }
    return JSON.stringify(value);
}
