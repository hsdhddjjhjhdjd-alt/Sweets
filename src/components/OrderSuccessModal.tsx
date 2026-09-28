import React from 'react';
import { Crown, Sparkles, MapPin, CheckCircle2, ShoppingBag, PhoneCall } from 'lucide-react';
import { Language } from '../types';

interface OrderSuccessModalProps {
  isOpen: boolean;
  language: Language;
  orderNumber: string;
  customerName: string;
  governorate?: string;
  address?: string;
  deliveryType: 'delivery' | 'pickup';
  selectedBranchName?: string;
  total: number;
  itemCount: number;
  onClose: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  isOpen,
  language,
  orderNumber,
  customerName,
  governorate,
  address,
  deliveryType,
  selectedBranchName,
  total,
  itemCount,
  onClose,
}) => {
  if (!isOpen) return null;
  const isAr = language === 'ar';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-sm animate-in fade-in duration-300">
      <div
        className="relative bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200 animate-celebrate-pop flex flex-col text-center"
        onClick={(e) => e.stopPropagation()}
        dir={isAr ? 'rtl' : 'ltr'}
      >
        {/* Top Decorative Banner */}
        <div className="bg-gradient-to-r from-[#7A0C1E] via-[#8B1528] to-[#5C0816] text-white pt-8 pb-10 px-6 relative overflow-hidden">
          {/* Subtle gold sparkles pattern */}
          <div className="absolute top-2 left-4 text-[#DFB15B]/30 animate-pulse-subtle">
            <Sparkles className="w-8 h-8" />
          </div>
          <div className="absolute bottom-2 right-4 text-[#DFB15B]/30 animate-pulse-subtle">
            <Crown className="w-10 h-10" />
          </div>

          {/* Animated Checkmark Circle */}
          <div className="relative w-24 h-24 mx-auto mb-4 flex items-center justify-center">
            {/* Soft pulsing glow behind */}
            <div className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping opacity-60" />
            
            <svg
              className="w-24 h-24 transform -rotate-90 drop-shadow-md"
              viewBox="0 0 100 100"
            >
              {/* Background track circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth="6"
                fill="none"
              />
              {/* Animated drawing circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#10B981"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
                className="animate-check-circle"
              />
            </svg>

            {/* Checkmark SVG inside */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="w-12 h-12 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path
                  d="M20 6L9 17l-5-5"
                  className="animate-check-stroke"
                />
              </svg>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-[#DFB15B] text-xs font-semibold backdrop-blur-xs mb-2 border border-white/10">
            <Crown className="w-3.5 h-3.5 text-[#DFB15B]" />
            <span>{isAr ? 'قصر الحلويات الملكي' : 'Royal Pâtisserie'}</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold font-display text-white tracking-wide">
            {isAr ? 'تم إتمام الشراء وتأكيد طلبكم بنجاح!' : 'Order Successfully Completed!'}
          </h3>
          <p className="text-xs text-stone-200 mt-1 max-w-sm mx-auto leading-relaxed">
            {isAr
              ? `شكراً لثقتكم يا ${customerName}. تم تسجيل طلبكم وتأكيده مع إدارة المحل، وجاري التحضير طازجاً.`
              : `Thank you ${customerName}. Your order is confirmed and currently being freshly prepared by our master chefs.`}
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          {/* Order Details Card */}
          <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-4 text-xs space-y-2.5 text-start">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <span className="text-stone-500">{isAr ? 'رقم الطلب الملكي:' : 'Order Number:'}</span>
              <span className="font-mono font-bold text-sm text-[#8B1528] bg-rose-50 px-2.5 py-0.5 rounded-md border border-rose-200">
                #{orderNumber}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-stone-500">{isAr ? 'حالة الطلب:' : 'Order Status:'}</span>
              <span className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {isAr ? 'مؤكد وجاري التجهيز طازجاً' : 'Confirmed & Fresh in Oven'}
              </span>
            </div>

            {deliveryType === 'delivery' ? (
              <div className="flex items-start justify-between gap-2">
                <span className="text-stone-500 shrink-0">{isAr ? 'العنوان والمحافظة:' : 'Location:'}</span>
                <span className="font-medium text-stone-800 text-end flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#8B1528] shrink-0 inline" />
                  {governorate ? `${governorate} - ` : ''}{address || (isAr ? 'توصيل للمنزل' : 'Home Delivery')}
                </span>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-2">
                <span className="text-stone-500 shrink-0">{isAr ? 'الفرع المحدد:' : 'Branch:'}</span>
                <span className="font-medium text-stone-800 text-end">
                  {selectedBranchName || (isAr ? 'فرع داون تاون' : 'Downtown Branch')}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-stone-500">{isAr ? 'عدد الأصناف:' : 'Items Count:'}</span>
              <span className="font-semibold text-stone-800">{itemCount} {isAr ? 'أصناف فاخرة' : 'delicacies'}</span>
            </div>

            <div className="pt-2 border-t border-stone-200 flex items-center justify-between font-bold text-sm text-stone-900">
              <span>{isAr ? 'المجموع المستحق:' : 'Total Amount:'}</span>
              <span className="text-base text-[#8B1528] font-display tabular-nums">
                {total} ج.م
              </span>
            </div>
          </div>

          {/* Quick Notice */}
          <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl text-[11px] text-amber-900 text-center flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              {isAr
                ? 'تم إرسال الطلب، وسيصلك مندوب التوصيل في أسرع وقت ساخناً وطازجاً.'
                : 'Your order will be hand-delivered hot and fresh as soon as ready.'}
            </span>
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 bg-[#8B1528] hover:bg-[#700C1C] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-lg shadow-rose-950/20 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{isAr ? 'العودة ومتابعة تصفح القائمة الملكية' : 'Continue Exploring Royal Menu'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
