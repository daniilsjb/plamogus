import MuiTextField from '@mui/material/TextField';
import { Field, useFormikContext } from 'formik';

export const TextField = ({ field, form: { touched, errors }, children, ...props }) => {
  const errorMessage = errors[field.name];
  const errorPresent = !!touched[field.name] && !!errorMessage;
  return (
    <MuiTextField error={errorPresent} helperText={errorPresent ? errorMessage : ' '} {...field} {...props}>
      {children}
    </MuiTextField>
  );
};

export const LiveField = ({ submitOnBlur, submitOnEnter, children, ...props }) => {
  const { handleBlur, submitForm } = useFormikContext();

  const onBlur = async (event) => {
    handleBlur(event);
    if (submitOnBlur ?? true) {
      await submitForm();
    }
  };

  const onKeyDown = async (event) => {
    if (submitOnEnter ?? true) {
      if (event.key === 'Enter') {
        await submitForm();
      }
    }
  };

  return <Field onBlur={onBlur} onKeyDown={onKeyDown} {...props}>{children}</Field>;
};
