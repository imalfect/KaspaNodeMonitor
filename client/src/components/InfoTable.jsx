import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
/* eslint-disable react/prop-types */
// For some reason, eslint doesn't like the prop types
/**
 * @param {Object} props
 * @param {Array} props.data
 * @return {JSX.Element}
 * @constructor
 */
export default function InfoTable(props) {
  return (
    <Container sx={{pl: 2, pr: 2}}>
      <TableContainer component={Paper} sx={{width: 1}}>
        <Table aria-label="Data Table">
          <TableBody>
            {props.data.map((row) => (
              <TableRow
                key={row.name}
                sx={{'&:last-child td, &:last-child th': {border: 0}}}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right" sx={{color: 'text.status'}}>{row.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>

  );
}
