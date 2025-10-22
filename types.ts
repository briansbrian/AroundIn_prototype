

export interface GeoLocation {
  latitude: number;
  longitude: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  image?: string;
}

export interface Shop {
  id:string;
  name: string;
  category: 'Electronics' | 'Food' | 'Service' | 'General';
  location: GeoLocation;
  distance: string;
  rating: number;
  products: Product[];
  image: string;
  isSaved?: boolean;
}

export interface ShopTemplate {
  name: string;
  category: 'Electronics' | 'Food' | 'General' | 'Service';
  image: string;
  description: string;
  products: Product[];
}


export interface GroundingChunk {
  maps: {
    uri: string;
    title: string;
    placeAnswerSources?: {
      reviewSnippets: {
        uri: string;
        text: string;
      }[];
    };
  };
}

// Chat-related types
export interface TextMessage {
  id: string;
  type: 'text';
  text: string;
  sender: 'user' | 'seller';
}

export interface ProductTagMessage {
  id: string;
  type: 'product_tag';
  product: Product;
  sender: 'user';
}

export type ChatMessage = TextMessage | ProductTagMessage;