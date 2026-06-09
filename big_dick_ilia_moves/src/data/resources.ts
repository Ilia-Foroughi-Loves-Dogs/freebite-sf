import type { FoodResource } from "@/types/resources";

export const resources: FoodResource[] = [
  {
    name: "SF-Marin Food Bank",
    category: "Free groceries",
    address: "900 Pennsylvania Ave",
    neighborhood: "Potrero Hill",
    hours: "Mon-Fri, 9:00 AM-5:00 PM",
    cost: "Free",
    eligibility: "Open to San Francisco residents; pantry hours vary by partner site.",
    lastVerified: "June 8, 2026",
    website: "https://www.sfmfoodbank.org/find-food/",
    directionsUrl:
      "https://www.google.com/maps/search/?api=1&query=900+Pennsylvania+Ave+San+Francisco+CA",
  },
  {
    name: "Glide Daily Free Meals",
    category: "Free hot meals",
    address: "330 Ellis St",
    neighborhood: "Tenderloin",
    hours: "Daily, breakfast and lunch service",
    cost: "Free",
    eligibility: "Open to all; arrive early during busy meal windows.",
    lastVerified: "June 8, 2026",
    website: "https://www.glide.org/",
    directionsUrl:
      "https://www.google.com/maps/search/?api=1&query=330+Ellis+St+San+Francisco+CA",
  },
  {
    name: "St. Anthony's Dining Room",
    category: "Free hot meals",
    address: "121 Golden Gate Ave",
    neighborhood: "Tenderloin",
    hours: "Mon-Fri, lunch service",
    cost: "Free",
    eligibility: "Open to guests seeking a free community meal.",
    lastVerified: "June 8, 2026",
    website: "https://www.stanthonysf.org/",
    directionsUrl:
      "https://www.google.com/maps/search/?api=1&query=121+Golden+Gate+Ave+San+Francisco+CA",
  },
  {
    name: "City College of San Francisco Basic Needs Center",
    category: "Student food resource",
    address: "50 Frida Kahlo Way",
    neighborhood: "Ocean Avenue",
    hours: "Weekdays during campus support hours",
    cost: "Free",
    eligibility: "Primarily for CCSF students seeking food and basic-needs support.",
    lastVerified: "June 8, 2026",
    website: "https://www.ccsf.edu/",
    directionsUrl:
      "https://www.google.com/maps/search/?api=1&query=50+Frida+Kahlo+Way+San+Francisco+CA",
  },
  {
    name: "SF Community Fridge - Mission Area",
    category: "Community fridge",
    address: "Mission District",
    neighborhood: "Mission District",
    hours: "Daily, check Instagram for the latest restock updates",
    cost: "Free",
    eligibility: "Take what you need, leave what you can.",
    lastVerified: "June 8, 2026",
    website: "https://www.instagram.com/sfcommunityfridge/",
    directionsUrl:
      "https://www.google.com/maps/search/?api=1&query=Mission+District+San+Francisco+CA",
  },
];
