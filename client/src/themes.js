/* eslint-disable max-len */
// noinspection ES6CheckImport

import {createTheme} from '@mui/material/styles';
export const mainDark = createTheme({
  typography: {
    fontFamily: 'Inter',
  },
  divider: {
    color: '#49eacb',
  },
  palette: {
    mode: 'dark',
    background: {
      paper: '#111b19',
    },
    text: {
      primary: '#8dffec', // #a7faeb
      status: '#8cd483',
      sidebar: '#c7fcf2', // #a7faeb
    },
    primary: {
      main: '#49eacb',
      contrastText: '#c7fcf2',
    },
    error: {
      main: '#fd5656',
      contrastText: '#c7d4fc',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        /* inter-regular - latin */
        @font-face {
          font-family: 'Inter';
          font-style: normal;
          font-weight: 400;
          src: local(''),
          url('../fonts/inter-v12-latin-regular.woff2') format('woff2'), /* Chrome 26+, Opera 23+, Firefox 39+ */
          url('../fonts/inter-v12-latin-regular.woff') format('woff'); /* Chrome 6+, Firefox 3.6+, IE 9+, Safari 5.1+ */
          font-display: swap;
        }
        /* inter-800 - latin */
        @font-face {
          font-family: 'Inter';
          font-style: normal;
          font-weight: 800;
          src: local(''),
          url('../fonts/inter-v12-latin-800.woff2') format('woff2'), /* Chrome 26+, Opera 23+, Firefox 39+ */
          url('../fonts/inter-v12-latin-800.woff') format('woff'); /* Chrome 6+, Firefox 3.6+, IE 9+, Safari 5.1+ */
          font-display: swap;
        }`,
    },
  },
});

export const mainLight = createTheme({
  typography: {
    fontFamily: 'Inter',
  },
  palette: {
    mode: 'light',
    background: {
      paper: '#ffffff',
    },
    text: {
      primary: '#1e2625', // #a7faeb
      sidebar: '#1e2625', // #a7faeb
    },
    primary: {
      main: '#49eacb',
      contrastText: '#c7fcf2',
    },
    error: {
      main: '#fd5656',
      contrastText: '#c7d4fc',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        /* inter-regular - latin */
        @font-face {
          font-family: 'Inter';
          font-style: normal;
          font-weight: 400;
          src: local(''),
          url('../fonts/inter-v12-latin-regular.woff2') format('woff2'), /* Chrome 26+, Opera 23+, Firefox 39+ */
          url('../fonts/inter-v12-latin-regular.woff') format('woff'); /* Chrome 6+, Firefox 3.6+, IE 9+, Safari 5.1+ */
          font-display: swap;
        }
        /* inter-800 - latin */
        @font-face {
          font-family: 'Inter';
          font-style: normal;
          font-weight: 800;
          src: local(''),
          url('../fonts/inter-v12-latin-800.woff2') format('woff2'), /* Chrome 26+, Opera 23+, Firefox 39+ */
          url('../fonts/inter-v12-latin-800.woff') format('woff'); /* Chrome 6+, Firefox 3.6+, IE 9+, Safari 5.1+ */
          font-display: swap;
        }`,
    },
  },
});

export const commandLineGreen = createTheme({
  typography: {
    fontFamily: 'monospace',
  },
  palette: {
    mode: 'dark',
    background: {
      paper: '#1e1e1e',
    },
    text: {
      primary: '#49b86a', // #a7faeb
      sidebar: '#c7fcf2', // #a7faeb
    },
    primary: {
      main: '#49b86a',
      contrastText: '#c7fcf2',
    },
    error: {
      main: '#fd5656',
      contrastText: '#c7d4fc',
    },
  },
});

export const commandLineYellow = createTheme({
  typography: {
    fontFamily: 'monospace',
    fontColor: '#c4a000',
  },
  palette: {
    mode: 'dark',
    background: {
      paper: '#1e1e1e',
    },
    text: {
      primary: '#c4a000', // #a7faeb
      sidebar: '#c7fcf2', // #a7faeb
    },
    primary: {
      main: '#49b86a',
      contrastText: '#c7fcf2',
    },
    error: {
      main: '#fd5656',
      contrastText: '#c7d4fc',
    },
  },
});

