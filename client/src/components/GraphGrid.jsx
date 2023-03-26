import React from 'react';
import Grid from '@mui/material/Grid';
import DataGraph from './DataGraph';
import {dataChange} from '../KaspaAPI';
/* eslint-disable react/prop-types */
// TODO: JSDoc here.
export default function GraphGrid() {
  const difficultyRef = React.useRef();
  const hashrateRef = React.useRef();

  React.useEffect(() => {
    dataChange.on('nodeDataChange', (data) => {
      difficultyRef.current?.addData(data.difficulty);
      hashrateRef.current?.addData(data.hashRate);
    });
  }, []);

  return (
    <Grid container spacing={8} sx={{mt: 3}}>
      <Grid item xs={12} md={6}>
        <DataGraph
          title="Difficulty"
          ref={difficultyRef}/>
      </Grid>
      <Grid item xs={12} md={6}>
        <DataGraph
          title="Hashrate"
          ref={hashrateRef}
          yTickAdornment="H/s"/>
      </Grid>
    </Grid>
  );
}
