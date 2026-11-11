import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

function BlogPage() {
  const posts = [
    {
      slug: "how-to-plan-home-interior",
      title: "How to Plan Your Home Interior",
      category: "Interior Design",
      date: "June 12, 2026",
      image:
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85",
      description:
        "A simple guide to planning your home interior before starting the actual work.",
    },
    {
      slug: "modular-kitchen-planning-guide",
      title: "A Simple Guide to Modular Kitchen Planning",
      category: "Kitchen",
      date: "May 28, 2026",
      image:
        "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=85",
      description:
        "Things to consider when planning the layout, storage and materials for a modular kitchen.",
    },
    {
      slug: "make-small-room-feel-bigger",
      title: "How to Make a Small Room Feel Bigger",
      category: "Design Tips",
      date: "May 10, 2026",
      image:
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85",
      description:
        "Practical interior design ideas that can help small spaces feel more open and comfortable.",
    },
    {
      slug: "choosing-right-interior-colours",
      title: "Choosing the Right Colours for Your Interior",
      category: "Design Tips",
      date: "April 22, 2026",
      image:
        "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85",
      description:
        "Understand how colours can change the feel and appearance of different rooms.",
    },
    {
      slug: "office-interior-planning",
      title: "Important Things to Consider in Office Interiors",
      category: "Office",
      date: "April 8, 2026",
      image:
        "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=85",
      description:
        "Useful planning ideas for creating a comfortable and productive office environment.",
    },
    {
      slug: "interior-budget-planning",
      title: "How to Plan an Interior Design Budget",
      category: "Planning",
      date: "March 25, 2026",
      image:
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85",
      description:
        "A practical starting point for understanding and planning your interior project budget.",
    },
  ];

  return (
    <main className="bg-[#fffaf5] pt-28">
      <section className="px-5 pb-16 pt-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-500">
            INARA Journal
          </p>

          <h1 className="mt-4 max-w-3xl text-5xl font-black leading-tight text-slate-950 sm:text-6xl">
            Ideas, inspiration
            <span className="text-orange-500"> and design tips.</span>
          </h1>

          <p className="mt-6 max-w-2xl leading-8 text-slate-600">
            Helpful interior design ideas to help you plan, style and improve
            your space.
          </p>
        </div>
      </section>

      <section className="bg-white px-5 py-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="group overflow-hidden rounded-3xl border border-slate-200 bg-[#fffaf5] transition duration-500 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="h-64 w-full object-cover transition duration-700 group-hover:scale-105"
                />
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-orange-500">
                    {post.category}
                  </p>

                  <p className="text-xs text-slate-400">{post.date}</p>
                </div>

                <h2 className="mt-4 text-xl font-bold leading-7 text-slate-950">
                  {post.title}
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {post.description}
                </p>

                <Link
                  to={`/blog/${post.slug}`}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-slate-900 transition hover:text-orange-500"
                >
                  Read Article
                  <ArrowUpRight size={17} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default BlogPage;