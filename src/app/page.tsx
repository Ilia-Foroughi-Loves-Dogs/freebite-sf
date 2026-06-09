import { CategoryCard } from "@/components/category-card";
import { ArrowIcon, LocationIcon } from "@/components/icons";
import { ResourceCard } from "@/components/resource-card";
import { resources } from "@/data/resources";

const categories = [
  {
    title: "Free groceries",
    icon: "◫",
    description: "Pantries and grocery pickup programs across San Francisco.",
  },
  {
    title: "Free hot meals",
    icon: "○",
    description: "Ready-to-eat meals served by trusted community organizations.",
  },
  {
    title: "Community fridges",
    icon: "□",
    description: "Neighborhood fridges offering free, community-shared food.",
  },
  {
    title: "Student resources",
    icon: "◇",
    description: "Campus food support and basic-needs programs for students.",
  },
] as const;

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#07110e]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[760px] bg-[radial-gradient(circle_at_75%_8%,rgba(52,211,153,0.15),transparent_31%),radial-gradient(circle_at_8%_24%,rgba(16,185,129,0.08),transparent_25%)]" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <header className="flex h-20 items-center justify-between border-b border-white/10">
          <a className="flex items-center gap-3" href="#">
            <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-300 text-[#07110e]">
              <LocationIcon className="size-5" />
            </span>
            <span className="font-display text-lg font-bold tracking-tight text-white">
              FreeBite <span className="text-emerald-300">SF</span>
            </span>
          </a>
          <nav className="hidden items-center gap-7 text-sm text-slate-400 sm:flex">
            <a className="hover:text-white" href="#categories">
              Categories
            </a>
            <a className="hover:text-white" href="#resources">
              Resources
            </a>
            <a
              className="rounded-xl border border-white/15 px-4 py-2.5 font-semibold text-white hover:border-emerald-300/50 hover:bg-white/5"
              href="#submit-resource"
            >
              Submit resource
            </a>
          </nav>
        </header>

        <section className="grid min-h-[660px] items-center gap-12 py-20 lg:grid-cols-[1.15fr_0.85fr] lg:py-24">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/[0.07] px-3 py-1.5 text-xs font-medium text-emerald-200">
              <span className="size-1.5 rounded-full bg-emerald-300" />
              Food support across San Francisco
            </div>
            <h1 className="mt-7 max-w-4xl font-display text-5xl font-bold leading-[1.04] tracking-[-0.045em] text-white sm:text-6xl lg:text-7xl">
              Find free and cheap food{" "}
              <span className="text-emerald-300">near you.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-400">
              Search food pantries, free meals, community fridges, student
              resources, and low-cost food options in San Francisco.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-300 px-5 py-3.5 font-semibold text-[#07110e] shadow-[0_14px_40px_rgba(52,211,153,0.18)] hover:-translate-y-0.5 hover:bg-emerald-200"
                href="#resources"
              >
                Find food
                <ArrowIcon />
              </a>
              <a
                className="inline-flex items-center justify-center rounded-xl border border-white/15 px-5 py-3.5 font-semibold text-white hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/5"
                href="#submit-resource"
              >
                Submit resource
              </a>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm text-slate-500">
              <span>
                <strong className="text-white">{resources.length}</strong>{" "}
                starter resources
              </span>
              <span>
                <strong className="text-white">4</strong> categories
              </span>
              <span>
                <strong className="text-white">Free</strong> to use
              </span>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="absolute -inset-12 rounded-full bg-emerald-300/10 blur-3xl" />
            <div className="relative rotate-2 rounded-[2rem] border border-white/10 bg-[#101a18]/90 p-5 shadow-2xl backdrop-blur">
              <div className="rounded-2xl border border-white/10 bg-[#0b1512] p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">
                      Nearby today
                    </p>
                    <h2 className="mt-2 font-display text-xl font-semibold">
                      Food support in your city
                    </h2>
                  </div>
                  <span className="flex size-10 items-center justify-center rounded-full bg-emerald-300/10 text-emerald-300">
                    <LocationIcon />
                  </span>
                </div>
                <div className="relative mt-6 h-56 overflow-hidden rounded-xl bg-[#13241e]">
                  <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(110,231,183,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(110,231,183,.18)_1px,transparent_1px)] [background-size:34px_34px]" />
                  {[
                    "left-[24%] top-[30%]",
                    "left-[62%] top-[22%]",
                    "left-[47%] top-[61%]",
                    "left-[76%] top-[68%]",
                  ].map((position) => (
                    <span
                      className={`absolute ${position} flex size-9 items-center justify-center rounded-full border-4 border-[#13241e] bg-emerald-300 text-[#07110e] shadow-lg`}
                      key={position}
                    >
                      <LocationIcon className="size-4" />
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between rounded-xl bg-white/[0.04] p-4">
                  <div>
                    <p className="text-sm font-medium text-white">
                      Community resources
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Verified listings around San Francisco
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-emerald-300">
                    View all
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section
        className="border-y border-white/10 bg-white/[0.02] py-20"
        id="categories"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <p className="text-sm font-semibold text-emerald-300">Browse by need</p>
          <div className="mt-3 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <h2 className="max-w-xl font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Food support for every situation
            </h2>
            <p className="max-w-md text-sm leading-6 text-slate-400">
              Start with the type of support you need. Every listing includes
              current details and direct links.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <CategoryCard key={category.title} {...category} />
            ))}
          </div>
        </div>
      </section>

      <section
        className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-10"
        id="resources"
      >
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold text-emerald-300">
              Verified resources
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Places to get food in SF
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-slate-400">
            Always check the organization&apos;s website before visiting.
            Hours and availability can change.
          </p>
        </div>
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {resources.map((resource) => (
            <ResourceCard key={resource.name} resource={resource} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8 lg:px-10">
        <div
          className="relative overflow-hidden rounded-3xl border border-emerald-300/20 bg-emerald-300/[0.07] px-6 py-12 text-center sm:px-12 sm:py-16"
          id="submit-resource"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(110,231,183,0.13),transparent_55%)]" />
          <div className="relative mx-auto max-w-2xl">
            <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-emerald-300 text-[#07110e]">
              <LocationIcon />
            </span>
            <h2 className="mt-6 font-display text-3xl font-bold tracking-tight text-white">
              Know a food resource we should add?
            </h2>
            <p className="mt-4 leading-7 text-slate-300">
              The resource submission form is coming soon. We&apos;re building
              a simple way for neighbors and organizations to keep FreeBite SF
              useful and up to date.
            </p>
            <span className="mt-7 inline-flex rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-300">
              Submission form coming soon
            </span>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
          <p className="font-display font-semibold text-slate-300">FreeBite SF</p>
          <p>Helping San Francisco find food support, one listing at a time.</p>
        </div>
      </footer>
    </main>
  );
}
