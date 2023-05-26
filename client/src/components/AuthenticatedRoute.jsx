import { Navigate } from 'react-router-dom';

const AuthenticatedRoute = ({ children }) => {
  if (!localStorage.getItem('auth_token')) {
    return <Navigate to="/login" replace/>;
  } else {
    return children;
  }
};

export default AuthenticatedRoute;
