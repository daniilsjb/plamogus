import * as yup from "yup";

export default yup.object().shape({
  title: yup.string()
    .trim()
    .transform(it => it.replace(/\s+/g, ' '))
    .max(64, "Must be at most 64 characters long.")
    .required("Required."),

  description: yup.string()
    .trim()
    .max(512, "Must be at most 512 characters long."),

  type: yup.string()
    .nullable()
    .default(null)
    .transform(it => it || null),

  courseId: yup.string()
    .nullable()
    .default(null)
    .transform(it => it || null),

  deadlineTime: yup.mixed()
    .nullable()
    .default(null)
    .transform(it => it?.toISOString() || null),
});
