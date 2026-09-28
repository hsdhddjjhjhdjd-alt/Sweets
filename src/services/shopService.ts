import {
  collection,
  addDoc,
  updateDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  getDoc,
  setDoc,
  getDocs,
} from 'firebase/firestore';
import { db } from './firebase';
import {
  OrderRecord,
  ReservationRecord,
  CateringInquiry,
  OrderStatus,
  ReservationStatus,
  ShopSettings,
} from '../types';

export const ORDERS_COL = 'orders';
export const RESERVATIONS_COL = 'reservations';
export const CATERING_COL = 'cateringInquiries';
export const SETTINGS_COL = 'settings';
export const SETTINGS_DOC_ID = 'shop_config';

const LOCAL_ORDERS_KEY = 'royal_patisserie_local_orders';

export const DEFAULT_SETTINGS: ShopSettings = {
  whatsappNumber: '201069844724', // Egypt WhatsApp format (+20 1069844724)
  shopNameAr: 'قصر الحلويات الملكي',
  shopNameEn: 'Royal Pâtisserie',
  currencySymbol: 'ج.م',
  adminPin: '1234', // default security pin for shop manager
};

// Helper to remove undefined keys recursively
const cleanObject = <T extends Record<string, any>>(obj: T): T => {
  const result: any = Array.isArray(obj) ? [] : {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      result[key] =
        value && typeof value === 'object' && !(value instanceof Date)
          ? cleanObject(value)
          : value;
    }
  }
  return result;
};

// Local storage backup helpers
const getLocalOrders = (): OrderRecord[] => {
  try {
    const raw = localStorage.getItem(LOCAL_ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveLocalOrder = (order: OrderRecord) => {
  try {
    const existing = getLocalOrders();
    const filtered = existing.filter((o) => o.id !== order.id && o.orderNumber !== order.orderNumber);
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify([order, ...filtered]));
  } catch (e) {
    console.warn('Could not save to localStorage:', e);
  }
};

const getAbsoluteUrl = (path: string | undefined): string => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  return `${origin}${normalizedPath}`;
};

// --- Orders: Save directly to Cloud Firestore ---
export const saveNewOrder = async (order: Omit<OrderRecord, 'id'>): Promise<string> => {
  const now = new Date();
  
  // Transform all item images and uploaded images to absolute URLs
  const itemsWithAbsoluteImages = order.items?.map((item) => ({
    ...item,
    image: getAbsoluteUrl(item.image),
  })) || [];

  const uploadedImagesWithAbsolute = order.uploadedImages?.map((img) => getAbsoluteUrl(img));

  const cleaned = cleanObject({
    ...order,
    items: itemsWithAbsoluteImages,
    ...(uploadedImagesWithAbsolute ? { uploadedImages: uploadedImagesWithAbsolute } : {}),
    createdAt: order.createdAt || now.toISOString(),
    createdAtTimestamp: order.createdAtTimestamp || now.getTime(),
    exactOrderTimeFormatted: order.exactOrderTimeFormatted || now.toLocaleString('ar-EG', {
      timeZone: 'Africa/Cairo',
      dateStyle: 'full',
      timeStyle: 'medium',
    }),
  });

  try {
    const docRef = await addDoc(collection(db, ORDERS_COL), cleaned);
    console.log('Order synced to cloud Firestore successfully:', docRef.id);
    const completeRemote: OrderRecord = { id: docRef.id, ...cleaned };
    saveLocalOrder(completeRemote);
    return docRef.id;
  } catch (error) {
    console.error('Error writing order to cloud Firestore:', error);
    throw error;
  }
};

export const subscribeToOrders = (callback: (orders: OrderRecord[]) => void) => {
  // Provide initial local orders instantly for zero-latency UX
  const local = getLocalOrders();
  if (local.length > 0) {
    callback(local);
  }

  try {
    const q = query(collection(db, ORDERS_COL), orderBy('createdAt', 'desc'));
    return onSnapshot(
      q,
      (snapshot) => {
        const remoteOrders: OrderRecord[] = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<OrderRecord, 'id'>),
        }));

        // Merge remote with any unique local orders
        const localList = getLocalOrders();
        const mergedMap = new Map<string, OrderRecord>();

        remoteOrders.forEach((o) => {
          const key = String(o.orderNumber || o.id || Math.random());
          mergedMap.set(key, o);
        });
        localList.forEach((o) => {
          const key = String(o.orderNumber || o.id || Math.random());
          if (!mergedMap.has(key)) {
            mergedMap.set(key, o);
          }
        });

        callback(Array.from(mergedMap.values()));
      },
      (err) => {
        console.warn('Orders listener notice (using local fallback cache):', err.message);
        callback(getLocalOrders());
      }
    );
  } catch (err) {
    console.warn('Firestore subscription notice:', err);
    callback(getLocalOrders());
    return () => {};
  }
};

