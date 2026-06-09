export type ResourceCategory =
  | "Free groceries"
  | "Free hot meals"
  | "Community fridge"
  | "Student food resource"
  | "Cheap food"
  | "Nearby food place"
  | "Restaurant"
  | "Fast food"
  | "Cafe"
  | "Supermarket"
  | "Convenience store"
  | "Grocery";

export type CheapMenuItem = {
  name: string;
  price: number;
  priceText: string;
  sourceType: "manual_seed" | "user_submitted" | "live_menu";
  verified: boolean;
  sourceUrl?: string;
  lastChecked?: string;
};

export type FoodResource = {
  id: string;
  name: string;
  category: ResourceCategory;
  address: string;
  neighborhood: string;
  hours: string;
  cost: string;
  eligibility: string;
  website?: string;
  phone: string | null;
  lastVerified: string;
  lat: number;
  lng: number;
  tags: string[];
  source: "static" | "curated" | "osm" | "fallback";
  distanceMiles?: number;
  costRank?: number;
  menuUrl?: string;
  cheapestItems?: CheapMenuItem[];
  menuLastChecked?: string;
  menuStatus?: "not_checked" | "found" | "not_found" | "error";
};

export const resources: FoodResource[] = [
  {
    id: "sf-marin-food-bank",
    name: "SF-Marin Food Bank",
    category: "Free groceries",
    address: "900 Pennsylvania Ave, San Francisco, CA",
    neighborhood: "Potrero Hill",
    hours: "Use website locator for pantry times",
    cost: "Free",
    eligibility: "Varies by pantry",
    website: "https://www.sfmfoodbank.org/find-food/",
    phone: "415-282-1900",
    lastVerified: "2026-06-08",
    lat: 37.754,
    lng: -122.393,
    tags: ["food pantry", "groceries"],
    source: "static",
  },
  {
    id: "glide-daily-free-meals",
    name: "Glide Daily Free Meals",
    category: "Free hot meals",
    address: "330 Ellis St, San Francisco, CA",
    neighborhood: "Tenderloin",
    hours: "Check website for current meal times",
    cost: "Free",
    eligibility: "Open to the community",
    website: "https://www.glide.org/",
    phone: "415-674-6000",
    lastVerified: "2026-06-08",
    lat: 37.7852,
    lng: -122.411,
    tags: ["hot meals", "community"],
    source: "static",
  },
  {
    id: "st-anthonys-dining-room",
    name: "St. Anthony's Dining Room",
    category: "Free hot meals",
    address: "121 Golden Gate Ave, San Francisco, CA",
    neighborhood: "Tenderloin",
    hours: "Check website for current meal times",
    cost: "Free",
    eligibility: "Open to the community",
    website: "https://www.stanthonysf.org/",
    phone: "415-241-2600",
    lastVerified: "2026-06-08",
    lat: 37.7829,
    lng: -122.4131,
    tags: ["hot meals", "dining room"],
    source: "static",
  },
  {
    id: "ccsf-basic-needs-center",
    name: "City College of San Francisco Basic Needs Center",
    category: "Student food resource",
    address: "50 Frida Kahlo Way, San Francisco, CA",
    neighborhood: "Ocean Avenue",
    hours: "Check CCSF website for current hours",
    cost: "Free",
    eligibility: "CCSF students",
    website: "https://www.ccsf.edu/",
    phone: null,
    lastVerified: "2026-06-08",
    lat: 37.7258,
    lng: -122.4527,
    tags: ["students", "basic needs"],
    source: "static",
  },
  {
    id: "sf-community-fridge-mission",
    name: "SF Community Fridge - Mission Area",
    category: "Community fridge",
    address: "Mission District, San Francisco, CA",
    neighborhood: "Mission",
    hours: "Varies, community maintained",
    cost: "Free",
    eligibility: "Take what you need, leave what you can",
    website: "https://www.instagram.com/sfcommunityfridge/",
    phone: null,
    lastVerified: "2026-06-08",
    lat: 37.7599,
    lng: -122.4148,
    tags: ["community fridge", "mutual aid"],
    source: "static",
  },
];

export function getDirectionsUrl(resource: FoodResource) {
  return `https://www.google.com/maps/dir/?api=1&destination=${resource.lat}%2C${resource.lng}`;
}
