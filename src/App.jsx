import { CinematicHero } from './components/hero/CinematicHero';
import { ServicesSection } from './components/services/ServicesSection';
import { FinalCtaSection } from './components/cta/FinalCtaSection';
import { Footer } from './components/footer/Footer';
import './App.css';

function App() {
  return (
    <div className="app-root">
      {/* 1. Cinematic Scroll-Driven Electrical Hero (PINNED for 1400vh) */}
      <CinematicHero />

      {/* 2. Section 2: Seamless Electrical Journey Transition & Services (PINNED for 600vh) */}
      <ServicesSection />

      {/* 3. Final CTA Section: Premium Static Architectural Conclusion */}
      <FinalCtaSection />

      {/* 4. Elegant Minimalist Footer */}
      <Footer />
    </div>
  );
}

export default App;
