export type Language = 'ar' | 'en';
export type FontFamily = 'cairo' | 'alexandria' | 'almarai' | 'amiri' | 'tajawal';

export type PageViewId = 
  | 'home' 
  | 'menu' 
  | 'custom-cake' 
  | 'catering' 
  | 'reservation' 
  | 'orders' 
  | 'story' 
  | 'reviews' 
  | 'admin';

export type DessertCategory = 
  | 'all'
  | 'chantilly_cakes'
  | 'oriental'
  | 'western'
  | 'gifts';

export interface PortionOption {
  label: { ar: string; en: string };
  servings?: { ar: string; en: string };
  priceMultiplier: number;
  weightOrPieces?: { ar: string; en: string };
}

export interface DessertItem {
  id: string;
  name: { ar: string; en: string };
  category: DessertCategory;
  subCategory?: { ar: string; en: string };
  price: number;
  image: string;
  description: { ar: string; en: string };
  ingredients: { ar: string; en: string };
  portionOptions: PortionOption[];
  dietaryTags: string[];
  sweetnessLevels?: string[];
  sweetnessLevel?: number | string;
  rating: number;
  reviewCount?: number;
  reviewsCount?: number;
  preparationTimeMinutes?: number;
  isBestSeller?: boolean;
  isChefSpecial?: boolean;
  calories?: number;
  caloriesApprox?: number;
}

export interface CartItem {
  item: DessertItem;
  quantity: number;
  selectedPortion: PortionOption;
  sweetnessPreference?: string;
  specialNote?: string;
}

export interface TestimonialItem {
  id: string;
  author: { ar: string; en: string };
  role: { ar: string; en: string };
  rating: number;
  date: { ar: string; en: string };
  comment: { ar: string; en: string };
  favoriteItem: { ar: string; en: string };
}

export type CustomerReview = TestimonialItem;

export interface CateringInquiry {
  id?: string;
  eventType: string;
  guestCount: number;
  ratioOriental?: number; // percentage
  ratioWestern?: number; // percentage
  tier?: 'gold' | 'velvet' | 'crystal';
  eventDate: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  notes?: string;
  createdAt?: string;
  createdAtTimestamp?: number;
  status?: 'new' | 'contacted' | 'confirmed' | 'cancelled';
}

export type OrderStatus = 'new' | 'preparing' | 'on_the_way' | 'delivered' | 'cancelled';

export interface OrderRecord {
  id?: string;
  orderNumber: string;
  createdAt: string;
  createdAtTimestamp?: number;
  exactOrderTimeFormatted?: string;
  customerName: string;
  customerPhone: string;
  governorate?: string;
  address?: string;
  selectedBranch?: string;
  deliveryType: 'delivery' | 'pickup';
  timing: 'asap' | 'scheduled';
  scheduledTime?: string;
  paymentMethod: 'cod' | 'card';
  isGiftWrap: boolean;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  uploadedImages?: string[];
  items: {
    id: string;
    nameAr: string;
    nameEn: string;
    portionAr: string;
    portionEn: string;
    quantity: number;
    price: number;
    image?: string;
    sweetnessPreference?: string;
    specialNote?: string;
  }[];
}

export type ReservationStatus = 'pending' | 'confirmed' | 'seated' | 'cancelled';

export interface ReservationRecord {
  id?: string;
  reservationCode: string;
  createdAt: string;
  createdAtTimestamp?: number;
  date: string;
  timeSlot: string;
  guests: number;
  seating: 'indoor' | 'terrace' | 'majlis';
  guestName: string;
  guestPhone: string;
  specialOccasion?: string;
  status: ReservationStatus;
}

export interface ShopSettings {
  whatsappNumber: string; // e.g. "201069844724"
  shopNameAr: string;
  shopNameEn: string;
  currencySymbol: string;
  adminPin: string; // quick access pin or pass
}
