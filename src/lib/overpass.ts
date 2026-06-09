import type { FoodResource } from "@/data/resources";
import { calculateDistanceMiles } from "@/lib/distance";

const OVERPASS_URL = "https://overpass-api.de/api/interpreter";
const SEARCH_RADIUS_METERS = 3219;
const MAX_LIVE_RESULTS = 100;

type OsmTags = Record<string, string>;

type OverpassElement = {
  type: "node" | "way" | "relation";
  id: number;
  lat?: number;
  lon?: number;
  center?: {
    lat: number;
    lon: number;
  };
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

function buildQuery(lat: number, lng: number) {
  return `
    [out:json][timeout:25];
    (
      nwr(around:${SEARCH_RADIUS_METERS},${lat},${lng})["amenity"~"^(restaurant|fast_food|cafe)$"];
      nwr(around:${SEARCH_RADIUS_METERS},${lat},${lng})["shop"~"^(supermarket|convenience|greengrocer)$"];
    );
    out center tags;
  `;
}

function getAddress(tags: OsmTags, lat: number, lng: number) {
  const streetAddress = [tags["addr:housenumber"], tags["addr:street"]]
    .filter(Boolean)
    .join(" ");
  const locality = [tags["addr:city"], tags["addr:state"]]
    .filter(Boolean)
    .join(", ");

  if (streetAddress) {
    return [streetAddress, locality].filter(Boolean).join(", ");
  }

  return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
}

function inferCost(tags: OsmTags) {
  const searchable = [
    tags.name,
    tags.brand,
    tags.amenity,
    tags.shop,
    tags.cuisine,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (
    tags.fee === "no" ||
    /\b(free|food bank|food pantry|community fridge)\b/.test(searchable)
  ) {
    return "Free";
  }

  if (
    tags.amenity === "fast_food" ||
    tags.shop === "convenience" ||
    /\b(bargain|discount|dollar|grocery outlet|taqueria)\b/.test(searchable)
  ) {
    return "Under $10";
  }

  return "Unknown";
}

function getWebsite(tags: OsmTags, type: OverpassElement["type"], id: number) {
  return (
    tags.website ||
    tags["contact:website"] ||
    `https://www.openstreetmap.org/${type}/${id}`
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
  signal?: AbortSignal,
): Promise<FoodResource[]> {
  const response = await fetch(OVERPASS_URL, {
    method: "POST",
    body: new URLSearchParams({ data: buildQuery(lat, lng) }),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    signal,
  });

  if (!response.ok) {
    throw new Error(`Overpass request failed with status ${response.status}.`);
  }

  const data = (await response.json()) as OverpassResponse;
  const today = new Date().toISOString().slice(0, 10);

  return data.elements
    .flatMap((element) => {
      const elementLat = element.lat ?? element.center?.lat;
      const elementLng = element.lon ?? element.center?.lon;
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

      return [
        {
          id: `osm-${element.type}-${element.id}`,
          name,
          category: "Nearby food place",
          address: getAddress(tags, elementLat, elementLng),
          neighborhood:
            tags["addr:suburb"] ||
            tags["addr:neighbourhood"] ||
            "Near your location",
          hours: tags.opening_hours || "Hours unknown.",
          cost: inferCost(tags),
          eligibility: "Open to the public",
          website: getWebsite(tags, element.type, element.id),
          phone: formatPhone(tags),
          lastVerified: today,
          lat: elementLat,
          lng: elementLng,
          tags: getTagLabels(tags),
          source: "osm",
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
