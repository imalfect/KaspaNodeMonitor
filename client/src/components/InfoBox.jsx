import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {LinearProgress} from '@mui/material';
/* eslint-disable react/prop-types */
// For some reason, eslint doesn't like the prop types
/**
 * @param {Object} props - props
 * @param {string} props.title - title
 * @param {string | number} props.value - value
 * @return {JSX.Element}
 * @constructor
 */
export default function InfoBox(props) {
  return (
    <Box
      sx={{
        'display': 'flex',
        'backgroundColor': 'background.paper',
        'boxShadow': 3,
        'overflow': 'hidden',
        'height': 120,
        'borderRadius': 1.5,
        '&:hover': {
          backgroundColor: 'background.paper',
          opacity: [0.9, 0.87, 0.86],
        },
      }}
    >
      {props.value === 0 || props.value === '0' ?
          <Box
            sx={{
              width: '80%',
              mt: 'auto', mb: 'auto', ml: 'auto', mr: 'auto'}}>
            <LinearProgress />
          </Box> : null}
      <Typography align="left" variant="h5"
        display={props.value === 0 || props.value === '0' ? 'none' : 'block'}
        sx={{
          marginLeft: 2, marginTop: 1, marginRight: 1.3,
          flexGrow: 1,
          fontSize: 27, fontWeight: 700, fontColor: 'white'}}>
        {props.title}
      </Typography>
      <Typography align="right" variant="h3" color='#007aff'
        display={props.value === 0 || props.value === '0' ? 'none' : 'block'}
        sx={{
          marginTop: 1, marginRight: 1.3,
          flexGrow: 1,
          fontWeight: 600, fontSize: 33}}>
        {props.value}
      </Typography>

    </Box>
  );
}
