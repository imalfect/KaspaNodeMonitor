import React from 'react';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';

/**
 * @return {JSX.Element}
 * @constructor
 */
export default function SectionDivider() {
  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        mt: 2, mb: 2}}>
      <Divider sx={{backgroundColor: 'primary.main', width: '100%'}}/>
    </Container>
  );
}
