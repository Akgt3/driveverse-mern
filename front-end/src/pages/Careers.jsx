export default function Careers() {
  const jobs = [
    {
      title: "Frontend Engineer",
      team: "Engineering",
      location: "Remote · India",
      type: "Full-time",
      level: "Mid–Senior",
      description:
        "Build refined, high-performance interfaces using React, Tailwind, and modern frontend tooling.",
    },
    {
      title: "UI / UX Designer",
      team: "Design",
      location: "Bangalore · Hybrid",
      type: "Full-time",
      level: "Mid-level",
      description:
        "Design elegant, minimal interfaces focused on clarity, usability, and premium automotive aesthetics.",
    },
    {
      title: "Full Stack Developer",
      team: "Engineering",
      location: "Remote",
      type: "Full-time",
      level: "Senior",
      description:
        "Work across frontend and backend to build scalable features and internal tools.",
    },
    {
      title: "Content & Editorial Lead",
      team: "Content",
      location: "Mumbai",
      type: "Contract",
      level: "Experienced",
      description:
        "Curate automotive stories, reviews, and editorial content for a global audience.",
    },
    {
      title: "Digital Marketing Specialist",
      team: "Marketing",
      location: "Remote",
      type: "Full-time",
      level: "Mid-level",
      description:
        "Drive brand growth through performance marketing, SEO, and campaign strategy.",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A] transition-colors pt-18">

      {/* HERO */}
      <section className="border-b border-gray-200 dark:border-[#333333]">
        <div className="max-w-[1200px] mx-auto px-6 py-24">
          <h1 className="text-[42px] sm:text-[52px] font-semibold text-black dark:text-white">
            Careers
          </h1>
          <p className="mt-4 max-w-[560px] text-[16px] text-gray-600 dark:text-gray-400 leading-relaxed">
            We build calm, trustworthy automotive experiences.
            Join a team that values clarity, craft, and long-term thinking.
          </p>
        </div>
      </section>

      {/* JOB LIST */}
      <section>
        <div className="max-w-[1200px] mx-auto px-6 py-16 space-y-6">

          {jobs.map((job, index) => (
            <div
              key={index}
              className="
                group
                border border-gray-200 dark:border-[#333333]
                rounded-xl
                p-6
                hover:border-black dark:hover:border-white
                transition
              "
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

                {/* LEFT */}
                <div>
                  <h3 className="text-[20px] font-medium text-black dark:text-white">
                    {job.title}
                  </h3>

                  <p className="mt-2 text-[14px] text-gray-600 dark:text-gray-400 max-w-[560px]">
                    {job.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3 text-[12px] text-gray-500 dark:text-gray-400">
                    <span>{job.team}</span>
                    <span>•</span>
                    <span>{job.level}</span>
                    <span>•</span>
                    <span>{job.location}</span>
                    <span>•</span>
                    <span>{job.type}</span>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex-shrink-0">
                  <button
                    className="
                      px-6 h-[42px]
                      border border-black dark:border-white
                      text-black dark:text-white
                      rounded-lg
                      hover:bg-black hover:text-white
                      dark:hover:bg-white dark:hover:text-black
                      transition
                    "
                  >
                    View Role
                  </button>
                </div>

              </div>
            </div>
          ))}

        </div>
      </section>

      {/* FOOT NOTE */}
      <section className="border-t border-gray-200 dark:border-[#333333]">
        <div className="max-w-[1200px] mx-auto px-6 py-12">
          <p className="text-[14px] text-gray-500 dark:text-gray-400 max-w-[640px]">
            We’re a focused team. Roles open based on real needs —
            not volume hiring. If a position is listed here, it’s active.
          </p>
        </div>
      </section>

    </div>
  );
}
