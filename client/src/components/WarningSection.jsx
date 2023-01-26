import React from 'react';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import {frontendVersion, backendVersion,
  errors, dataChange} from '../KaspaAPI.js';
/**
 * @return {JSX.Element}
 * @constructor
 * @summary This component is used to display warnings.
 */
export default function WarningSection() {
  const [versionMismatch, setVersionMismatch] = React.useState(false);
  const [backendConnError, setBackendConnError] = React.useState(false);
  const [nodeConnError, setNodeConnError] = React.useState(false);
  React.useEffect(() => {
    errors.on('versionMismatch', () => {
      console.log('Version mismatch');
      setVersionMismatch(true);
    });
    errors.on('backendConnectionError', () => {
      console.log('Backend connection error');
      setBackendConnError(true);
      setNodeConnError(false);
    });
    errors.on('nodeConnectionError', () => {
      console.log('Node connection error');
      setNodeConnError(true);
      setBackendConnError(false);
    });
    dataChange.on('nodeDataChange', () => {
      setNodeConnError(false);
      setBackendConnError(false);
    });
  }, []);
  return (
    <Stack sx={{width: '80%', mr: 'auto', ml: 'auto'}} spacing={2}>
      <Alert
        variant="filled"
        severity="warning"
        sx={{display: `${versionMismatch ? 'flex' : 'none'}`}}>
        {/* eslint-disable-next-line max-len */}
          The frontend version ({frontendVersion}) doesn&apos;t match the backend version ({backendVersion}).
      </Alert>
      <Alert
        variant="filled"
        severity="error"
        sx={{display: `${backendConnError ? 'flex' : 'none'}`}}>
          Cannot connect to the backend.
      </Alert>
      <Alert
        variant="filled"
        severity="error"
        sx={{display: `${nodeConnError ? 'flex' : 'none'}`}}>
          Connected to backend, but can&apos;t reach the Kaspa node.
      </Alert>
    </Stack>
  );
}
