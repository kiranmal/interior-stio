import { useParams } from 'react-router-dom';
import Seo from '../hooks/useSeo.jsx';
import { usePage } from '../hooks/useData.js';
import { Sections } from '../components/Sections.jsx';
import { State } from '../components/ui.jsx';
import NotFound from './NotFound.jsx';

export default function CmsPage() {
  const { key } = useParams();
  const { page, loading } = usePage(key);
  if (loading) return <State loading />;
  if (!page) return <NotFound />;
  return <><Seo title={page.seo?.title || page.title} description={page.seo?.description} image={page.seo?.ogImage} /><Sections sections={page.sections} /></>;
}
