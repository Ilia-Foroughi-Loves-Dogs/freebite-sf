"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  Filters,
  type ResourceFilter,
  type SortOption,
} from "@/components/Filters";
import { ArrowIcon, LocationIcon } from "@/components/icons";
import { ResourceCard } from "@/components/ResourceCard";
import { fallbackNearbyResources } from "@/data/fallbackNearby";
import { resources, type FoodResource } from "@/data/resources";
import { getCostRank } from "@/lib/cost";
import {
  calculateDistanceMiles,
  type Coordinates,
} from "@/lib/distance";
import {
  fetchNearbyFoodPlaces,
  DEFAULT_RADIUS_METERS,
  getSimpleOpenStatus,
} from "@/lib/overpass";

const DEFAULT_LOCATION: Coordinates = {
  lat: 37.7793,
  lng: -122.4193,
};

type LiveSearchSource = "Overpass" | "Fallback" | "Static only";

const radiusOptions = [
  { label: "0.5 mile", meters: DEFAULT_RADIUS_METERS },
  { label: "1 mile", meters: 1600 },
  { label: "2 miles", meters: 3200 },
] as const;

function isNearbyResource(resource: FoodResource) {
  return resource.source === "osm" || resource.source === "fallback";
}

const categoryFilters: Partial<
  Record<ResourceFilter, FoodResource["category"]>
> = {
  "Free groceries": "Free groceries",
  "Free hot meals": "Free hot meals",
  "Community fridges": "Community fridge",
  "Student resources": "Student food resource",
};

function matchesFilter(resource: FoodResource, filter: ResourceFilter) {
  if (filter === "All") {
    return true;
  }

  if (filter === "Free") {
    return resource.costRank === 0;
  }

  if (filter === "Has menu prices") {
    return Boolean(resource.cheapestItems?.length);
  }

  if (filter === "Nearby food places") {
    return isNearbyResource(resource);
  }

  if (filter === "Nearby restaurants") {
    return (
      isNearbyResource(resource) &&
      ["Restaurant", "Fast food", "Cafe"].includes(resource.category)
    );
  }

  if (filter === "Cheap/unknown nearby food") {
    return isNearbyResource(resource) && resource.costRank !== 0;
  }

  return resource.category === categoryFilters[filter];
}

function getLowestMenuPrice(resource: FoodResource) {
  return resource.cheapestItems?.reduce(
    (lowest, item) => Math.min(lowest, item.price),
    Infinity,
  ) ?? Infinity;
}

