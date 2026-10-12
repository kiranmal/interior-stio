import Seo from '../hooks/useSeo.jsx';
import { usePage } from '../hooks/useData.js';
import { Sections } from '../components/Sections.jsx';
import { State } from '../components/ui.jsx';

export default function Home() {
  const { page, loading } = usePage('home');
  return (
    <>
      <Seo title="Interior Designers in Indirapuram, Ghaziabad" description="Residential, commercial and office interiors and modular kitchens in Indirapuram, Ghaziabad and Delhi NCR." />
      {loading ? <State loading /> : <Sections sections={page?.sections} />}
    </>
  );
}
