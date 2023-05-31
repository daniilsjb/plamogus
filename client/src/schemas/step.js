import * as yup from "yup";

export default yup.object().shape({
  title: yup.string()
    .max(64, "Must be at most 64 characters long.")
    .required("Required."),
});
