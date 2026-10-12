function Team() {
  const team = [
    {
      name: "Aarav Mehta",
      role: "Creative Director",
      image:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=700&q=85",
    },
    {
      name: "Riya Kapoor",
      role: "Senior Interior Designer",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=700&q=85",
    },
    {
      name: "Karan Malhotra",
      role: "Project Manager",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=85",
    },
  ];

  return (
    <section className="bg-[#fffaf5] px-5 py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-orange-500">
            Our Team
          </p>

          <h2 className="text-4xl font-black text-slate-950 sm:text-5xl">
            People behind
            <span className="text-orange-500"> the spaces.</span>
          </h2>

          <p className="mt-5 leading-7 text-slate-600">
            A team of designers and project professionals working together to
            turn ideas into thoughtfully designed interiors.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((member) => (
            <div
              key={member.name}
              className="group overflow-hidden rounded-3xl bg-white shadow-sm transition duration-500 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="h-[390px] w-full object-cover transition duration-700 group-hover:scale-105"
                />
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-950">
                  {member.name}
                </h3>

                <p className="mt-1 text-sm text-orange-500">
                  {member.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Team;