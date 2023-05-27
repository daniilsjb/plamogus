import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';

const ResponsiveIconButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'breakpoint',
})(({ theme, breakpoint }) => ({
  fontSize: theme.typography.pxToRem(14),
  minWidth: 'auto',

  [theme.breakpoints.down(breakpoint)]: {
    minWidth: 32,
    paddingLeft: 8,
    paddingRight: 8,
    '& .MuiButton-startIcon': {
      margin: 0,
    },
    '& .buttonText': {
      display: 'none',
    },
  },
}));

export default ResponsiveIconButton;