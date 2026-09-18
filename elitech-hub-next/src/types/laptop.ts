export interface Laptop {
  id: string;
  name: string;
  brand: string;
  model: string;
  slug: string;
  price: number;
  currency: string;
  condition: 'new' | 'uk-used';
  availability: 'available' | 'limited' | 'sold' | 'reserved';
  featured: boolean;
  published: boolean;
  archived: boolean;
  
  cpu?: string;
  cpu_generation?: string;
  ram_gb?: number;
  storage_gb?: number;
  storage_type?: string;
  gpu?: string;
  display_size?: string;
  display_resolution?: string;
  os?: string;
  battery?: string;
  weight?: string;
  ports?: string;
  connectivity?: string;
  upgradeability?: string;
  
  cybersecurity_suitability?: string;
  programming_suitability?: string;
  use_cases?: string[];
  
  short_description?: string;
  description?: string;
  
  seo_title?: string;
  seo_description?: string;
  
  last_inventory_check?: string;
  created_at: string;
  updated_at: string;
  
  laptop_images?: LaptopImage[];
}

export interface LaptopImage {
  id: string;
  laptop_id: string;
  image_url: string;
  is_primary: boolean;
  sort_order: number;
  created_at: string;
}
