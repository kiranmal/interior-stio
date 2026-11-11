// Default content for a fresh database. Based on the original Ivy Interio content.
// Images are remote Unsplash URLs already used by the original project (see README: external assets).
const u = (id, w = 1400) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=85`;

export const settings = {
  siteName: 'Ivy Interio', tagline: 'Inspired by Living',
  phone: '9758887602', whatsapp: '9540937851', email: 'ivinterio@gmail.com',
  addressLine1: 'G16 Lotus Pond Market', addressLine2: 'Vaibhav Khand, Indirapuram', addressLine3: 'Ghaziabad – 201014',
  workingHours: 'Mon – Sat, 10:00 am – 7:00 pm', logo: '/images/ivy-interio-logo.jpg', favicon: '/images/ivy-interio-logo.jpg',
  footerText: 'Thoughtfully planned homes, offices and kitchens, designed and delivered in Delhi NCR.',
  defaultTitle: 'Ivy Interio | Interior Designers in Indirapuram, Ghaziabad',
  defaultDescription: 'Ivy Interio designs and builds residential, commercial and office interiors and modular kitchens in Indirapuram, Ghaziabad and Delhi NCR.',
};

const svc = (title, slug, order, description, image, bullets, body) => ({
  type: 'service', title, slug, order, description, image, tags: bullets, content: body, active: true,
});
export const services = [
  svc('Residential Interiors', 'residential-interiors', 1, 'Complete home interiors designed around your lifestyle, space and budget.', u('photo-1600210492486-724fe5c67fb0'),
    ['Full-home design', 'Space planning', 'Furniture and lighting', 'Material selection'],
    'A home should work for the people in it. We begin with how you live – mornings, guests, storage, light – and plan the layout, joinery, finishes and lighting as a single composition.\n\nYou receive a clear scope and estimate before work begins, and one team coordinates every trade on site until handover.'),
  svc('Commercial Interiors', 'commercial-interiors', 2, 'Functional, polished spaces for offices, studios, retail and commercial projects.', u('photo-1497366811353-6870744d04b2'),
    ['Retail and showrooms', 'Clinics and studios', 'Brand-led design', 'Phased execution'],
    'Commercial spaces carry a brand and a daily workload. We plan customer flow, back-of-house needs and durable finishes so the space looks considered and keeps working.'),
  svc('Office Interiors', 'office-interiors', 3, 'Workplaces with natural light, clear planning and flexible zones for focus and collaboration.', u('photo-1497366754035-f200968a6e72'),
    ['Workstation planning', 'Meeting and cabin zones', 'Acoustics and lighting', 'Reception and pantry'],
    'We design offices around how teams actually work: quiet focus areas, meeting rooms that are easy to book, and reception and pantry spaces that suit your culture.'),
  svc('Modular Kitchen', 'modular-kitchen', 4, 'Smart storage, practical layouts and refined finishes made for everyday living.', u('photo-1600566753190-17f0baa2a6c3'),
    ['L, U, parallel and island layouts', 'Soft-close hardware', 'Countertop and backsplash options', 'Appliance planning'],
    'A kitchen is planned in the work triangle first and styled second. We design storage for how you cook, choose durable carcasses and shutters, and detail the counter, backsplash and lighting together.'),
  svc('Bedroom Design', 'bedroom-design', 5, 'Calm, practical bedrooms with storage, lighting and finishes planned as one composition.', u('photo-1616486338812-3dadae4b4ace'),
    ['Wardrobes and dressing units', 'Bed back panels', 'Layered lighting', 'Soft furnishing'],
    'Bedrooms should settle you down. We combine concealed storage, warm layered lighting and a restrained palette so the room feels quiet from the first night.'),
  svc('Living Room Design', 'living-room-design', 6, 'Elegant living spaces that balance comfort, movement, lighting and personality.', u('photo-1600210491892-03d54c0aaf87'),
    ['TV units and feature walls', 'Seating layouts', 'False ceiling and lighting', 'Curtains and decor'],
    'The living room is where a home meets its guests. We balance seating, circulation, display and lighting so the room works for a quiet evening and a full house alike.'),
];

const proj = (title, slug, order, category, location, description, image, gallery, meta, content) => ({ type: 'project', title, slug, order, category, location, description, image, gallery, meta, content, active: true, featured: order <= 3 });
export const projects = [
  proj('Modern Living Room', 'modern-living-room', 1, 'Residential', 'Indirapuram', 'Warm textures, clean lines and layered lighting for everyday living.', u('photo-1600210492486-724fe5c67fb0'), [u('photo-1600210491892-03d54c0aaf87'), u('photo-1600607687939-ce8a6c25118c')], { year: '2024', area: '1,450 sq ft', duration: '45 days', style: 'Warm modern' }, 'The brief was a living space that felt calm but not plain. We layered walnut veneer, fluted panels and indirect lighting over a soft neutral base, and kept the seating plan open for guests.'),
  proj('Warm Modular Kitchen', 'warm-modular-kitchen', 2, 'Residential', 'Vaibhav Khand', 'Smart storage and a warm material palette built for daily use.', u('photo-1600566753190-17f0baa2a6c3'), [u('photo-1556912167-f556f1f39fdf')], { year: '2024', area: '160 sq ft', duration: '30 days', style: 'Warm contemporary' }, 'A parallel kitchen with full-height storage, a breakfast ledge and a stone backsplash chosen to hide daily wear.'),
  proj('Contemporary Workspace', 'contemporary-workspace', 3, 'Commercial', 'Ghaziabad', 'A focused workplace with natural light, clean planning and flexible zones.', u('photo-1497366811353-6870744d04b2'), [u('photo-1497366754035-f200968a6e72')], { year: '2023', area: '2,800 sq ft', duration: '60 days', style: 'Contemporary' }, 'Open workstations sit along the windows, with enclosed cabins and a meeting suite at the core to keep noise away from focus areas.'),
  proj('Quiet Bedroom Suite', 'quiet-bedroom-suite', 4, 'Residential', 'Noida', 'Soft neutrals, concealed storage and a calm evening lighting scheme.', u('photo-1616486338812-3dadae4b4ace'), [u('photo-1618221195710-dd6b41faaea6')], { year: '2024', area: '320 sq ft', duration: '25 days', style: 'Soft minimal' }, 'A master suite with a upholstered headboard wall, concealed wardrobes and warm lighting at three levels.'),
];

const gal = (title, category, order, image) => ({ type: 'gallery', title, category, order, image, active: true });
export const gallery = [
  gal('Living Room', 'Living', 1, u('photo-1600210491892-03d54c0aaf87', 1200)), gal('Kitchen', 'Kitchen', 2, u('photo-1556912167-f556f1f39fdf', 1200)),
  gal('Bedroom', 'Bedroom', 3, u('photo-1618221195710-dd6b41faaea6', 1200)), gal('Workspace', 'Office', 4, u('photo-1497366754035-f200968a6e72', 1200)),
  gal('Dining', 'Dining', 5, u('photo-1600607687939-ce8a6c25118c', 1200)), gal('Master Suite', 'Bedroom', 6, u('photo-1616486338812-3dadae4b4ace', 1200)),
];

export const testimonials = [
  { type: 'testimonial', title: "Vikram Singh", description: "We wanted custom textures and flawless wall finishes for our living room and master suite. Their crew treated the walls with meticulous surface scraping, putty layering, and primer before applying the final coats. The lighting catches the textures exactly as promised, and visitors compliment the finish constantly.", meta: {}, order: 1, active: true },
  { type: 'testimonial', title: "Vikram K.", description: "The team completely revitalized our wooden door frames, custom paneling, and cabinetry. The wood polishing work brought out rich natural grains without uneven tones or overspray onto the walls. Professional, polite, and exceptionally skilled craftsmen.", meta: { role: "Custom Joinery & Polishing" }, order: 2, active: true },
  { type: 'testimonial', title: "Ananya D.", description: "We needed high-durability finishes and clean execution within a tight timeline before our office launch. The team managed the crew efficiently, adhered strictly to building guidelines, and delivered a sharp, contemporary look that elevated our entire workspace.", meta: { role: "Commercial / Executive Space Execution" }, order: 3, active: true },
  { type: 'testimonial', title: "Rajesh & Meera S.", description: "Handing over our entire home for a complete overhaul felt daunting, but the team ran the project with precision. From the initial layout planning down to the electrical fixtures and ceiling details, everything aligned with the 3D renders. Most importantly, they stuck strictly to our 6-week timeline and handed over the flat spotless.", meta: { role: "Complete 3 BHK Interior Renovation, Indirapuram" }, order: 4, active: true },
  { type: 'testimonial', title: "Sunita & Vivek Aggarwal", description: "We remodeled our kitchen and added customized wall-to-wall wardrobes across two rooms. The hardware alignment is seamless, soft-close hinges feel solid, and the laminate finishes are cut razor-sharp without rough edges. They turned dead corners into practical storage that looks straight out of a design magazine.", meta: { role: "Kitchen & Storage Remodel, Preet Vihar" }, order: 5, active: true },
  { type: 'testimonial', title: "Sandeep Singhal", description: "We had a strict 18-day window to complete the interior finishing and acoustics for our design studio before client walkthroughs began. The crew managed the shifts effortlessly, kept noise within building compliance, and delivered a clean, contemporary finish right on schedule. Exceptional professional discipline.", meta: { role: "Fast-Track Commercial Office Fit-Out" }, order: 6, active: true },
];

const post = (title, slug, order, category, description, content, image, readTime) => ({ type: 'blog', title, slug, order, category, description, content, image, tags: [category], author: 'Ivy Interio', meta: { readTime }, publishedAt: new Date(Date.now() - order * 864e5 * 7), active: true });
export const blog = [
  post('How to plan a modern home interior', 'how-to-plan-a-modern-home-interior', 1, 'Planning', 'A practical guide to space planning, materials, lighting and budgeting before you begin.', 'Start with how you live, not with a mood board.\n\nList the rooms you use daily and what each must do. Then fix the budget range and a realistic timeline, because both decide which materials and finishes are possible.\n\nPlan the layout and storage first, lighting second and decor last. Decisions made in that order rarely need to be undone on site.', u('photo-1600210491892-03d54c0aaf87'), '5 min read'),
  post('Kitchen storage ideas that actually work', 'kitchen-storage-ideas-that-actually-work', 2, 'Kitchen', 'Simple planning principles that make a modular kitchen more comfortable every day.', 'Store things where you first use them: pans near the hob, spices within an arm\'s reach, and everyday plates close to the dishwasher or sink.\n\nDeep drawers beat deep shelves, tall units should hold the least-used items, and a few open inches near the counter keep the working surface clear.', u('photo-1556912167-f556f1f39fdf'), '4 min read'),
  post('Warm minimalism for Indian homes', 'warm-minimalism-for-indian-homes', 3, 'Style', 'How to combine neutral colours, wood, texture and lighting without making a space feel flat.', 'Warm minimalism keeps the palette quiet and lets texture do the work: timber grain, linen, stone and handmade ceramics.\n\nUse three light levels – ambient, task and accent – so the room changes character from morning to night.', u('photo-1618221195710-dd6b41faaea6'), '6 min read'),
];

const member = (title, role, order, image, description) => ({ type: 'team', title, order, image, description, meta: { role }, active: true });
export const team = [
  member("Saurabh Kumar", "Director – Design & Build", 1, '', ''),
  member("Tabish Zaidi", "Director – Design & Build", 2, '', ''),
  member("Ar. Mohd Danish", "Architect", 3, '', ''),
  member("Shravan Kumar", "Design and Project Lead", 4, '', ''),
  member("Rizwan Khan", "Design and Project Lead", 5, '', ''),
];

const faq = (q, a, order) => ({ type: 'faq', title: q, description: a, order, active: true });
export const faqs = [
  faq('How does the interior design process work?', 'We start with a consultation to understand your requirements, budget and preferences. After that, our team works on the design, planning, execution and final handover.', 1),
  faq('Do you provide complete home interiors?', 'Yes. We can work on complete home interiors as well as individual spaces such as living rooms, bedrooms, kitchens and other areas.', 2),
  faq('Can I share my own design ideas?', 'Absolutely. Your ideas and preferences are an important part of the design process. We work with you to turn those ideas into a practical interior.', 3),
  faq('How long does an interior project take?', 'The timeline depends on the size and scope of the project. After understanding your requirements, we provide a clear estimated timeline.', 4),
  faq('Can I get a consultation before starting?', 'Yes. You can contact us through the enquiry form and our team will get in touch to discuss your project.', 5),
  faq('Do you handle project execution?', 'Yes. Depending on the project, our team can support planning, material coordination, execution and final finishing.', 6),
  faq('Do you provide modular kitchen design?', 'Yes. We design modular kitchens based on the available space, storage requirements, preferred materials and overall home style.', 7),
  faq('How can I start a project with Ivy Interio?', 'Contact us through the enquiry form. Share some basic information about your project and our team will get in touch.', 8),
];

const banner = (title, description, order, image, ctaLabel, ctaUrl) => ({ type: 'banner', title, description, order, image, meta: { ctaLabel, ctaUrl }, active: true });
export const banners = [
  banner('Homes that are calm to live in', 'Residential interiors planned around how you actually live – from first sketch to handover.', 1, u('photo-1600210492486-724fe5c67fb0', 2000), 'Plan your home', '/get-a-quote'),
  banner('Kitchens built for daily use', 'Modular kitchens with storage, finishes and lighting designed as one system.', 2, u('photo-1600566753190-17f0baa2a6c3', 2000), 'See kitchens', '/modular-kitchen'),
  banner('Workplaces with a clear head', 'Offices and commercial interiors that balance brand, flow and durability.', 3, u('photo-1497366811353-6870744d04b2', 2000), 'Commercial work', '/commercial-interiors'),
];

export const homePage = {
  key: 'home', title: 'Home', status: 'published',
  sections: [
    { id: 'hero', type: 'hero', heading: 'Interiors inspired by the way you live', subheading: 'Interior designers in Indirapuram, Ghaziabad – homes, kitchens and workplaces planned and delivered end to end.', ctaLabel: 'Get a free quote', ctaUrl: '/get-a-quote', visible: true },
    { id: 'intro', type: 'intro', heading: 'A studio that plans before it decorates', body: 'At Ivy Interio, we turn bare walls and blueprints into thoughtfully crafted living and working spaces.\n\nSince 2022, we have been delivering proven excellence in complete civil and structural construction, serving commercial establishments, government contracts, and residential developments. Expanding on that foundation, we launched our full-service turnkey interior division in 2024 to provide an effortless, stress-free transformation journey.\n\nWe believe great design shouldn\'t be complicated or overpriced. With comprehensive 2D floor plans, photorealistic 3D designs, and meticulous project management, we bring your vision to life on time, within budget, and without the coordination headaches.', image: u('photo-1600607687939-ce8a6c25118c', 1200), ctaLabel: 'About the studio', ctaUrl: '/about', visible: true },
    { id: 'services', type: 'services', heading: 'What we design', subheading: 'From a single kitchen to a complete home or office.', visible: true },
    { id: 'projects', type: 'projects', heading: 'Selected projects', subheading: 'Recent homes and workplaces across Delhi NCR.', visible: true },
    { id: 'process', type: 'process', heading: 'How a project runs', visible: true },
    { id: 'testimonials', type: 'testimonials', heading: 'Kind words from clients', visible: true },
    { id: 'blog', type: 'blog', heading: 'Notes from the studio', visible: true },
    { id: 'cta', type: 'cta', heading: 'Planning a new space?', body: 'Tell us about your home or office and we will get back with a clear first plan and estimate.', ctaLabel: 'Request a quote', ctaUrl: '/get-a-quote', visible: true },
  ],
};
