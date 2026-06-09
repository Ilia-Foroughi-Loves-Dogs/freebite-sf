import type { FoodResource } from "@/data/resources";
import { calculateDistanceMiles } from "@/lib/distance";

const OVERPASS_URLS = [
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass-api.de/api/interpreter",
];
export const DEFAULT_RADIUS_METERS = 700;
const REQUEST_TIMEOUT_MS = 10_000;
const MAX_LIVE_RESULTS = 40;

type OsmTags = Record<string, string>;

type OverpassElement = {
  type: "node";
  id: number;
  lat: number;
  lon: number;
  tags?: OsmTags;
};

type OverpassResponse = {
  elements: OverpassElement[];
};

const dayIndexes: Record<string, number> = {
  Su: 0,
  Mo: 1,
  Tu: 2,
  We: 3,
  Th: 4,
  Fr: 5,
  Sa: 6,
};

function buildQuery(lat: number, lng: number, radiusMeters: number) {
  return `[out:json][timeout:8];
(
  node["amenity"="restaurant"](around:${radiusMeters},${lat},${lng});
  node["amenity"="fast_food"](around:${radiusMeters},${lat},${lng});
  node["amenity"="cafe"](around:${radiusMeters},${lat},${lng});
  node["shop"="supermarket"](around:${radiusMeters},${lat},${lng});
  node["shop"="convenience"](around:${radiusMeters},${lat},${lng});
);
out body 40;`;
}

function getAddress(tags: OsmTags) {
  const streetAddress = [tags["addr:housenumber"], tags["addr:street"]]
    .filter(Boolean)
    .join(" ");
  const locality = [tags["addr:city"], tags["addr:state"]]
    .filter(Boolean)
    .join(", ");

  if (streetAddress) {
    return [streetAddress, locality].filter(Boolean).join(", ");
  }

  return "Address unavailable";
}

function getCategory(tags: OsmTags): FoodResource["category"] {
  if (tags.amenity === "restaurant") {
    return "Restaurant";
  }

  if (tags.amenity === "fast_food") {
    return "Fast food";
  }

  if (tags.amenity === "cafe") {
    return "Cafe";
  }

  if (tags.shop === "supermarket") {
    return "Supermarket";
  }

  if (tags.shop === "convenience") {
    return "Convenience store";
  }

  return "Nearby food place";
}

function getWebsite(tags: OsmTags, type: OverpassElement["type"], id: number) {
  return (
    normalizeWebUrl(tags.website) ||
    normalizeWebUrl(tags["contact:website"]) ||
    normalizeWebUrl(tags["brand:website"]) ||
    `https://www.openstreetmap.org/${type}/${id}`
  );
}

function normalizeWebUrl(value?: string) {
  if (!value) {
    return undefined;
  }

  const candidate = /^https?:\/\//i.test(value) ? value : `https://${value}`;

  try {
    const url = new URL(candidate);
    return (url.protocol === "http:" || url.protocol === "https:") &&
      url.hostname.includes(".")
      ? url.toString()
      : undefined;
  } catch {
    return undefined;
  }
}

function getMenuUrl(tags: OsmTags) {
  return (
    normalizeWebUrl(tags["website:menu"]) ||
    normalizeWebUrl(tags.menu) ||
    normalizeWebUrl(tags["takeaway:website"]) ||
    normalizeWebUrl(tags.website) ||
    normalizeWebUrl(tags["contact:website"]) ||
    normalizeWebUrl(tags["brand:website"])
  );
}

function formatPhone(tags: OsmTags) {
  return tags.phone || tags["contact:phone"] || null;
}

function getTagLabels(tags: OsmTags) {
  return [
    tags.amenity,
    tags.shop,
    tags.cuisine,
    tags.takeaway === "yes" ? "takeaway" : null,
    tags.delivery === "yes" ? "delivery" : null,
  ].filter((tag): tag is string => Boolean(tag));
}

function parseMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function dayMatches(dayExpression: string, day: number) {
  return dayExpression.split(",").some((part) => {
    const [start, end] = part.trim().split("-");
    const startDay = dayIndexes[start];

    if (startDay === undefined) {
      return false;
    }

    if (!end) {
      return startDay === day;
    }

    const endDay = dayIndexes[end];
    if (endDay === undefined) {
      return false;
    }

    return startDay <= endDay
      ? day >= startDay && day <= endDay
      : day >= startDay || day <= endDay;
  });
}

