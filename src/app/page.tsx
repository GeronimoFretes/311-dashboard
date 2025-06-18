import CoverSection from './components/CoverSection';
import TimeSeriesSection from './components/TimeSeriesSection';
import MapSection from './components/MapSection';
import CovidImpactSection from './components/CovidImpactSection';
import AgencyRaceSection from './components/AgenciesSection';

export default function Home() {
  return (
    <main className='h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth'>
      <CoverSection />
      <TimeSeriesSection />
      <MapSection/>
      <AgencyRaceSection/>
      <CovidImpactSection/>
    </main>
  );
}
