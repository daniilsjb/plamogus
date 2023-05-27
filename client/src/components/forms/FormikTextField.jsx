import TextField from '@mui/material/TextField';

const FormikTextField = ({ field, form: { touched, errors }, children, ...props }) => {
  const errorMessage = errors[field.name];
  const errorPresent = !!touched[field.name] && !!errorMessage;

  return (
    <TextField error={errorPresent} helperText={errorPresent && errorMessage} {...field} {...props}>
      {children}
    </TextField>
  );
};

export default FormikTextField;
