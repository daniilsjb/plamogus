export const utcToLocalDate = (utc) => {
  return new Date(utc).toLocaleDateString(undefined, {
    year: "numeric", month: "numeric", day: "numeric",
  });
};
