import { DatePicker } from "@mui/x-date-pickers/DatePicker/DatePicker";

const FormikLiveDatePicker = ({ field, form, ...props }) => {
  const { name, value } = field;
  const { setFieldValue, submitForm } = form;

  const handleChange = async (date) => {
    setFieldValue(name, date);
    await submitForm();
  };

  return (
    <DatePicker
      slotProps={{
        actionBar: {
          actions: ["clear"],
        },
      }}
      name={name}
      value={value}
      onChange={handleChange}
      {...props}
    />
  );
};

export default FormikLiveDatePicker;
