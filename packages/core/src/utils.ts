export const getHighResTime = () => {
  if (typeof performance === "undefined") {
    return Date.now();
  }

  return performance.now();
};
