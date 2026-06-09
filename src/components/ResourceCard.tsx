import { useState } from "react";

import { ArrowIcon, CheckIcon, LocationIcon } from "@/components/icons";
import {
  getDirectionsUrl,
  type CheapMenuItem,
  type FoodResource,
  type ResourceCategory,
} from "@/data/resources";

const categoryStyles: Record<ResourceCategory, string> = {
  "Free groceries": "bg-emerald-300/10 text-emerald-200",
  "Free hot meals": "bg-orange-300/10 text-orange-200",
  "Community fridge": "bg-cyan-300/10 text-cyan-200",
  "Student food resource": "bg-violet-300/10 text-violet-200",
  "Nearby food place": "bg-lime-300/10 text-lime-200",
  Restaurant: "bg-lime-300/10 text-lime-200",
  "Fast food": "bg-amber-300/10 text-amber-200",
  Cafe: "bg-sky-300/10 text-sky-200",
  Supermarket: "bg-teal-300/10 text-teal-200",
  "Convenience store": "bg-yellow-300/10 text-yellow-200",
  Grocery: "bg-lime-300/10 text-lime-200",
};

type ResourceCardProps = {
  onMenuUpdate: (
    resourceId: string,
    result: Partial<FoodResource>,
  ) => void;
  openStatus: boolean | null;
  resource: FoodResource;
};

export function ResourceCard({
  onMenuUpdate,
  openStatus,
  resource,
}: ResourceCardProps) {
  const [isCheckingMenu, setIsCheckingMenu] = useState(false);
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
  const canCheckMenu = Boolean(resource.menuUrl);
  const cheapestItems = [...(resource.cheapestItems ?? [])]
    .filter((item) => Number.isFinite(item.price))
    .sort((a, b) => a.price - b.price)
    .slice(0, 3);
  const lowestItem = cheapestItems[0];
  const isFree =
    resource.costRank === 0 || resource.cost.trim().toLowerCase() === "free";
  const priceBadge = isFree
    ? "Free"
    : lowestItem
      ? `From ${lowestItem.priceText || `$${lowestItem.price.toFixed(2)}`}`
      : resource.cost.trim().toLowerCase() === "unknown"
        ? "Price unknown"
        : null;
  const menuCheckedDate = resource.menuLastChecked
    ? new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(resource.menuLastChecked))
    : null;

  async function checkMenu() {
    if (!resource.menuUrl) {
      return;
    }

    setIsCheckingMenu(true);

    try {
      const response = await fetch("/api/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: resource.menuUrl }),
      });

      if (!response.ok) {
        throw new Error("Menu request failed.");
      }

      const data = (await response.json()) as {
        checkedAt: string;
        items: CheapMenuItem[];
      };

      onMenuUpdate(resource.id, {
        cheapestItems: data.items,
        menuLastChecked: data.checkedAt,
        menuStatus: data.items.length > 0 ? "found" : "not_found",
      });
    } catch {
      onMenuUpdate(resource.id, {
        cheapestItems: [],
        menuLastChecked: new Date().toISOString(),
        menuStatus: "error",
      });
    } finally {
      setIsCheckingMenu(false);
    }
  }

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
            {resource.source === "fallback" && (
              <span className="inline-flex rounded-full border border-sky-300/20 bg-sky-300/[0.06] px-3 py-1 text-xs font-semibold text-sky-200">
                Saved nearby result
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
        {priceBadge && (
          <span
            className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-semibold ${
              isFree
                ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-200"
                : lowestItem
                  ? "border-amber-300/30 bg-amber-300/10 text-amber-100"
                  : "border-slate-400/20 bg-slate-400/10 text-slate-300"
            }`}
          >
            {priceBadge}
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

      {(canCheckMenu || cheapestItems.length > 0 || resource.menuStatus) && (
        <div className="mb-5 border-t border-white/10 pt-5">
          {cheapestItems.length > 0 ? (
            <div>
              <p className="text-sm font-semibold text-white">Cheapest items</p>
              <ul className="mt-3 space-y-3">
                {cheapestItems.map((item) => (
                  <li
                    className="rounded-xl border border-emerald-300/10 bg-emerald-300/[0.04] px-3 py-2.5 text-sm"
                    key={`${item.name}-${item.price}-${item.sourceUrl}`}
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className="font-medium text-slate-100">
                        {item.name}
                      </span>
                      <span className="font-semibold text-emerald-300">
                        {item.priceText || `$${item.price.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                      {item.sourceUrl !== "manual-seed" && (
                        <a
                          className="text-emerald-200 underline decoration-emerald-300/40 underline-offset-2 hover:text-emerald-100"
                          href={item.sourceUrl}
                          rel="noreferrer"
                          target="_blank"
                        >
                          Source
                        </a>
                      )}
                      <span className="text-amber-200">
                        Verify before going
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs leading-5 text-slate-500">
                {cheapestItems.some(
                  (item) => item.sourceUrl === "manual-seed",
                )
                  ? "Example cheap items — verify before going."
                  : "Prices may be outdated. Verify before going."}
                {menuCheckedDate && ` Last checked ${menuCheckedDate}.`}
              </p>
            </div>
          ) : resource.menuStatus === "not_found" ? (
            <p className="text-sm text-slate-300">
              No menu prices found online.
              {menuCheckedDate && (
                <span className="mt-1 block text-xs text-slate-500">
                  Last checked {menuCheckedDate}.
                </span>
              )}
            </p>
          ) : resource.menuStatus === "error" ? (
            <p className="text-sm text-rose-200">
              Could not check menu.
              {menuCheckedDate && (
                <span className="mt-1 block text-xs text-slate-500">
                  Last checked {menuCheckedDate}.
                </span>
              )}
            </p>
          ) : null}

          {canCheckMenu && (
            <button
              className="mt-4 inline-flex items-center justify-center rounded-xl border border-emerald-300/25 bg-emerald-300/[0.07] px-4 py-2.5 text-sm font-semibold text-emerald-200 hover:bg-emerald-300/[0.12] disabled:cursor-wait disabled:opacity-60"
              disabled={isCheckingMenu}
              onClick={() => void checkMenu()}
              type="button"
            >
              {isCheckingMenu
                ? "Checking menu..."
                : resource.menuStatus === "not_checked" ||
                    resource.menuStatus === undefined
                  ? "Find cheapest items"
                  : "Check menu again"}
            </button>
          )}
        </div>
      )}

      <div className="flex flex-col gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-500">
          {resource.source === "static" ? "Last verified" : "Loaded"}{" "}
          {verifiedDate}
        </p>
        <div className="flex gap-2">
          {resource.website && (
            <a
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold text-white hover:border-white/30 hover:bg-white/5 sm:flex-none"
              href={resource.website}
              rel="noreferrer"
              target="_blank"
            >
              Details
              <ArrowIcon />
            </a>
          )}
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
