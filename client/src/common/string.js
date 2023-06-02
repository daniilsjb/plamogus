export const removeNewlines = (value) => {
  return value.replace(/\n/g, "");
};

export const removeNonDigits = (value) => {
  return value.replace(/\D/g, "");
};
