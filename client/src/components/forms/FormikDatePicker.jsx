import { DatePicker } from "@mui/x-date-pickers/DatePicker/DatePicker";

const FormikDatePicker = ({ field, form, ...props }) => {
  const { name, value } = field;

  const handleChange = (date) => {
    form.setFieldValue(name, date);
  };

  return <DatePicker name={name} value={value} onChange={handleChange} {...props}/>;
};

export default FormikDatePicker;
