import MuiTextField from '@mui/material/TextField';
import MuiSelect from '@mui/material/Select';
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker';
import { Field, useFormikContext } from 'formik';

export const TextField = ({ field, form: { touched, errors }, children, ...props }) => {
  const errorMessage = errors[field.name];
  const errorPresent = !!touched[field.name] && !!errorMessage;
  return (
    <MuiTextField error={errorPresent} helperText={errorPresent && errorMessage} {...field} {...props}>
      {children}
    </MuiTextField>
  );
};

export const Select = ({ children, form, field }) => {
  const { name, value } = field;
  const { setFieldValue } = form;

  return (
    <MuiSelect
      name={name}
      value={value}
      onChange={event => setFieldValue(name, event.target.value)}
    >
      {children}
    </MuiSelect>
  );
};

export const DatePicker = ({ field, form, ...props }) => {
  const { name, value } = field;

  const handleChange = (date) => {
    form.setFieldValue(name, date);
  };

  return (
    <MuiDatePicker
      {...props}
      slotProps={{
        actionBar: {
          actions: ['clear'],
        },
      }}
      name={name}
      value={value}
      onChange={handleChange}
    />
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

export const LiveSelect = ({ children, form, field }) => {
  const { name, value } = field;
  const { setFieldValue, submitForm } = form;

  const onChange = async (event) => {
    setFieldValue(name, event.target.value);
    await submitForm();
  };

  return (
    <MuiSelect
      name={name}
      value={value}
      onChange={onChange}
    >
      {children}
    </MuiSelect>
  );
};

export const LiveDatePicker = ({ field, form, ...props }) => {
  const { name, value } = field;
  const { setFieldValue, submitForm } = form;

  const onChange = async (date) => {
    setFieldValue(name, date);
    await submitForm();
  };

  return (
    <MuiDatePicker
      {...props}
      slotProps={{
        actionBar: {
          actions: ['clear'],
        },
      }}
      name={name}
      value={value}
      onChange={onChange}
    />
  );
};
