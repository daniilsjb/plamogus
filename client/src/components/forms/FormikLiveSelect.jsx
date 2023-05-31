import Select from "@mui/material/Select";

const FormikLiveSelect = ({ children, form, field }) => {
  const { name, value } = field;
  const { setFieldValue, submitForm } = form;

  const handleChange = async (event) => {
    setFieldValue(name, event.target.value);
    await submitForm();
  };

  return (
    <Select name={name} value={value} onChange={handleChange}>
      {children}
    </Select>
  );
};

export default FormikLiveSelect;