export const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
  try {
    const docRef = doc(db, ORDERS_COL, orderId);
    await updateDoc(docRef, { status });
  } catch (err) {
    console.warn('Error updating status in cloud:', err);
  }

  // Update local
  const local = getLocalOrders();
  const updated = local.map((o) => (o.id === orderId ? { ...o, status } : o));
  localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(updated));
};

// --- Reservations ---
export const saveReservation = async (reservation: Omit<ReservationRecord, 'id'>): Promise<string> => {
  const now = new Date();
  const cleaned = cleanObject({
    ...reservation,
    createdAt: reservation.createdAt || now.toISOString(),
    createdAtTimestamp: now.getTime(),
  });

  try {
    const docRef = await addDoc(collection(db, RESERVATIONS_COL), cleaned);
    console.log('Reservation synced to cloud Firestore successfully:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error writing reservation to cloud Firestore:', error);
    throw error;
  }
};

export const saveNewReservation = saveReservation;

export const subscribeToReservations = (callback: (reservations: ReservationRecord[]) => void) => {
  try {
    const q = query(collection(db, RESERVATIONS_COL), orderBy('createdAt', 'desc'));
    return onSnapshot(
      q,
      (snapshot) => {
        const reservations: ReservationRecord[] = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<ReservationRecord, 'id'>),
        }));
        callback(reservations);
      },
      (err) => {
        console.warn('Reservations listener notice:', err.message);
        callback([]);
      }
    );
  } catch (err) {
    console.warn('Reservations listener notice:', err);
    callback([]);
    return () => {};
  }
};

export const updateReservationStatus = async (reservationId: string, status: ReservationStatus) => {
  try {
    const docRef = doc(db, RESERVATIONS_COL, reservationId);
    await updateDoc(docRef, { status });
  } catch (err) {
    console.warn('Error updating reservation in cloud:', err);
  }
};

// --- Catering Inquiries ---
export const saveCateringInquiry = async (inquiry: Omit<CateringInquiry, 'id'>): Promise<string> => {
  const now = new Date();
  const cleaned = cleanObject({
    ...inquiry,
    createdAt: inquiry.createdAt || now.toISOString(),
    createdAtTimestamp: now.getTime(),
  });

  try {
    const docRef = await addDoc(collection(db, CATERING_COL), cleaned);
    console.log('Catering inquiry synced to cloud Firestore successfully:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error writing catering inquiry to cloud Firestore:', error);
    throw error;
  }
};

export const saveNewCateringInquiry = saveCateringInquiry;

export const subscribeToCateringInquiries = (callback: (inquiries: CateringInquiry[]) => void) => {
  try {
    const q = query(collection(db, CATERING_COL), orderBy('createdAt', 'desc'));
    return onSnapshot(
      q,
      (snapshot) => {
        const inquiries: CateringInquiry[] = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<CateringInquiry, 'id'>),
        }));
        callback(inquiries);
      },
      (err) => {
        console.warn('Catering listener notice:', err.message);
        callback([]);
      }
    );
  } catch (err) {
    console.warn('Catering listener notice:', err);
    callback([]);
    return () => {};
  }
};

export const subscribeToCatering = subscribeToCateringInquiries;

export const updateCateringStatus = async (inquiryId: string, status: 'new' | 'contacted' | 'confirmed' | 'cancelled') => {
  try {
    const docRef = doc(db, CATERING_COL, inquiryId);
    await updateDoc(docRef, { status });
  } catch (err) {
    console.warn('Error updating catering inquiry in cloud:', err);
  }
};

// --- Shop Settings ---
export const getShopSettings = async (): Promise<ShopSettings> => {
  try {
    const docSnap = await getDoc(doc(db, SETTINGS_COL, SETTINGS_DOC_ID));
    if (docSnap.exists()) {
      return { ...DEFAULT_SETTINGS, ...docSnap.data() } as ShopSettings;
    }
  } catch (err) {
    console.warn('Could not read settings from cloud, using default:', err);
  }

  try {
    const local = localStorage.getItem('royal_patisserie_shop_settings');
    if (local) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(local) };
    }
  } catch {}

  return DEFAULT_SETTINGS;
};

export const updateShopSettings = async (settings: Partial<ShopSettings>): Promise<void> => {
  try {
    await setDoc(doc(db, SETTINGS_COL, SETTINGS_DOC_ID), settings, { merge: true });
  } catch (err) {
    console.warn('Could not save settings to cloud, saving local fallback:', err);
  }

  try {
    const current = await getShopSettings();
    localStorage.setItem('royal_patisserie_shop_settings', JSON.stringify({ ...current, ...settings }));
  } catch {}
};

export const saveShopSettings = updateShopSettings;
