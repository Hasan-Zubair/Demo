import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import { light } from "./palette";
import { shadows } from "./shadows";

let theme = createTheme({
  palette: light,
  shadows: shadows,
  typography: {
    fontFamily: '"Inter", sans-serif',
    button: {
      textTransform: "none",
      fontWeight: "medium",
    },
  },
  zIndex: {
    appBar: 1200,
    drawer: 1300,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 400,
          borderRadius: 5,
          paddingTop: 10,
          paddingBottom: 10,
        },
      },
    },

    MuiBox: {
      styleOverrides: {
        root: {
          padding: "initial !important",
          paddingRight: "none !important",
          paddingLeft: "none !important",
        },
      },
    },

    MuiInputBase: {
      styleOverrides: {
        root: {
          borderRadius: 5,
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 5,
        },
        input: {
          borderRadius: 5,
        },
      },
    },
  },
});

theme = responsiveFontSizes(theme);

export default theme;
