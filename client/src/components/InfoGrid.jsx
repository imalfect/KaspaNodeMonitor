import React from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import InfoTable from './InfoTable';
import {dataChange, getNodeNetwork} from '../KaspaAPI.js';
import {numberFormatter} from '../index.js';
/**
 * @return {JSX.Element}
 * @constructor
 */
export default function InfoGrid() {
  const [nodeData, setNodeData] = React.useState([{}]);
  const [networkData, setNetworkData] = React.useState([{}]);
  const [hardwareData, setHardwareData] = React.useState([{}]);
  React.useEffect(() => {
    /**
     * Simple run function because useEffect doesn't like async
     * @return {void}
     */
    async function run() {
      // Get network
      dataChange.on('nodeDataChange', (data) => {
        setNodeData([
          {
            'name': 'Node Version',
            'value': data.version,
          },
          {
            'name': 'Sync status (By gRPC)',
            'value': data.isSyncedRPC.toString(),
          },
          {
            'name': 'Sync status (By Block Timestamp)',
            'value': data.isSyncedTimestamp.toString(),
          },
        ]);
        // Set network data
        setNetworkData([
          {
            'name': 'Network',
            'value': currentNetwork,
          },
          {
            'name': 'Difficulty',
            'value': numberFormatter.format(data.difficulty),
          },
          {
            'name': 'Mempool Size',
            'value': numberFormatter.format(data.mempoolSize),
          }]);
      });
      dataChange.on('hardwareDataChange', (data) => {
        console.log('hw data changed');
        setHardwareData([
          {
            'name': 'Hostname',
            'value': data.hostname,
          },
          {
            'name': 'Location',
            'value': data.location,
          },
          {
            'name': 'CPU Model',
            'value': data.cpuModel,
          },
          {
            'name': 'CPU Threads',
            'value': data.cpuThreads,
          },
          {
            'name': 'RAM',
            // eslint-disable-next-line max-len
            'value': `${numberFormatter.format(data.freeRam)} / ${numberFormatter.format(data.totalRam)} MB`,
          },
          {
            'name': 'Load',
            'value': data.load,
          },
        ]);
      });
      const currentNetwork = await getNodeNetwork();
    }
    run();
  }, []);
  // Three rows of info tables
  return (
    <Container
      sx={{mt: 2, mb: 2}}>
      <Grid
        container
        spacing={3}
        justifyContent='center'
        columns={{xs: 1, sm: 1, md: 1, lg: 5, xl: 9.2}}
        sx={{minWidth: 1}}>
        <Grid item xs={1} md={1} lg={3}>
          <Typography variant="h3" sx={{fontWeight: 800, mb: 3}}>
            Node Info
          </Typography>
          <InfoTable data={nodeData}/>
        </Grid>
        <Grid item xs={1} md={1} lg={3.2}>
          <Typography variant="h3" sx={{fontWeight: 800, mb: 3}}>
            Network
          </Typography>
          <InfoTable data={networkData}/>
        </Grid>
        <Grid item xs={1} md={1} lg={3}>
          <Typography variant="h3" sx={{fontWeight: 800, mb: 3}}>
            Hardware
          </Typography>
          <InfoTable data={hardwareData}/>
        </Grid>
      </Grid>
    </Container>
  );
}
