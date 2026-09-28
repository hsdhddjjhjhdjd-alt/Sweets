import React, { useState, useEffect } from 'react';
import { 
  X, Search, Package, Clock, CheckCircle2, Truck, Phone, 
  MapPin, AlertCircle, Sparkles, ChevronRight, MessageSquare 
} from 'lucide-react';
import { Language, OrderRecord, OrderStatus } from '../types';
import { subscribeToOrders, getShopSettings } from '../services/shopService';

interface OrderTrackingModalProps {
  isOpen: boolean;
  language: Language;
  onClose: () => void;
  initialQuery?: string;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  language,
  onClose,
  initialQuery = '',
}) => {
  if (!isOpen) return null;
  const isAr = language === 'ar';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [allOrders, setAllOrders] = useState<OrderRecord[]>([]);
  const [shopWhatsApp, setShopWhatsApp] = useState('201069844724');

  useEffect(() => {
    getShopSettings().then((s) => {
      if (s.whatsappNumber) setShopWhatsApp(s.whatsappNumber);
    });
    const unsub = subscribeToOrders((orders) => {
      setAllOrders(orders);
    });
    return () => unsub();
  }, []);

  const filteredOrders = allOrders.filter((order) => {
    if (!searchQuery.trim()) return false;
    const q = searchQuery.trim().toLowerCase();
    const cleanQ = q.replace(/[^0-9]/g, '');
    const cleanPhone = (order.customerPhone || '').replace(/[^0-9]/g, '');

    const matchOrderNum = order.orderNumber.toLowerCase().includes(q);
    const matchName = order.customerName.toLowerCase().includes(q);
    const matchPhone = cleanQ.length >= 4 && cleanPhone.includes(cleanQ);

    return matchOrderNum || matchName || matchPhone;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'new':
        return {
          text: isAr ? 'طلب جديد مؤكد' : 'Order Confirmed',
          color: 'bg-amber-100 text-amber-800 border-amber-300',
          step: 1,
        };
      case 'preparing':
        return {
          text: isAr ? 'قيد التجهيز طازجاً في الأفران' : 'Fresh in Oven',
          color: 'bg-rose-100 text-rose-800 border-rose-300',
          step: 2,
        };
      case 'on_the_way':
        return {
          text: isAr ? 'خرج للتوصيل المبرد' : 'Out for Delivery',
          color: 'bg-sky-100 text-sky-800 border-sky-300',
          step: 3,
        };
      case 'delivered':
        return {
          text: isAr ? 'تم التسليم بالهناء والشفاء' : 'Delivered',
          color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          step: 4,
        };
      case 'cancelled':
        return {
          text: isAr ? 'ملغي' : 'Cancelled',
          color: 'bg-stone-200 text-stone-600 border-stone-300',
          step: 0,
        };
      default:
        return {
          text: isAr ? 'مؤكد' : 'Confirmed',
          color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          step: 1,
        };
    }
  };

  const steps = [
    { num: 1, label: isAr ? 'تأكيد الطلب' : 'Confirmed' },
    { num: 2, label: isAr ? 'تجهيز طازج' : 'In Oven' },
    { num: 3, label: isAr ? 'خرج للتوصيل' : 'On The Way' },
    { num: 4, label: isAr ? 'تم التسليم' : 'Delivered' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200 flex flex-col text-stone-900 my-auto"
        onClick={(e) => e.stopPropagation()}
        dir={isAr ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#6B0817] via-[#8B1528] to-[#550512] text-white p-6 relative rounded-t-3xl shrink-0">
          <button
            onClick={onClose}
            className="absolute top-5 end-5 p-1.5 text-stone-300 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#DFB15B] text-xs font-semibold backdrop-blur-xs mb-2 border border-white/10">
            <Package className="w-4 h-4 text-[#DFB15B]" />
            <span>{isAr ? 'خدمة المتابعة الحية الملكية' : 'Live Order Tracking'}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
            {isAr ? 'متابعة حالة وتفاصيل طلباتك 📦' : 'Track Your Royal Orders'}
          </h2>
          <p className="text-xs text-stone-200 mt-1">
            {isAr
              ? 'أدخل رقم هاتفك أو رقم الطلب (مثال: RY-1234 أو رقم الموبايل) لمعرفة حالة التجهيز والتوصيل فورياً.'
              : 'Enter your phone number or order number to see real-time preparation and delivery updates.'}
          </p>
        </div>

        {/* Search Bar */}
        <div className="p-5 border-b border-stone-200 bg-stone-50">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute start-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? 'اكتب رقم هاتفك (010...) أو رقم الطلب...' : 'Enter your phone number or order #...'}
              className="w-full ps-10 pe-4 py-3 text-xs sm:text-sm bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-[#8B1528] shadow-2xs font-medium"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600 font-semibold"
              >
                {isAr ? 'مسح' : 'Clear'}
              </button>
            )}
          </div>
        </div>

        {/* Results Body */}
        <div className="p-5 sm:p-6 space-y-4 flex-1">
          {!searchQuery.trim() ? (
            <div className="text-center py-10 text-stone-400 space-y-3">
              <Package className="w-12 h-12 mx-auto text-stone-300 stroke-[1.5]" />
              <p className="text-xs sm:text-sm text-stone-600 font-medium">
                {isAr
                  ? 'اكتب رقم هاتفك أو رقم طلبك بالخانة أعلاه للبحث عن طلباتك المسجلة'
                  : 'Type your phone number or order number above to find your orders'}
              </p>
              <div className="text-[11px] text-stone-400 max-w-sm mx-auto">
                {isAr
                  ? 'يتم تحديث حالات الطلبات لحظياً من قبل إدارة المحل عند تجهيزها وخروجها مع المندوب.'
                  : 'Order status is updated live by the shop as our chefs prepare and dispatch them.'}
              </div>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-10 text-stone-500 space-y-2">
              <AlertCircle className="w-10 h-10 mx-auto text-amber-500" />
              <p className="text-sm font-bold text-stone-800">
                {isAr ? 'لم نعثر على طلبات مطابقة لهذا البحث' : 'No orders found matching this search'}
              </p>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                {isAr
                  ? 'تأكد من كتابة نفس رقم الهاتف الذي تم تسجيل الطلب به، أو تواصل مباشرة مع المحل عبر واتساب.'
                  : 'Please verify the phone number used during checkout, or contact the store directly on WhatsApp.'}
              </p>
              <a
                href={`https://api.whatsapp.com/send?phone=${shopWhatsApp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 mt-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{isAr ? 'الاستفسار عن طلبي عبر واتساب' : 'Inquire via WhatsApp'}</span>
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-xs font-semibold text-stone-500 flex justify-between">
                <span>{isAr ? `تم العثور على ${filteredOrders.length} طلب:` : `Found ${filteredOrders.length} orders:`}</span>
              </div>

              {filteredOrders.map((order) => {
                const badge = getStatusBadge(order.status || 'new');
                return (
                  <div
                    key={order.id || order.orderNumber}
                    className="border border-stone-200 rounded-2xl p-4 bg-stone-50/60 hover:bg-white hover:border-[#8B1528]/30 transition-all shadow-2xs space-y-3"
                  >
                    {/* Top Row: Order # & Status */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-stone-200">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-[#8B1528] bg-rose-50 px-2.5 py-0.5 rounded-md border border-rose-200">
                          #{order.orderNumber}
                        </span>
                        <span className="text-xs text-stone-500 font-medium">
                          {order.customerName}
                        </span>
                      </div>

                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${badge.color}`}>
                        {badge.text}
                      </span>
                    </div>

                    {/* Progress Stepper */}
                    {badge.step > 0 && (
                      <div className="py-2">
                        <div className="grid grid-cols-4 gap-1 relative">
                          {steps.map((st) => {
                            const isPassed = badge.step >= st.num;
                            const isCurrent = badge.step === st.num;
                            return (
                              <div key={st.num} className="flex flex-col items-center text-center">
                                <div
                                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                    isCurrent
                                      ? 'bg-[#8B1528] text-white ring-4 ring-rose-100 shadow-sm'
                                      : isPassed
                                      ? 'bg-emerald-600 text-white'
                                      : 'bg-stone-200 text-stone-500'
                                  }`}
                                >
                                  {isPassed && !isCurrent ? '✓' : st.num}
                                </div>
                                <span className={`text-[10px] mt-1 font-semibold ${isPassed ? 'text-stone-800' : 'text-stone-400'}`}>
                                  {st.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Items List */}
                    <div className="bg-white rounded-xl p-3 border border-stone-200 text-xs space-y-1.5">
                      <span className="font-semibold text-stone-700 block text-[11px]">
                        {isAr ? 'الأصناف في هذا الطلب:' : 'Items in Order:'}
                      </span>
                      {order.items?.map((it, idx) => (
                        <div key={idx} className="flex justify-between text-stone-600 text-xs">
                          <span>• {it.quantity}x {it.nameAr || it.nameEn} ({it.portionAr || ''})</span>
                          <span className="font-mono font-medium">{it.price * it.quantity} ج.م</span>
                        </div>
                      ))}

                      <div className="pt-2 border-t border-stone-200 flex justify-between font-bold text-stone-900">
                        <span>{isAr ? 'إجمالي الطلب:' : 'Total:'}</span>
                        <span className="text-[#8B1528] font-mono text-sm">{order.total} ج.م</span>
                      </div>
                    </div>

                    {/* Location & WhatsApp Button */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                      <div className="text-stone-500 flex items-center gap-1 text-[11px]">
                        <MapPin className="w-3.5 h-3.5 text-[#8B1528] shrink-0" />
                        <span className="truncate max-w-[220px]">
                          {order.governorate ? `${order.governorate} - ` : ''}{order.address || (isAr ? 'استلام من الفرع' : 'Pickup')}
                        </span>
                      </div>

                      <a
                        href={`https://api.whatsapp.com/send?phone=${shopWhatsApp.replace(/[^0-9]/g, '')}&text=${encodeURIComponent(
                          `مرحباً، أود الاستفسار عن حالة طلبي رقم #${order.orderNumber} باسم ${order.customerName}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-semibold border border-emerald-200 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{isAr ? 'مراسلة المحل بشأن هذا الطلب' : 'Chat on WhatsApp'}</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
