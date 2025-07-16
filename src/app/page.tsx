import IntroSection         from "./components/IntroSection";
import CoverSection         from "./components/CoverSection";
import TimeSeriesSection    from "./components/TimeSeriesSection";
import MapSection           from "./components/MapSection";
import AgencyRaceSection    from "./components/AgenciesSection";
import CovidImpactSection   from "./components/CovidImpactSection";
import FinalThoughtsSection    from "./components/FinalThoughtsSection";
import AboutUsSection     from "./components/AboutUsSection";

/**
 * Home page — server component (no "use client").
 * Each section snaps vertically; horizontal overflow is blocked.
 */
export default function Home() {
  return (
    <main className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth overflow-x-hidden">
      <IntroSection        id="intro"         />
      <CoverSection        id="cover"         />
      <TimeSeriesSection   id="time-series"   />
      <MapSection          id="map"           />
      <AgencyRaceSection   id="agency-race"   />
      <CovidImpactSection  id="covid-impact"  />
      <FinalThoughtsSection   id="final-thoughts"    />
      <AboutUsSection     id="about-us"      />
    </main>
  );
}
