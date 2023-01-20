import React from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import InfoBox from './InfoBox';
import {dataChange} from '../KaspaAPI.js';
import {numberFormatter} from '../index.js';
/**
 * @return {JSX.Element}
 * @constructor
 */
export default function GeneralInfo() {
  // Basically four boxes with a title and a number
  // on the right side maybe smaller and different color
  const [blockCount, setBlockCount] = React.useState(0);
  const [headerCount, setHeaderCount] = React.useState(0);
  const [peersCount, setPeersCount] = React.useState(0);
  const [daaScore, setDaaScore] = React.useState(0);
  React.useEffect(() => {
    dataChange.on('nodeDataChange', (data) => {
      setBlockCount(data.blockCount);
      setHeaderCount(data.headerCount);
      setPeersCount(data.peers);
      setDaaScore(data.daaScore);
    });
  }, []);
  return (
    <Container
      sx={{mt: 2, mb: 2}}>
      <Grid
        justifyContent="center"
        alignItems="center"
        container
        spacing={2}
        columns={{xs: 1, sm: 1.5, md: 5, lg: 6, xl: 11}}
        sx={{minWidth: 1}}>
        <Grid item xs={1} md={2} lg={3} align="center">
          <InfoBox
            title="Block Count"
            value={numberFormatter.format(blockCount)}/>
        </Grid>
        <Grid item xs={1} md={3} lg={3} align="center">
          <InfoBox
            title="Header Count"
            value={numberFormatter.format(headerCount)}/>
        </Grid>
        <Grid item xs={1} md={2} align="center">
          <InfoBox
            title="Peers"
            value={peersCount}/>
        </Grid>
        <Grid item xs={1} md={3} align="center">
          <InfoBox
            title="DAA Score"
            value={numberFormatter.format(daaScore)}/>
        </Grid>
      </Grid>
    </Container>
  );
}
