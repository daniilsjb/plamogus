import Typography from '@mui/material/Typography';
import * as yup from 'yup';
import { login } from '../../services/auth';
import { Field, Form, Formik } from 'formik';
import Box from '@mui/material/Box';
import { TextField } from '../../components/form-bindings';
import Button from '@mui/material/Button';
import { Avatar, Container, Grid } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Link } from 'react-router-dom';

const Schema = yup.object().shape({
  username: yup.string()
    .max(32, 'Must be at most 32 characters long.')
    .matches(/^[a-zA-Z0-9_]+$/, 'Only alphanumeric and underscore allowed.')
    .required('Required.'),

  password: yup.string()
    .min(8, 'Must be at least 8 characters long.')
    .max(128, 'Must be at most 128 characters long.')
    .required('Required.'),
});

const Login = () => {
  const initialValues = {
    username: '',
    password: '',
  };

  const handleSubmit = async (values) => {
    await login(values);
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon/>
        </Avatar>
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          Sign In
        </Typography>
        <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={Schema}>
          {(formik) => (
            <Form style={{ height: '100%' }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Field
                    component={TextField}
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    component={TextField}
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={!(formik.dirty && formik.isValid)}
              >
                Sign In
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link to="/register" variant="body2" style={{ textDecoration: 'none' }}>
                    Don't have an account? Sign up!
                  </Link>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
};

export default Login;
