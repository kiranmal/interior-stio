function Stats() {
  const stats = [
    {
      value: "10+",
      label: "Years Experience",
    },
    {
      value: "250+",
      label: "Projects Completed",
    },
    {
      value: "100+",
      label: "Happy Clients",
    },
    {
      value: "15+",
      label: "Design Professionals",
    },
  ];

  return (
    <section className="bg-[#fffaf5] px-5 py-16 lg:px-8">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-5 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-slate-200 bg-white p-6 text-center transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg"
          >
            <h3 className="text-3xl font-black text-slate-950 sm:text-4xl">
              {stat.value}
            </h3>

            <p className="mt-2 text-sm text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Stats;