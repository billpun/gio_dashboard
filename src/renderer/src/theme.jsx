import { red, blue } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

// A custom theme for this app
const theme = createTheme({
  palette: {
    primary: {
      main: 'rgba(50, 50, 50, 1)',
    },
    secondary: {
      main: blue[900],
    },
    // error: {
    //   main: red.A400,
    // },
		mode: 'light'
  },
});

export default theme;