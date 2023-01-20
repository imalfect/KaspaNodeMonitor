import React from 'react';
import ReactDOM from 'react-dom/client';
import CssBaseline from '@mui/material/CssBaseline';
import {ThemeProvider} from '@mui/material';
import * as themes from './themes.js';
import './KaspaAPI.js';
import './App.css';
import App from './App';
import config from '../config.json';
import '../fonts/inter-v12-latin-800.woff2';
import '../fonts/inter-v12-latin-800.woff';
import '../fonts/inter-v12-latin-regular.woff2';
import '../fonts/inter-v12-latin-regular.woff';
export const numberFormatter = new Intl.NumberFormat('en-US');
// Main thing
ReactDOM.createRoot(document.getElementById('root')).render(
    <ThemeProvider theme={themes[config.theme]}>
      <CssBaseline enableColorScheme/>
      <App/>
    </ThemeProvider>,
);
