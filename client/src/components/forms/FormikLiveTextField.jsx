import { Field, useFormikContext } from 'formik';

const FormikLiveTextField = ({ submitOnBlur, submitOnEnter, children, form, field, ...props }) => {
  const formik = useFormikContext();

  const handleBlur = async (event) => {
    formik.handleBlur(event);
    if (submitOnBlur ?? true) {
      await formik.submitForm();
    }
  };

  const handleKeyDown = async (event) => {
    if (event.key === 'Enter') {
      if (submitOnEnter ?? true) {
        await formik.submitForm();
      }
    }
  };

  return (
    <Field onBlur={handleBlur} onKeyDown={handleKeyDown} {...props}>
      {children}
    </Field >
  );
};

export default FormikLiveTextField;
