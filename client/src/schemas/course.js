import * as yup from "yup";

export default yup.object().shape({
  code: yup.string()
    .max(8, "Must be at most 8 characters long.")
    .required("Required."),

  title: yup.string()
    .max(64, "Must be at most 64 characters long.")
    .required("Required."),

  semester: yup.number()
    .integer("Must be an integer value.")
    .min(1, "Must be positive and non-zero."),

  description: yup.string()
    .max(1024, "Must be at most 1024 characters long."),
});
