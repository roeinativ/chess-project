export const setStoredUsername = (username: string) => {
  localStorage.setItem("username", username);
};

export const getStoredUsername = () => {
  return localStorage.getItem("username") ?? "Guest";
};

export const removeStoredUsername = () => {
  return localStorage.removeItem("username");
};
