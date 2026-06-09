import type { FoodResource } from "@/data/resources";

export type CheapFoodPlace = {
  id: string;
  placeName: string;
  address: string;
  neighborhood: string;
  lat: number;
  lng: number;
  items: {
    name: string;
    price: number;
    priceText: string;
    sourceType: "manual_seed" | "user_submitted" | "live_menu";
    verified: boolean;
    sourceUrl?: string;
    lastChecked?: string;
  }[];
};

export const cheapFoodPlaces: CheapFoodPlace[] = [
  {
    id: "golden-boy-pizza",
    placeName: "Golden Boy Pizza",
    address: "542 Green St, San Francisco, CA",
    neighborhood: "North Beach",
    lat: 37.7997,
    lng: -122.4081,
    items: [
      {
        name: "Cheese pizza slice",
        price: 4.5,
        priceText: "$4.50",
        sourceType: "manual_seed",
        verified: false,
        sourceUrl: "manual-seed",
      },
    ],
  },
  {
    id: "arizmendi-bakery",
    placeName: "Arizmendi Bakery",
    address: "1331 9th Ave, San Francisco, CA",
    neighborhood: "Inner Sunset",
    lat: 37.7634,
    lng: -122.4663,
    items: [
      {
        name: "Pizza slice",
        price: 4.25,
        priceText: "$4.25",
        sourceType: "manual_seed",
        verified: false,
        sourceUrl: "manual-seed",
      },
      {
        name: "Morning pastry",
        price: 3.75,
        priceText: "$3.75",
        sourceType: "manual_seed",
        verified: false,
        sourceUrl: "manual-seed",
      },
    ],
  },
  {
    id: "good-mong-kok-bakery",
    placeName: "Good Mong Kok Bakery",
    address: "1039 Stockton St, San Francisco, CA",
    neighborhood: "Chinatown",
    lat: 37.7954,
    lng: -122.4084,
    items: [
      {
        name: "BBQ pork bun",
        price: 1.8,
        priceText: "$1.80",
        sourceType: "manual_seed",
        verified: false,
        sourceUrl: "manual-seed",
      },
      {
        name: "Sesame ball",
        price: 1.5,
        priceText: "$1.50",
        sourceType: "manual_seed",
        verified: false,
        sourceUrl: "manual-seed",
      },
    ],
  },
  {
    id: "saigon-sandwich",
    placeName: "Saigon Sandwich",
    address: "560 Larkin St, San Francisco, CA",
    neighborhood: "Tenderloin",
    lat: 37.7831,
    lng: -122.4176,
    items: [
      {
        name: "Banh mi sandwich",
        price: 5.5,
        priceText: "$5.50",
        sourceType: "manual_seed",
        verified: false,
        sourceUrl: "manual-seed",
      },
    ],
  },
  {
    id: "bobs-donuts-polk",
    placeName: "Bob's Donuts",
    address: "1621 Polk St, San Francisco, CA",
    neighborhood: "Nob Hill",
    lat: 37.7919,
    lng: -122.4211,
    items: [
      {
        name: "Glazed donut",
        price: 2.25,
        priceText: "$2.25",
        sourceType: "manual_seed",
        verified: false,
        sourceUrl: "manual-seed",
      },
    ],
  },
  {
    id: "house-of-bagels",
    placeName: "House of Bagels",
    address: "5030 Geary Blvd, San Francisco, CA",
    neighborhood: "Outer Richmond",
    lat: 37.7805,
    lng: -122.4738,
    items: [
      {
        name: "Plain bagel",
        price: 2.25,
        priceText: "$2.25",
        sourceType: "manual_seed",
        verified: false,
        sourceUrl: "manual-seed",
      },
      {
        name: "Bagel with cream cheese",
        price: 4.75,
        priceText: "$4.75",
        sourceType: "manual_seed",
        verified: false,
        sourceUrl: "manual-seed",
      },
    ],
  },
  {
    id: "cafe-venue",
    placeName: "Cafe Venue",
    address: "218 Montgomery St, San Francisco, CA",
    neighborhood: "Financial District",
    lat: 37.7918,
    lng: -122.4024,
    items: [
      {
        name: "Drip coffee",
        price: 3,
        priceText: "$3.00",
        sourceType: "manual_seed",
        verified: false,
        sourceUrl: "manual-seed",
      },
      {
        name: "Breakfast bagel",
        price: 6.95,
        priceText: "$6.95",
        sourceType: "manual_seed",
        verified: false,
        sourceUrl: "manual-seed",
      },
    ],
  },
  {
    id: "el-farolito-mission",
    placeName: "El Farolito",
    address: "2779 Mission St, San Francisco, CA",
    neighborhood: "Mission",
    lat: 37.7527,
    lng: -122.4185,
    items: [
      {
        name: "Taco",
        price: 4.25,
        priceText: "$4.25",
        sourceType: "manual_seed",
        verified: false,
        sourceUrl: "manual-seed",
      },
      {
        name: "Bean and cheese burrito",
        price: 7.5,
        priceText: "$7.50",
        sourceType: "manual_seed",
        verified: false,
        sourceUrl: "manual-seed",
      },
    ],
  },
  {
    id: "la-espiga-de-oro",
    placeName: "La Espiga De Oro",
    address: "2916 24th St, San Francisco, CA",
    neighborhood: "Mission",
    lat: 37.7527,
    lng: -122.4107,
    items: [
      {
        name: "Taco",
        price: 3.75,
        priceText: "$3.75",
        sourceType: "manual_seed",
        verified: false,
        sourceUrl: "manual-seed",
      },
      {
        name: "Small burrito",
        price: 8.5,
        priceText: "$8.50",
        sourceType: "manual_seed",
        verified: false,
        sourceUrl: "manual-seed",
      },
    ],
  },
  {
    id: "reds-java-house",
    placeName: "Red's Java House",
    address: "Pier 30, The Embarcadero, San Francisco, CA",
    neighborhood: "South Beach",
    lat: 37.7865,
    lng: -122.3869,
    items: [
      {
        name: "Hot dog",
        price: 5.75,
        priceText: "$5.75",
        sourceType: "manual_seed",
        verified: false,
        sourceUrl: "manual-seed",
      },
      {
        name: "Coffee",
        price: 3,
        priceText: "$3.00",
        sourceType: "manual_seed",
        verified: false,
        sourceUrl: "manual-seed",
      },
    ],
  },
  {
    id: "super-duper-castro",
    placeName: "Super Duper Burgers",
    address: "2304 Market St, San Francisco, CA",
    neighborhood: "Castro",
    lat: 37.7643,
    lng: -122.4335,
    items: [
      {
        name: "French fries",
        price: 4.25,
        priceText: "$4.25",
        sourceType: "manual_seed",
        verified: false,
        sourceUrl: "manual-seed",
      },
    ],
  },
  {
    id: "pinecrest-diner",
    placeName: "Pinecrest Diner",
    address: "401 Geary St, San Francisco, CA",
    neighborhood: "Union Square",
    lat: 37.7871,
    lng: -122.4098,
    items: [
      {
        name: "Coffee",
        price: 3.25,
        priceText: "$3.25",
        sourceType: "manual_seed",
        verified: false,
        sourceUrl: "manual-seed",
      },
      {
        name: "Egg sandwich",
        price: 8.95,
        priceText: "$8.95",
        sourceType: "manual_seed",
        verified: false,
        sourceUrl: "manual-seed",
      },
    ],
  },
  {
    id: "victorias-pastry",
    placeName: "Victoria Pastry",
    address: "700 Filbert St, San Francisco, CA",
    neighborhood: "North Beach",
    lat: 37.8012,
    lng: -122.4105,
    items: [
      {
        name: "Italian pastry",
        price: 4.5,
        priceText: "$4.50",
        sourceType: "manual_seed",
        verified: false,
        sourceUrl: "manual-seed",
      },
    ],
  },
  {
    id: "sub-center",
    placeName: "Sub Center",
    address: "820 Ulloa St, San Francisco, CA",
    neighborhood: "West Portal",
    lat: 37.7405,
    lng: -122.4653,
    items: [
      {
        name: "Small sandwich",
        price: 8.95,
        priceText: "$8.95",
        sourceType: "manual_seed",
        verified: false,
        sourceUrl: "manual-seed",
      },
    ],
  },
];

export const cheapFoodResources: FoodResource[] = cheapFoodPlaces.map(
  (place) => {
    const lowestPrice = Math.min(...place.items.map((item) => item.price));

    return {
      id: `cheap-food-${place.id}`,
      name: place.placeName,
      category: "Cheap food",
      address: place.address,
      neighborhood: place.neighborhood,
      hours: "Check current hours before visiting",
      cost: lowestPrice < 5 ? "Under $5" : "Under $10",
      eligibility: "Open to the public",
      website: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${place.placeName} ${place.address}`,
      )}`,
      phone: null,
      lastVerified: "2026-06-09",
      lat: place.lat,
      lng: place.lng,
      tags: ["cheap food", ...place.items.map((item) => item.name.toLowerCase())],
      source: "curated",
      cheapestItems: place.items,
    };
  },
);
