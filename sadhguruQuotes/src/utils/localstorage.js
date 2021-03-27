export const setToLocalCache = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getFromLocalCache = (key) => {
  return JSON.parse(localStorage.getItem(key));
};
