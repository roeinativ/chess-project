export const setStoredUsername = (username: string) => {
    localStorage.setItem("username", username);
};

export const getStoredUsername = () => {
    return localStorage.getItem("username") ?? "Guest";
};