export default function Home() {
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [locationLabel, setLocationLabel] = useState(
    "San Francisco City Hall (default)",
  );
  const [locationMessage, setLocationMessage] = useState<string | null>(null);
  const [liveResources, setLiveResources] = useState<FoodResource[]>([]);
  const [menuResults, setMenuResults] = useState<
    Record<string, Partial<FoodResource>>
  >({});
  const [activeFilter, setActiveFilter] = useState<ResourceFilter>("All");
  const [activeSort, setActiveSort] = useState<SortOption>("Closest");
  const [openNow, setOpenNow] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [radiusMeters, setRadiusMeters] = useState(DEFAULT_RADIUS_METERS);
  const [nearbyError, setNearbyError] = useState<string | null>(null);
  const [liveSearchSource, setLiveSearchSource] =
    useState<LiveSearchSource>("Static only");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const requestController = useRef<AbortController | null>(null);

  const loadNearby = useCallback(
    async (searchLocation: Coordinates, searchRadiusMeters: number) => {
      requestController.current?.abort();
      const controller = new AbortController();
      requestController.current = controller;

      setIsLoading(true);
      setNearbyError(null);

      try {
        const nearby = await fetchNearbyFoodPlaces(
          searchLocation.lat,
          searchLocation.lng,
          searchRadiusMeters,
          controller.signal,
        );
        setLiveResources(nearby);
        setLiveSearchSource("Overpass");
        setLastUpdated(new Date());
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setLiveResources(fallbackNearbyResources);
        setLiveSearchSource("Fallback");
        setNearbyError(
          "Live nearby search is temporarily unavailable. Showing saved resources.",
        );
        setLastUpdated(new Date());
      } finally {
        if (requestController.current === controller) {
          setIsLoading(false);
        }
      }
    },
    [],
  );

  useEffect(() => {
    const initialLoad = window.setTimeout(() => {
      void loadNearby(DEFAULT_LOCATION, DEFAULT_RADIUS_METERS);
    }, 0);

    return () => {
      window.clearTimeout(initialLoad);
      requestController.current?.abort();
    };
  }, [loadNearby]);

  const selectedRadiusLabel =
    radiusOptions.find((option) => option.meters === radiusMeters)?.label ??
    `${radiusMeters.toLocaleString()} meters`;
  const liveResultsCount =
    liveSearchSource === "Overpass" ? liveResources.length : 0;
  const fallbackCount =
    liveSearchSource === "Fallback" ? liveResources.length : 0;

  const displayedResources = useMemo(() => {
    const now = new Date();
    const combined = [...resources, ...liveResources].map((resource) => {
      const enrichedResource = { ...resource, ...menuResults[resource.id] };

      return {
        ...enrichedResource,
        costRank: getCostRank(enrichedResource.cost),
        distanceMiles: calculateDistanceMiles(location, enrichedResource),
      };
    });

    return combined
      .filter((resource) => matchesFilter(resource, activeFilter))
      .filter(
        (resource) =>
          !openNow || getSimpleOpenStatus(resource.hours, now) !== false,
      )
      .sort((a, b) => {
        const distanceDifference =
          (a.distanceMiles ?? Infinity) - (b.distanceMiles ?? Infinity);

        if (activeSort === "Cheapest") {
          return (
            (a.costRank ?? 3) - (b.costRank ?? 3) || distanceDifference
          );
        }

        if (activeSort === "Free first") {
          const aFreeGroup = a.costRank === 0 ? 0 : 1;
          const bFreeGroup = b.costRank === 0 ? 0 : 1;
          return aFreeGroup - bFreeGroup || distanceDifference;
        }

        if (activeSort === "Cheapest menu item") {
          return (
            getLowestMenuPrice(a) - getLowestMenuPrice(b) ||
            distanceDifference
          );
        }

        return distanceDifference;
      });
  }, [
    activeFilter,
    activeSort,
    liveResources,
    location,
    menuResults,
    openNow,
  ]);

  const updateMenuResult = useCallback(
    (resourceId: string, result: Partial<FoodResource>) => {
      setMenuResults((current) => ({
        ...current,
        [resourceId]: {
          ...current[resourceId],
          ...result,
        },
      }));
    },
    [],
  );

  function useMyLocation() {
    if (!navigator.geolocation) {
      setLocationMessage(
        "Location is not supported by this browser. Showing City Hall results.",
      );
      return;
    }

    setIsLocating(true);
    setLocationMessage(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setLocation(userLocation);
        setLocationLabel("Your current location");
        setLocationMessage("Location found. Nearby food has been refreshed.");
        setIsLocating(false);
        void loadNearby(userLocation, radiusMeters);
      },
      () => {
        setLocation(DEFAULT_LOCATION);
        setLocationLabel("San Francisco City Hall (default)");
        setLocationMessage(
          "We could not use your location. Showing San Francisco default results instead.",
        );
        setIsLocating(false);
        void loadNearby(DEFAULT_LOCATION, radiusMeters);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 300000,
        timeout: 10000,
      },
    );
  }

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
          <a
            className="rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold text-white hover:border-emerald-300/50 hover:bg-white/5"
            href="#resources"
          >
            Find food
          </a>
        </header>

        <section className="grid items-center gap-12 py-16 lg:min-h-[670px] lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/[0.07] px-3 py-1.5 text-xs font-medium text-emerald-200">
              <span className="size-1.5 rounded-full bg-emerald-300" />
              Live food search across San Francisco
            </div>
            <h1 className="mt-7 max-w-4xl font-display text-5xl font-bold leading-[1.04] tracking-[-0.045em] text-white sm:text-6xl lg:text-7xl">
              Find free, cheap, and{" "}
              <span className="text-emerald-300">nearby food.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-400">
              Combine trusted community resources with live nearby restaurants,
              cafes, markets, and convenience stores within your selected
              radius.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <button
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-300 px-5 py-3.5 font-semibold text-[#07110e] shadow-[0_14px_40px_rgba(52,211,153,0.18)] hover:-translate-y-0.5 hover:bg-emerald-200 disabled:cursor-wait disabled:opacity-70"
                disabled={isLocating}
                onClick={useMyLocation}
                type="button"
              >
                <LocationIcon className="size-5" />
                {isLocating ? "Finding your location..." : "Use my location"}
              </button>
              <a
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 px-5 py-3.5 font-semibold text-white hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/5"
                href="#resources"
              >
                Browse results
                <ArrowIcon />
              </a>
            </div>
            {locationMessage && (
              <p
                aria-live="polite"
                className="mt-4 max-w-xl text-sm leading-6 text-emerald-100"
              >
                {locationMessage}
              </p>
            )}
          </div>

          <aside className="rounded-3xl border border-white/10 bg-[#101a18]/90 p-5 shadow-2xl backdrop-blur sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
                  Search status
                </p>
                <h2 className="mt-2 text-xl font-semibold text-white">
                  Food near your location
                </h2>
              </div>
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-emerald-300/10 text-emerald-300">
                <LocationIcon />
              </span>
            </div>

            <dl className="mt-7 divide-y divide-white/10 rounded-2xl border border-white/10 bg-black/10 px-4">
              <div className="flex items-start justify-between gap-5 py-4">
                <dt className="text-sm text-slate-500">Current location</dt>
                <dd className="text-right text-sm font-medium text-white">
                  {locationLabel}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-5 py-4">
                <dt className="text-sm text-slate-500">Selected radius</dt>
                <dd className="text-sm font-semibold text-emerald-300">
                  {selectedRadiusLabel} ({radiusMeters.toLocaleString()} meters)
                </dd>
              </div>
              <div className="flex items-center justify-between gap-5 py-4">
                <dt className="text-sm text-slate-500">Live search source</dt>
                <dd className="text-sm font-semibold text-emerald-300">
                  {liveSearchSource}
                </dd>
              </div>
              {nearbyError && (
                <div className="flex items-start justify-between gap-5 py-4">
                  <dt className="text-sm text-slate-500">Error message</dt>
                  <dd className="max-w-[60%] text-right text-sm font-medium text-white">
                    {nearbyError}
                  </dd>
                </div>
              )}
              <div className="flex items-center justify-between gap-5 py-4">
                <dt className="text-sm text-slate-500">Loading</dt>
                <dd className="text-sm font-semibold text-emerald-300">
                  {isLoading ? "true" : "false"}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-5 py-4">
                <dt className="text-sm text-slate-500">Static resources count</dt>
                <dd className="text-sm font-semibold text-emerald-300">
                  {resources.length}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-5 py-4">
                <dt className="text-sm text-slate-500">
                  Live results count
                </dt>
                <dd className="text-sm font-semibold text-emerald-300">
                  {liveResultsCount}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-5 py-4">
                <dt className="text-sm text-slate-500">
                  Fallback results count
                </dt>
                <dd className="text-sm font-semibold text-emerald-300">
                  {fallbackCount}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-5 py-4">
                <dt className="text-sm text-slate-500">
                  Total displayed count
                </dt>
                <dd className="text-sm font-semibold text-emerald-300">
                  {displayedResources.length}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-5 py-4">
                <dt className="text-sm text-slate-500">Last updated</dt>
                <dd className="text-right text-sm font-medium text-white">
                  {lastUpdated
                    ? lastUpdated.toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit",
                      })
                    : isLoading
                      ? "Loading now"
                      : "Not yet"}
                </dd>
              </div>
            </dl>

            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Search radius
              </p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {radiusOptions.map((option) => (
                  <button
                    aria-pressed={radiusMeters === option.meters}
                    className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition disabled:cursor-wait disabled:opacity-60 ${
                      radiusMeters === option.meters
                        ? "border-emerald-300 bg-emerald-300 text-[#07110e]"
                        : "border-white/10 bg-white/[0.035] text-slate-300 hover:border-white/25 hover:text-white"
                    }`}
                    disabled={isLoading && radiusMeters === option.meters}
                    key={option.meters}
                    onClick={() => {
                      setRadiusMeters(option.meters);
                      void loadNearby(location, option.meters);
                    }}
                    type="button"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-300/25 bg-emerald-300/[0.07] px-4 py-3 text-sm font-semibold text-emerald-200 hover:bg-emerald-300/[0.12] disabled:cursor-wait disabled:opacity-60"
              disabled={isLoading}
              onClick={() => void loadNearby(location, radiusMeters)}
              type="button"
            >
              {isLoading ? "Trying live search..." : "Try live search again"}
            </button>
            {nearbyError && (
              <p
                aria-live="polite"
                className="mt-4 rounded-xl border border-rose-300/20 bg-rose-300/[0.06] p-3 text-sm leading-6 text-rose-100"
              >
                {nearbyError}
              </p>
            )}
          </aside>
        </section>
      </div>

      <section
        className="border-y border-white/10 bg-white/[0.02] py-20"
        id="resources"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold text-emerald-300">
                Food finder
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Closest food options first
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-slate-400">
              Live places come from OpenStreetMap. Check details before visiting
              because hours, prices, and availability can change.
            </p>
          </div>

          <div className="mt-9">
            <Filters
              activeFilter={activeFilter}
              activeSort={activeSort}
              onFilterChange={setActiveFilter}
              onOpenNowChange={setOpenNow}
              onSortChange={setActiveSort}
              openNow={openNow}
            />
          </div>

          {isLoading && liveResources.length === 0 && (
            <div
              aria-live="polite"
              className="mt-8 rounded-2xl border border-emerald-300/15 bg-emerald-300/[0.05] p-5 text-sm text-emerald-100"
            >
              Searching OpenStreetMap for food within {selectedRadiusLabel}...
            </div>
          )}

          {displayedResources.length > 0 ? (
            <div className="mt-8 grid gap-5 lg:grid-cols-2">
              {displayedResources.map((resource) => (
                <ResourceCard
                  key={resource.id}
                  onMenuUpdate={updateMenuResult}
                  openStatus={getSimpleOpenStatus(resource.hours)}
                  resource={resource}
                />
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.025] p-8 text-center">
              <h3 className="text-lg font-semibold text-white">
                No results match these filters
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                Try All or turn off the Open now filter.
              </p>
            </div>
          )}
        </div>
      </section>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
          <p className="font-display font-semibold text-slate-300">FreeBite SF</p>
          <p>Static community listings plus live data from OpenStreetMap.</p>
        </div>
      </footer>
    </main>
  );
}
