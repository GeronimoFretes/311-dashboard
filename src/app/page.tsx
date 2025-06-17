import CoverSection from './components/CoverSection';
import TimeSeriesSection from './components/TimeSeriesSection';
import MapSection from './components/MapSection';
import CovidImpactSection from './components/CovidImpactSection';
import AgencyRaceSection from './components/AgenciesSection';

export default function Home() {
  return (
    <>
      <CoverSection />
      <TimeSeriesSection />
      <MapSection/>
      <AgencyRaceSection/>
      <CovidImpactSection/>
    </>
  );
}
