export const removeNewlines = (value) => {
  return value.replace(/\n/g, "");
};

export const removeNonDigits = (value) => {
  return value.replace(/\D/g, "");
};

export const removeWhitespace = (value) => {
  return value.replace(/\s/g, "");
};
