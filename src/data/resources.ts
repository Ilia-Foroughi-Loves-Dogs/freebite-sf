export type ResourceCategory =
  | "Free groceries"
  | "Free hot meals"
  | "Community fridge"
  | "Student food resource";

export type FoodResource = {
  name: string;
  category: ResourceCategory;
  address: string;
  neighborhood: string;
  hours: string;
  cost: string;
  eligibility: string;
  website: string;
  phone: string | null;
  lastVerified: string;
};

export const resources: FoodResource[] = [
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
];

export function getDirectionsUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}
