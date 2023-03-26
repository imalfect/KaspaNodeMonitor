import React from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import config from '../../config.json';
import KaspaLogo from '../../assets/Kaspa-Icon-Green.svg';
/**
 * @return {JSX.Element}
 * @constructor
 */
export default function WelcomeSection() {
  // Simple thing, a welcome section
  // left side of centered container is welcome text and right side is a picture
  return (
    <Container
      sx={{mt: 2, mb: 2, minWidth: 168}}>
      <Grid
        container
        spacing={2}
        columns={{xs: 1, sm: 1, md: 1, lg: 2, xl: 2}}
        sx={{width: 1}}>
        <Grid item xs={2} md={2} lg={1}>
          <Typography variant="h3" sx={{fontWeight: 800, mb: 3}}>
              Kaspa Node Monitor
          </Typography>
          <Typography variant="h5" sx={{fontWeight: 800}}>
            {config.welcomeText}
          </Typography>
        </Grid>
        <Grid item xs={2} md={2} lg={1}>
          <KaspaLogo height={168} width={168} />
        </Grid>
      </Grid>
    </Container>
  );
}
