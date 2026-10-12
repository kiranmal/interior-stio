import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import { Services, ServiceDetail } from './pages/Services.jsx';
import { Projects, ProjectDetail } from './pages/Projects.jsx';
import Gallery from './pages/Gallery.jsx';
import { Team, Testimonials, Blog, BlogDetail, Contact, Quote, FAQs, Privacy, Terms } from './pages/Misc.jsx';
import CmsPage from './pages/CmsPage.jsx';
import NotFound from './pages/NotFound.jsx';

const Admin = lazy(() => import('./admin/AdminApp.jsx')); // admin code is not shipped to public visitors

const ALIASES = ['residential-interiors', 'commercial-interiors', 'office-interiors', 'modular-kitchen', 'bedroom-design', 'living-room-design'];

export default function App() {
  return (
    <Routes>
      <Route path="/admin/*" element={<Suspense fallback={<div className="state">Loading admin…</div>}><Admin /></Suspense>} />
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="services" element={<Services />} />
        <Route path="services/:slug" element={<ServiceDetail />} />
        {ALIASES.map((s) => <Route key={s} path={s} element={<ServiceDetail slug={s} />} />)}
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:slug" element={<ProjectDetail />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="team" element={<Team />} />
        <Route path="testimonials" element={<Testimonials />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:slug" element={<BlogDetail />} />
        <Route path="contact" element={<Contact />} />
        <Route path="get-a-quote" element={<Quote />} />
        <Route path="faqs" element={<FAQs />} />
        <Route path="privacy-policy" element={<Privacy />} />
        <Route path="terms-and-conditions" element={<Terms />} />
        <Route path="p/:key" element={<CmsPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
