import {createTheme} from "@mui/material";
import {amber, teal} from "@mui/material/colors";

export const theme = createTheme({
    palette: {
        primary: {
            main: teal[800],
        },
        secondary: {
            main: amber[500],
        },
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 200,
            md: 600,
            lg: 900,
            xl: 1200,
        },
    },
    typography: {
        h1: {
            fontFamily: 'Montserrat, sans-serif',
        },
        h2: {
            fontFamily: 'Montserrat, sans-serif',
        },
        h3: {
            fontFamily: 'Montserrat, sans-serif',
        },
        h4: {
            fontFamily: 'Montserrat, sans-serif',
        },
        h5: {
            fontFamily: 'Montserrat, sans-serif',
        },
        h6: {
            fontFamily: 'Montserrat, sans-serif',
        },
        subtitle1: {
            fontFamily: 'Montserrat, sans-serif',
        },
        subtitle2: {
            fontFamily: 'Montserrat, sans-serif',
        },
        button: {
            fontWeight: 400,
            fontFamily: 'Montserrat, sans-serif',
        }
    },
});