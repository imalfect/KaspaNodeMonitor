import React from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import BigNumber from 'bignumber.js';
import config from '../../config.json';
import {dataChange, getNodeNetwork} from '../KaspaAPI';
import {numberFormatter} from '../index.js';

/**
 * Command Line theme for the frontend
 * @return {JSX.Element}
 * @constructor
 */
export default function CommandLineData() {
  const [nodeData, setNodeData] = React.useState({});
  const [network, setNetwork] = React.useState('');
  const [hardwareData, setHardwareData] = React.useState({});
  React.useEffect(() => {
    dataChange.on('nodeDataChange', (data) => {
      setNodeData(data);
    });
    // eslint-disable-next-line no-unused-vars
    const currentNetwork = getNodeNetwork()
        .then((network) => setNetwork(network));
    dataChange.on('hardwareDataChange', (data) => {
      setHardwareData(data);
    });
  }, []);
  return (
    <Container sx={{mt: 2, mb: 2, whiteSpace: 'pre'}}>
      <Typography variant="h3" sx={{fontWeight: 800, mb: 3}}>
        KASPA NODE MONITOR
      </Typography>
      <Typography variant="h5" sx={{fontWeight: 800}}>
        {config.welcomeText}
      </Typography>
      {/* Grid with four columns, sorry for the fact that it's in one file*/}
      {/* maybe I'll open an issue on GitHub and fix it one day*/}
      <Grid container spacing={8} sx={{mt: 3}}>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" sx={{fontWeight: 800, mb: 3}}>
            Node Status
          </Typography>
          <Typography variant="h5" sx={{fontWeight: 800}}>
            <Grid container direction="row">
              <Grid item sx={{mr: 'auto'}}>
                Status SYNC RPC:
              </Grid>
              <Grid item sx={{ml: 'auto'}}>
                {nodeData.isSyncedRPC}
              </Grid>
            </Grid>
          </Typography>
          <Typography variant="h5" sx={{fontWeight: 800}}>
            <Grid container direction="row">
              <Grid item sx={{mr: 'auto'}}>
                Status SYNC TIMESTAMP:
              </Grid>
              <Grid item sx={{ml: 'auto'}}>
                {nodeData.isSyncedTimestamp}
              </Grid>
            </Grid>
          </Typography>
          <Typography variant="h5" sx={{fontWeight: 800}}>
            <Grid container direction="row">
              <Grid item sx={{mr: 'auto'}}>
                PEERS COUNT:
              </Grid>
              <Grid item sx={{ml: 'auto'}}>
                {nodeData.peers}
              </Grid>
            </Grid>
          </Typography>
          <Typography variant="h5" sx={{fontWeight: 800}}>
            <Grid container direction="row">
              <Grid item sx={{mr: 'auto'}}>
                VERSION:
              </Grid>
              <Grid item sx={{ml: 'auto'}}>
                {nodeData.version}
              </Grid>
            </Grid>
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" sx={{fontWeight: 800, mb: 3}}>
            Network Status
          </Typography>
          <Typography variant="h5" sx={{fontWeight: 800}}>
            <Grid container direction="row">
              <Grid item sx={{mr: 'auto'}}>
                NETWORK:
              </Grid>
              <Grid item sx={{ml: 'auto'}}>
                {network}
              </Grid>
            </Grid>
          </Typography>
          <Typography variant="h5" sx={{fontWeight: 800}}>
            <Grid container direction="row">
              <Grid item sx={{mr: 'auto'}}>
                DIFFICULTY:
              </Grid>
              <Grid item sx={{ml: 'auto'}}>
                {numberFormatter.format(nodeData.difficulty)}
              </Grid>
            </Grid>
          </Typography>
          <Typography variant="h5" sx={{fontWeight: 800}}>
            <Grid container direction="row">
              <Grid item sx={{mr: 'auto'}}>
                MEMPOOL SIZE:
              </Grid>
              <Grid item sx={{ml: 'auto'}}>
                {numberFormatter.format(nodeData.mempoolSize)}
              </Grid>
            </Grid>
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" sx={{fontWeight: 800, mb: 3}}>
              Host status
          </Typography>
          <Typography variant="h5" sx={{fontWeight: 800}}>
            <Grid container direction="row">
              <Grid item sx={{mr: 'auto'}}>
                HOSTNAME:
              </Grid>
              <Grid item sx={{ml: 'auto'}}>
                {hardwareData.hostname}
              </Grid>
            </Grid>
          </Typography>
          <Typography variant="h5" sx={{fontWeight: 800}}>
            <Grid container direction="row">
              <Grid item sx={{mr: 'auto'}}>
                CPU:
              </Grid>
              <Grid item sx={{ml: 'auto'}}>
                {hardwareData.cpuModel}
              </Grid>
            </Grid>
          </Typography>
          <Typography variant="h5" sx={{fontWeight: 800}}>
            <Grid container direction="row">
              <Grid item sx={{mr: 'auto'}}>
                THREADS:
              </Grid>
              <Grid item sx={{ml: 'auto'}}>
                {hardwareData.cpuThreads}
              </Grid>
            </Grid>
          </Typography>
          <Typography variant="h5" sx={{fontWeight: 800}}>
            <Grid container direction="row">
              <Grid item sx={{mr: 'auto'}}>
                TOTAL MEM:
              </Grid>
              <Grid item sx={{ml: 'auto'}}>
                {/* eslint-disable-next-line max-len */}
                {numberFormatter.format(new BigNumber(hardwareData.totalRam).shiftedBy(3).toFixed())} KB
              </Grid>
            </Grid>
          </Typography>
          <Typography variant="h5" sx={{fontWeight: 800}}>
            <Grid container direction="row">
              <Grid item sx={{mr: 'auto'}}>
                FREE MEM:
              </Grid>
              <Grid item sx={{ml: 'auto'}}>
                {/* eslint-disable-next-line max-len */}
                {numberFormatter.format(new BigNumber(hardwareData.freeRam).shiftedBy(3).toFixed())} KB
              </Grid>
            </Grid>
          </Typography>
          <Typography variant="h5" sx={{fontWeight: 800}}>
            <Grid container direction="row">
              <Grid item sx={{mr: 'auto'}}>
                SERVER LOAD:
              </Grid>
              <Grid item sx={{ml: 'auto'}}>
                {hardwareData.load}
              </Grid>
            </Grid>
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" sx={{fontWeight: 800, mb: 3}}>
                Block Info
          </Typography>
          <Typography variant="h5" sx={{fontWeight: 800}}>
            <Grid container direction="row">
              <Grid item sx={{mr: 'auto'}}>
                BLOCK COUNT:
              </Grid>
              <Grid item sx={{ml: 'auto'}}>
                {numberFormatter.format(nodeData.blockCount)}
              </Grid>
            </Grid>
          </Typography>
          <Typography variant="h5" sx={{fontWeight: 800}}>
            <Grid container direction="row">
              <Grid item sx={{mr: 'auto'}}>
                HEADER COUNT:
              </Grid>
              <Grid item sx={{ml: 'auto'}}>
                {numberFormatter.format(nodeData.headerCount)}
              </Grid>
            </Grid>
          </Typography>
          <Typography variant="h5" sx={{fontWeight: 800}}>
            <Grid container direction="row">
              <Grid item sx={{mr: 'auto'}}>
                DAA SCORE:
              </Grid>
              <Grid item sx={{ml: 'auto'}}>
                {numberFormatter.format(nodeData.daaScore)}
              </Grid>
            </Grid>
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
}
