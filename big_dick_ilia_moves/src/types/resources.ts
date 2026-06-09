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
  lastVerified: string;
  website: string;
  directionsUrl: string;
};
