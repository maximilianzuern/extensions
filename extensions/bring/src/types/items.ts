export interface PurchaseItem {
    specification: string;
    name: string;
  }
  
export interface RecentlyItem {
    specification: string;
    name: string;
  }
  
export interface ShoppingList {
    uuid: string;
    status: string;
    purchase: PurchaseItem[];
    recently: RecentlyItem[];
  }