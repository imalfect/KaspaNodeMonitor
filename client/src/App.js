import React from 'react';
import MainTheme from './components/MainTheme';
import CommandLineData from './components/CommandLineData';
import config from '../config.json';
// Here everything comes together into one piece
/**
 * @return {JSX.Element}
 * @constructor
 */
export default function App() {
  return (
    <>
      {config.theme.startsWith('commandLine') ? <CommandLineData/> : null}
      {config.theme.startsWith('main') ? <MainTheme/> : null}
    </>
  );
}
