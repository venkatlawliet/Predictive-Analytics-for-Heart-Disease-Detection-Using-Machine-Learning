import { HeroSection } from '../components/HeroSection';
import { FeaturesSection } from '../components/FeaturesSection';
import { HeatMap } from '../components/HeatMap';
import { Testimonials } from '../components/Testimonials';
import { FAQs } from '../components/FAQs';
import { PredictionForm, FormData } from '../components/PredictionForm';
import { Footer } from '../components/Footer';

interface HomePageProps {
  onFormSubmit: (data: FormData) => void;
  loading?: boolean;
  error?: string | null;
}

export function HomePage({ onFormSubmit, loading, error }: HomePageProps) {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <HeatMap />
      <Testimonials />
      <FAQs />
      <PredictionForm onSubmit={onFormSubmit} loading={loading} error={error} />
      <Footer />
    </div>
  );
}