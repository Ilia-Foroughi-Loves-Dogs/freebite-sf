import { resources } from "@/data/resources";

const categoryCards = [
  {
    title: "Free groceries",
    description:
      "Food banks, produce pop-ups, and pantry pickups for households across the city.",
  },
  {
    title: "Free hot meals",
    description:
      "Daily and weekly meal programs offering ready-to-eat breakfast, lunch, and dinner.",
  },
  {
    title: "Community fridges",
    description:
      "Neighborhood mutual-aid fridges with grab-and-go food and pantry basics.",
  },
  {
    title: "Student resources",
    description:
      "Campus-based support for students navigating food insecurity and basic needs.",
  },
] as const;

const categoryClasses: Record<string, string> = {
  "Free groceries": "bg-emerald-400/15 text-emerald-200 ring-emerald-400/30",
  "Free hot meals": "bg-amber-400/15 text-amber-200 ring-amber-400/30",
  "Community fridge": "bg-sky-400/15 text-sky-200 ring-sky-400/30",
  "Student food resource": "bg-fuchsia-400/15 text-fuchsia-200 ring-fuchsia-400/30",
};

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 -z-10 h-[28rem] bg-[radial-gradient(circle_at_top,rgba(150,242,215,0.2),transparent_42%)]" />

      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 pb-16 pt-8 sm:px-10 lg:px-12">
        <header className="flex items-center justify-between border-b border-line/80 pb-5">
          <div>
            <p className="font-display text-xl font-bold tracking-tight text-white">
              FreeBite SF
            </p>
            <p className="mt-1 text-sm text-muted">
              Free and low-cost food support across San Francisco.
            </p>
          </div>
          <a
            href="#submit-resource"
            className="rounded-full border border-white/15 bg-white/6 px-4 py-2 text-sm font-medium text-white shadow-[0_0_0_1px_rgba(255,255,255,0.02)] hover:-translate-y-0.5 hover:border-accent/50 hover:bg-accent/10"
          >
            Submit a resource
          </a>
        </header>

        <section className="grid gap-10 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-sm text-accent-strong shadow-[0_0_30px_var(--glow)]">
              Updated community food access directory
            </div>
            <h1 className="mt-6 max-w-3xl font-display text-5xl font-bold tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
              Find free and cheap food near you.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              FreeBite SF lists food pantries, free meals, community fridges,
              student resources, and low-cost food options in San Francisco so
              it is easier to find support close to home.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#resources"
                className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-slate-950 shadow-[0_16px_40px_rgba(73,220,177,0.25)] hover:-translate-y-0.5 hover:bg-accent-strong"
              >
                Browse resources
              </a>
              <a
                href="#categories"
                className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white hover:-translate-y-0.5 hover:border-white/35 hover:bg-white/6"
              >
                Explore categories
              </a>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-panel-strong p-6 shadow-[0_24px_80px_rgba(3,8,17,0.45)] backdrop-blur">
            <div className="grid gap-4 sm:grid-cols-2">
              {categoryCards.map((card) => (
                <article
                  key={card.title}
                  className="rounded-3xl border border-white/8 bg-white/5 p-5"
                >
                  <p className="text-sm uppercase tracking-[0.24em] text-accent-strong/80">
                    Category
                  </p>
                  <h2 className="mt-4 font-display text-2xl font-semibold text-white">
                    {card.title}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    {card.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="categories" className="pt-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-accent-strong/80">
                Categories
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-white">
                Built for the most common food support needs
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-muted">
              Start with groceries, meals, fridges, or campus support and then
              scan the full directory for details.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {categoryCards.map((card, index) => (
              <article
                key={card.title}
                className="rounded-[1.75rem] border border-white/8 bg-panel p-6 shadow-[0_18px_48px_rgba(0,0,0,0.2)] backdrop-blur"
              >
                <p className="text-sm text-muted">0{index + 1}</p>
                <h3 className="mt-5 font-display text-2xl font-semibold text-white">
                  {card.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  {card.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section id="resources" className="pt-20">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-accent-strong/80">
                Resources
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-white">
                Sample places to start in San Francisco
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-muted">
              Every card includes the essentials: location, hours, cost,
              eligibility, verification date, and quick links for the official
              site or directions.
            </p>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {resources.map((resource) => (
              <article
                key={resource.name}
                className="rounded-[1.75rem] border border-white/8 bg-panel p-6 shadow-[0_18px_48px_rgba(0,0,0,0.22)] backdrop-blur"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-2xl font-semibold text-white">
                      {resource.name}
                    </h3>
                    <p className="mt-2 text-sm text-slate-300">
                      {resource.address}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
                      categoryClasses[resource.category]
                    }`}
                  >
                    {resource.category}
                  </span>
                </div>

                <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
                    <dt className="text-xs uppercase tracking-[0.2em] text-muted">
                      Neighborhood
                    </dt>
                    <dd className="mt-2 text-sm font-medium text-white">
                      {resource.neighborhood}
                    </dd>
                  </div>
                  <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
                    <dt className="text-xs uppercase tracking-[0.2em] text-muted">
                      Hours
                    </dt>
                    <dd className="mt-2 text-sm font-medium text-white">
                      {resource.hours}
                    </dd>
                  </div>
                  <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
                    <dt className="text-xs uppercase tracking-[0.2em] text-muted">
                      Cost
                    </dt>
                    <dd className="mt-2 text-sm font-medium text-white">
                      {resource.cost}
                    </dd>
                  </div>
                  <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
                    <dt className="text-xs uppercase tracking-[0.2em] text-muted">
                      Eligibility
                    </dt>
                    <dd className="mt-2 text-sm font-medium text-white">
                      {resource.eligibility}
                    </dd>
                  </div>
                </dl>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/8 pt-5">
                  <p className="text-sm text-muted">
                    Last verified:{" "}
                    <span className="font-medium text-slate-200">
                      {resource.lastVerified}
                    </span>
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href={resource.website}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 hover:-translate-y-0.5"
                    >
                      Website
                    </a>
                    <a
                      href={resource.directionsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white hover:-translate-y-0.5 hover:border-accent/50 hover:bg-accent/10"
                    >
                      Directions
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          id="submit-resource"
          className="mt-20 rounded-[2rem] border border-accent/20 bg-[linear-gradient(135deg,rgba(73,220,177,0.12),rgba(255,255,255,0.04))] p-8 shadow-[0_24px_72px_rgba(0,0,0,0.2)]"
        >
          <p className="text-sm uppercase tracking-[0.28em] text-accent-strong/80">
            Submit a resource
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-white">
            Help keep the directory current
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-8 text-slate-200">
            Resource submission form coming soon. In the next version, FreeBite
            SF will let community members suggest new food programs and flag
            outdated listings.
          </p>
        </section>
      </section>
    </main>
  );
}
