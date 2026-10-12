import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

function TeamPage() {
  const team = [
    {
      name: "Aarav Mehta",
      role: "Creative Director",
      image:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=85",
    },
    {
      name: "Riya Kapoor",
      role: "Senior Interior Designer",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=85",
    },
    {
      name: "Karan Malhotra",
      role: "Project Manager",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=85",
    },
    {
      name: "Ananya Sharma",
      role: "Interior Designer",
      image:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=85",
    },
  ];

  return (
    <main className="bg-[#fffaf5] pt-28">
      <section className="px-5 pb-16 pt-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-500">
            Our Team
          </p>

          <h1 className="mt-4 max-w-3xl text-5xl font-black leading-tight text-slate-950 sm:text-6xl">
            Meet the people behind
            <span className="text-orange-500"> INARA.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
            Our designers and project professionals work together to turn ideas
            into comfortable, practical and beautiful spaces.
          </p>
        </div>
      </section>

      <section className="bg-white px-5 py-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member) => (
            <div
              key={member.name}
              className="group overflow-hidden rounded-3xl border border-slate-200 bg-white transition duration-500 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="h-[380px] w-full object-cover transition duration-700 group-hover:scale-105"
                />
              </div>

              <div className="p-6">
                <h2 className="text-xl font-bold text-slate-950">
                  {member.name}
                </h2>

                <p className="mt-1 text-sm text-orange-500">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-950 px-5 py-20 text-center text-white lg:px-8">
        <h2 className="text-4xl font-black sm:text-5xl">
          Let's work together.
        </h2>

        <p className="mx-auto mt-5 max-w-2xl leading-7 text-white/60">
          Have an interior project in mind? Talk to our team and let's turn
          your ideas into a beautiful space.
        </p>

        <Link
          to="/contact"
          className="mt-8 inline-flex items-center gap-3 rounded-full bg-orange-500 px-7 py-4 font-semibold hover:bg-orange-400"
        >
          Contact Us
          <ArrowRight size={18} />
        </Link>
      </section>
    </main>
  );
}

export default TeamPage;