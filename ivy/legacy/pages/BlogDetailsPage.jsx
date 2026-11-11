import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link, useParams } from "react-router-dom";

function BlogDetailsPage() {
  const { postSlug } = useParams();

  const posts = {
    "how-to-plan-home-interior": {
      title: "How to Plan Your Home Interior",
      category: "Interior Design",
      date: "June 12, 2026",
      image:
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=85",
      paragraphs: [
        "Planning your home interior before starting the actual work can make the entire process easier. A clear plan helps you understand what you need, what style you prefer and how the space should work for your lifestyle.",
        "Start by understanding your daily requirements. Think about how each room will be used, how much storage you need and which furniture pieces are important to you.",
        "The next step is deciding on a general design direction. You do not need every detail figured out from the beginning. A simple idea about colours, materials and the overall feel can help guide the rest of the design.",
        "Finally, plan your budget and priorities. Spend more attention on elements that affect everyday use, such as storage, lighting, layout and quality materials.",
      ],
    },

    "modular-kitchen-planning-guide": {
      title: "A Simple Guide to Modular Kitchen Planning",
      category: "Kitchen",
      date: "May 28, 2026",
      image:
        "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1400&q=85",
      paragraphs: [
        "A modular kitchen should look good, but it also needs to work well every day. The layout, storage and working areas should be planned according to the way you actually use the kitchen.",
        "Start with the available space and understand where the main working areas will be placed. Good movement between the cooking, washing and storage areas can make the kitchen more comfortable.",
        "Storage is another important part of kitchen planning. Use cabinets and drawers according to the things you regularly need instead of simply adding as much storage as possible.",
        "Materials and hardware should also be selected carefully. Choose options that match your design while being practical for everyday use.",
      ],
    },

    "make-small-room-feel-bigger": {
      title: "How to Make a Small Room Feel Bigger",
      category: "Design Tips",
      date: "May 10, 2026",
      image:
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=85",
      paragraphs: [
        "Small rooms can still feel comfortable and stylish with the right planning. The goal is to use the available space efficiently without making it feel crowded.",
        "Keep the furniture proportionate to the room. Large furniture can quickly make a small room feel even smaller.",
        "Light colours, good lighting and mirrors can also help create a more open feeling. Storage should be planned carefully so that everyday items do not unnecessarily occupy visible space.",
        "Most importantly, avoid adding too many decorative elements. A simple and organised space often feels larger and more comfortable.",
      ],
    },
  };

  const post = posts[postSlug];

  if (!post) {
    return (
      <main className="min-h-screen bg-[#fffaf5] px-5 pb-20 pt-40">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-black text-slate-950">
            Article not found
          </h1>

          <Link
            to="/blog"
            className="mt-8 inline-flex rounded-full bg-slate-950 px-6 py-3.5 font-semibold text-white hover:bg-orange-500"
          >
            Back to Blog
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#fffaf5] pt-28">
      <article className="px-5 pb-24 pt-12 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-orange-500"
          >
            <ArrowLeft size={17} />
            Back to Blog
          </Link>

          <p className="mt-10 text-sm font-bold uppercase tracking-[0.2em] text-orange-500">
            {post.category}
          </p>

          <h1 className="mt-4 text-5xl font-black leading-tight text-slate-950 sm:text-6xl">
            {post.title}
          </h1>

          <p className="mt-5 text-sm text-slate-400">{post.date}</p>

          <div className="mt-10 overflow-hidden rounded-[2rem]">
            <img
              src={post.image}
              alt={post.title}
              className="h-[450px] w-full object-cover sm:h-[600px]"
            />
          </div>

          <div className="mt-12 space-y-6">
            {post.paragraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="text-base leading-8 text-slate-600 sm:text-lg"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </article>

      <section className="bg-slate-950 px-5 py-20 text-center text-white lg:px-8">
        <h2 className="text-4xl font-black sm:text-5xl">
          Need help with your interior?
        </h2>

        <Link
          to="/contact"
          className="mt-8 inline-flex items-center gap-3 rounded-full bg-orange-500 px-7 py-4 font-semibold hover:bg-orange-400"
        >
          Talk to Our Team
          <ArrowRight size={18} />
        </Link>
      </section>
    </main>
  );
}

export default BlogDetailsPage;