export function getSimpleOpenStatus(
  openingHours: string,
  now = new Date(),
): boolean | null {
  const normalized = openingHours.trim();

  if (!normalized || normalized === "Hours unknown.") {
    return null;
  }

  if (normalized === "24/7") {
    return true;
  }

  let foundSupportedRule = false;

  for (const rule of normalized.split(";")) {
    const match = rule
      .trim()
      .match(
        /^(Mo|Tu|We|Th|Fr|Sa|Su)(?:-(Mo|Tu|We|Th|Fr|Sa|Su))?(?:,(?:Mo|Tu|We|Th|Fr|Sa|Su)(?:-(?:Mo|Tu|We|Th|Fr|Sa|Su))?)*\s+(\d{2}:\d{2})-(\d{2}:\d{2})$/,
      );

    if (!match) {
      continue;
    }

    foundSupportedRule = true;
    const dayExpression = rule.trim().split(/\s+/)[0];
    if (!dayMatches(dayExpression, now.getDay())) {
      continue;
    }

    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const startMinutes = parseMinutes(match[3]);
    const endMinutes = parseMinutes(match[4]);

    if (endMinutes < startMinutes) {
      return currentMinutes >= startMinutes || currentMinutes < endMinutes;
    }

    if (currentMinutes >= startMinutes && currentMinutes < endMinutes) {
      return true;
    }
  }

  return foundSupportedRule ? false : null;
}

export async function fetchNearbyFoodPlaces(
  lat: number,
  lng: number,
  radiusMeters = DEFAULT_RADIUS_METERS,
  signal?: AbortSignal,
): Promise<FoodResource[]> {
  let data: OverpassResponse | null = null;
  for (const url of OVERPASS_URLS) {
    const requestController = new AbortController();
    const abortRequest = () => requestController.abort();
    const timeout = setTimeout(abortRequest, REQUEST_TIMEOUT_MS);
    signal?.addEventListener("abort", abortRequest, { once: true });

    try {
      const response = await fetch(url, {
        method: "POST",
        body: new URLSearchParams({
          data: buildQuery(lat, lng, radiusMeters),
        }),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        signal: requestController.signal,
      });

      if (!response.ok) {
        throw new Error(
          `Overpass request failed with status ${response.status}.`,
        );
      }

      const candidate = (await response.json()) as OverpassResponse;
      if (!Array.isArray(candidate.elements)) {
        throw new Error("Overpass returned an invalid response.");
      }

      data = candidate;
      break;
    } catch (error) {
      if (signal?.aborted) {
        throw error;
      }
    } finally {
      clearTimeout(timeout);
      signal?.removeEventListener("abort", abortRequest);
    }
  }

  if (!data) {
    throw new Error(
      "Live nearby search is temporarily unavailable. Showing saved resources.",
    );
  }

  const today = new Date().toISOString().slice(0, 10);

  return data.elements
    .flatMap((element) => {
      const elementLat = element.lat;
      const elementLng = element.lon;
      const tags = element.tags;

      if (!tags || elementLat === undefined || elementLng === undefined) {
        return [];
      }

      const name =
        tags.name ||
        tags.brand ||
        (tags.shop
          ? `${tags.shop.replaceAll("_", " ")}`
          : tags.amenity?.replaceAll("_", " ")) ||
        "Unnamed food place";
      const menuUrl = getMenuUrl(tags);

      return [
        {
          id: `osm-${element.type}-${element.id}`,
          name,
          category: getCategory(tags),
          address: getAddress(tags),
          neighborhood:
            tags["addr:suburb"] ||
            tags["addr:neighbourhood"] ||
            "Near your location",
          hours: tags.opening_hours || "Hours unknown",
          cost: "Unknown",
          eligibility: "Open to the public",
          website: getWebsite(tags, element.type, element.id),
          phone: formatPhone(tags),
          lastVerified: today,
          lat: elementLat,
          lng: elementLng,
          tags: getTagLabels(tags),
          source: "osm",
          menuUrl,
          menuStatus: menuUrl ? "not_checked" : undefined,
        } satisfies FoodResource,
      ];
    })
    .sort(
      (a, b) =>
        calculateDistanceMiles({ lat, lng }, a) -
        calculateDistanceMiles({ lat, lng }, b),
    )
    .slice(0, MAX_LIVE_RESULTS);
}
