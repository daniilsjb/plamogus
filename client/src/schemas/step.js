import * as yup from 'yup';

const StepSchema = yup.object().shape({
  title: yup.string()
    .max(64, 'Must be at most 64 characters long.')
    .required('Required.'),
});

export default StepSchema;
