import Container from '@mui/material/Container';
import WelcomeSection from './WelcomeSection';
import SectionDivider from './Divider';
import GeneralInfo from './GeneralInfo';
import InfoGrid from './InfoGrid';
import React from 'react';
import WarningSection from './WarningSection';
import GraphGrid from './GraphGrid';
/**
 * Main theme for the frontend
 * @return {JSX.Element}
 * @constructor
 */
export default function MainTheme() {
  return (
    <Container>
      <WelcomeSection/>
      <WarningSection/>
      <SectionDivider/>
      {/* General info */}
      <GeneralInfo/>
      <SectionDivider/>
      {/* Time of a grid of tables with precious data */}
      <InfoGrid/>
      <GraphGrid/>
    </Container>
  );
}
