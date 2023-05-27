import Select from '@mui/material/Select';

const FormikSelect = ({ children, form, field }) => {
  const { name, value } = field;
  const { setFieldValue } = form;

  const handleChange = event => {
    setFieldValue(name, event.target.value);
  };

  return (
    <Select name={name} value={value} onChange={handleChange}>
      {children}
    </Select>
  );
};

export default FormikSelect;
