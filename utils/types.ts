export interface FoodItem {
  _id: string; // Add this line
  name: string;
  unit: string;
  amount: string;
  category: string;
  location: string;
  expirationDate: string;
  dateAdded: string;
}

export interface ScannedCollection {
  _id?: string;
  title: string;
  image: string;
  items: FoodItem[];
  dateAdded: string;
}
