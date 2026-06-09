import { ArrowIcon, CheckIcon, LocationIcon } from "@/components/icons";
import {
  getDirectionsUrl,
  type FoodResource,
  type ResourceCategory,
} from "@/data/resources";

const categoryStyles: Record<ResourceCategory, string> = {
  "Free groceries": "bg-emerald-300/10 text-emerald-200",
  "Free hot meals": "bg-orange-300/10 text-orange-200",
  "Community fridge": "bg-cyan-300/10 text-cyan-200",
  "Student food resource": "bg-violet-300/10 text-violet-200",
  "Nearby food place": "bg-lime-300/10 text-lime-200",
};

type ResourceCardProps = {
  openStatus: boolean | null;
  resource: FoodResource;
};

export function ResourceCard({
  openStatus,
  resource,
}: ResourceCardProps) {
  const verifiedDate = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(resource.lastVerified));

  const hoursStatus =
    openStatus === true
      ? "Open now"
      : openStatus === false
        ? "Closed now"
        : "Hours unknown";

  return (
    <article className="flex h-full flex-col rounded-3xl border border-white/10 bg-[#101a18] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.2)] transition hover:border-emerald-300/25 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap gap-2">
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${categoryStyles[resource.category]}`}
            >
              {resource.category}
            </span>
            {resource.source === "osm" && (
              <span className="inline-flex rounded-full border border-lime-300/20 bg-lime-300/[0.06] px-3 py-1 text-xs font-semibold text-lime-200">
                Live nearby result
              </span>
            )}
          </div>
          <h3 className="mt-4 text-xl font-semibold tracking-tight text-white sm:text-2xl">
            {resource.name}
          </h3>
        </div>
        {resource.source === "static" && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/20 bg-emerald-300/[0.06] px-3 py-1.5 text-xs text-emerald-200">
            <CheckIcon />
            Verified
          </span>
        )}
      </div>

      <div className="mt-5 flex gap-3 border-b border-white/10 pb-5">
        <LocationIcon className="mt-0.5 size-5 shrink-0 text-emerald-300" />
        <div className="min-w-0">
          <p className="text-sm leading-6 text-slate-200">{resource.address}</p>
          <p className="mt-0.5 text-sm text-slate-500">
            {resource.neighborhood}
            {resource.distanceMiles !== undefined && (
              <>
                <span aria-hidden="true"> · </span>
                <span className="font-medium text-emerald-300">
                  {resource.distanceMiles < 0.1
                    ? "< 0.1 mi"
                    : `${resource.distanceMiles.toFixed(1)} mi`}
                </span>
              </>
            )}
          </p>
        </div>
      </div>

      <dl className="grid flex-1 gap-x-6 gap-y-5 py-6 sm:grid-cols-2">
        <div>
          <dt className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
            Hours
          </dt>
          <dd className="mt-2 text-sm leading-6 text-slate-200">
            {resource.hours}
          </dd>
          <dd
            className={`mt-1 text-xs font-semibold ${
              openStatus === true
                ? "text-emerald-300"
                : openStatus === false
                  ? "text-rose-300"
                  : "text-slate-500"
            }`}
          >
            {hoursStatus}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
            Cost
          </dt>
          <dd className="mt-2 text-sm font-medium text-emerald-300">
            {resource.cost}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
            Eligibility
          </dt>
          <dd className="mt-2 text-sm leading-6 text-slate-200">
            {resource.eligibility}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
            Phone
          </dt>
          <dd className="mt-2 text-sm text-slate-200">
            {resource.phone ? (
              <a className="hover:text-emerald-300" href={`tel:${resource.phone}`}>
                {resource.phone}
              </a>
            ) : (
              "Not listed"
            )}
          </dd>
        </div>
      </dl>

      <div className="flex flex-col gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-500">
          {resource.source === "static" ? "Last verified" : "Loaded"}{" "}
          {verifiedDate}
        </p>
        <div className="flex gap-2">
          <a
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold text-white hover:border-white/30 hover:bg-white/5 sm:flex-none"
            href={resource.website}
            rel="noreferrer"
            target="_blank"
          >
            Details
            <ArrowIcon />
          </a>
          <a
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-300 px-4 py-2.5 text-sm font-semibold text-[#07110e] hover:bg-emerald-200 sm:flex-none"
            href={getDirectionsUrl(resource)}
            rel="noreferrer"
            target="_blank"
          >
            Directions
            <LocationIcon className="size-4" />
          </a>
        </div>
      </div>
    </article>
  );
}
