// Declarative field definitions that drive the generic content editor.
// kind: text | textarea | long | image | gallery | tags | number | date | meta-text | meta-number
export const TYPES = {
  banner: { label: 'Banner', plural: 'Banners', primary: 'Heading', secondary: (i) => i.meta?.ctaLabel || '', hint: 'Hero slides on the homepage.',
    fields: [['title', 'Heading', 'text', { required: true }], ['description', 'Subtitle', 'textarea'], ['image', 'Banner image', 'image', { required: true }], ['ctaLabel', 'Button label', 'meta-text'], ['ctaUrl', 'Button link (/path or https://…)', 'meta-text'], ['order', 'Display order', 'number']] },
  service: { label: 'Service', plural: 'Services', primary: 'Title', slug: true, secondary: (i) => i.slug || '', hint: 'Shown on the services pages and homepage.',
    fields: [['title', 'Title', 'text', { required: true }], ['slug', 'URL slug', 'text', { help: 'Leave empty to generate from the title.' }], ['description', 'Short description', 'textarea'], ['content', 'Detail page content', 'long', { help: 'Separate paragraphs with a blank line.' }], ['image', 'Image', 'image'], ['tags', 'Included items (comma separated)', 'tags'], ['order', 'Display order', 'number']] },
  project: { label: 'Project', plural: 'Projects', primary: 'Title', slug: true, secondary: (i) => [i.category, i.location].filter(Boolean).join(', '), hint: 'Portfolio entries with their own detail page.',
    fields: [['title', 'Title', 'text', { required: true }], ['slug', 'URL slug', 'text'], ['category', 'Category (e.g. Residential)', 'text'], ['location', 'Location', 'text'], ['description', 'Summary', 'textarea'], ['content', 'Project story', 'long'], ['image', 'Featured image', 'image', { required: true }], ['gallery', 'Gallery image URLs (one per line)', 'gallery'], ['year', 'Year', 'meta-text'], ['area', 'Area', 'meta-text'], ['duration', 'Duration', 'meta-text'], ['style', 'Style', 'meta-text'], ['featured', 'Feature on homepage', 'check'], ['order', 'Display order', 'number']] },
  gallery: { label: 'Gallery image', plural: 'Gallery', primary: 'Caption', secondary: (i) => i.category || '', hint: 'Images in the public gallery.',
    fields: [['title', 'Caption', 'text', { required: true }], ['category', 'Category (e.g. Kitchen)', 'text'], ['image', 'Image', 'image', { required: true }], ['order', 'Display order', 'number']] },
  testimonial: { label: 'Testimonial', plural: 'Testimonials', primary: 'Client', secondary: (i) => i.meta?.role || '', hint: 'Client reviews.',
    fields: [['title', 'Client name', 'text', { required: true }], ['role', 'Role (e.g. Homeowner)', 'meta-text'], ['rating', 'Rating (1–5)', 'meta-number', { min: 1, max: 5 }], ['description', 'Review', 'textarea', { required: true }], ['image', 'Photo (optional)', 'image'], ['order', 'Display order', 'number']] },
  blog: { label: 'Article', plural: 'Blog', primary: 'Title', slug: true, secondary: (i) => i.category || '', hint: 'Journal articles. Drafts and future-dated posts are not public.',
    fields: [['title', 'Title', 'text', { required: true }], ['slug', 'URL slug', 'text'], ['category', 'Category', 'text'], ['author', 'Author', 'text'], ['tags', 'Tags (comma separated)', 'tags'], ['description', 'Excerpt', 'textarea'], ['content', 'Article body', 'long'], ['image', 'Featured image', 'image'], ['readTime', 'Read time (e.g. 5 min read)', 'meta-text'], ['publishedAt', 'Publish date', 'date']] },
  team: { label: 'Team member', plural: 'Team', primary: 'Name', secondary: (i) => i.meta?.role || '', hint: 'People shown on the team page.',
    fields: [['title', 'Name', 'text', { required: true }], ['role', 'Role', 'meta-text'], ['description', 'Short bio', 'textarea'], ['image', 'Photo', 'image'], ['order', 'Display order', 'number']] },
  faq: { label: 'FAQ', plural: 'FAQs', primary: 'Question', secondary: () => '', hint: 'Questions shown on the FAQ page.',
    fields: [['title', 'Question', 'text', { required: true }], ['description', 'Answer', 'textarea', { required: true }], ['order', 'Display order', 'number']] },
};
export const SEO_TYPES = ['service', 'project', 'blog'];
