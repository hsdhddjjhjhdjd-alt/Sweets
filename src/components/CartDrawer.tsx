import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft, Tag, Truck, Store, Check } from 'lucide-react';
import { Language, CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  language: Language;
  cart: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (index: number, newQuantity: number) => void;
  onRemoveItem: (index: number) => void;
  onProceedToCheckout: (orderSummary: {
    subtotal: number;
    discount: number;
    deliveryFee: number;
    total: number;
    deliveryType: 'delivery' | 'pickup';
    appliedPromo: string | null;
  }) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  language,
  cart,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  const isAr = language === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Calculations
  const subtotal = cart.reduce((acc, item) => {
    const unitPrice = Math.round(item.item.price * item.selectedPortion.priceMultiplier);
    return acc + unitPrice * item.quantity;
  }, 0);

  const discountRate = appliedPromo === 'ROYAL10' ? 0.1 : 0;
  const discount = Math.round(subtotal * discountRate);

  const deliveryFee = deliveryType === 'pickup' ? 0 : subtotal >= 60 ? 0 : 7;
  const grandTotal = subtotal - discount + deliveryFee;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) return;

    if (promoCode.trim().toUpperCase() === 'ROYAL10') {
      setAppliedPromo('ROYAL10');
      setPromoError(null);
    } else {
      setPromoError(isAr ? 'كود الخصم غير صالح أو منتهي الصلاحية' : 'Invalid or expired promotional code');
    }
  };

  const handleCheckout = () => {
    onProceedToCheckout({
      subtotal,
      discount,
      deliveryFee,
      total: grandTotal,
      deliveryType,
      appliedPromo,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose}></div>

      <div
        className={`absolute inset-y-0 ${
          isAr ? 'left-0' : 'right-0'
        } max-w-full w-full sm:max-w-md bg-white shadow-2xl flex flex-col z-10 border-s border-stone-200`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#8B1528]" />
            <h2 className="text-base font-bold font-display text-stone-900">
              {isAr ? 'سلة الطلبات' : 'Your Order Bag'}
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#8B1528]/10 text-[#8B1528]">
              {cart.reduce((sum, item) => sum + item.quantity, 0)} {isAr ? 'أصناف' : 'items'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 divide-y divide-stone-100">
          {cart.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-stone-100 text-stone-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-stone-900 font-display">
                {isAr ? 'سلة طلباتك فارغة حالياً' : 'Your shopping bag is empty'}
              </h3>
              <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                {isAr
                  ? 'استكشف إبداعاتنا الملكية من الكنافة والبقلاوة والباتيسري الفرنسي'
                  : 'Explore our exquisite oriental knafeh, baklava, and Parisian gateaux'}
              </p>
              <button
                onClick={onClose}
                className="mt-6 px-5 py-2.5 bg-[#8B1528] text-white text-xs font-semibold rounded-lg hover:bg-[#700C1C]"
              >
                {isAr ? 'تصفح قائمة الحلويات' : 'Explore Menu'}
              </button>
            </div>
          ) : (
            cart.map((cartItem, idx) => {
              const unitPrice = Math.round(
                cartItem.item.price * cartItem.selectedPortion.priceMultiplier
              );
              const itemTotal = unitPrice * cartItem.quantity;

              return (
                <div key={idx} className="py-4 flex gap-3">
                  {/* Thumbnail */}
                  <img
                    src={cartItem.item.image}
                    alt={cartItem.item.name[language]}
                    className="w-18 h-18 sm:w-20 sm:h-20 object-cover rounded-xl border border-stone-200 shrink-0"
                  />

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-stone-900 line-clamp-1 leading-snug">
                          {cartItem.item.name[language]}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(idx)}
                          className="text-stone-400 hover:text-rose-700 transition-colors p-1"
                          title={isAr ? 'حذف' : 'Remove'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-[11px] text-stone-500 mt-0.5">
                        <span>{cartItem.selectedPortion.label[language]}</span>
                        {cartItem.sweetnessPreference && (
                          <span> · {cartItem.sweetnessPreference}</span>
                        )}
                      </div>

                      {cartItem.specialNote && (
                        <p className="text-[10px] text-stone-400 italic line-clamp-1 mt-0.5">
                          "{cartItem.specialNote}"
                        </p>
                      )}
                    </div>

                    {/* Quantity Stepper & Price */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-stone-200 rounded-md bg-stone-50">
                        <button
                          onClick={() => onUpdateQuantity(idx, cartItem.quantity - 1)}
                          className="px-2 py-0.5 text-stone-600 hover:text-stone-900"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-semibold tabular-nums text-stone-800">
                          {cartItem.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(idx, cartItem.quantity + 1)}
                          className="px-2 py-0.5 text-stone-600 hover:text-stone-900"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs sm:text-sm font-bold text-stone-900 font-display tabular-nums">
                        ${itemTotal}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer / Summary (Visible if cart has items) */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-stone-200 bg-stone-50 space-y-4">
            {/* Delivery or Pickup Segmented Control */}
            <div className="grid grid-cols-2 p-1 bg-stone-200/70 rounded-lg text-xs font-semibold">
              <button
                type="button"
                onClick={() => setDeliveryType('delivery')}
                className={`py-1.5 flex items-center justify-center gap-1.5 rounded-md transition-all ${
                  deliveryType === 'delivery'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Truck className="w-3.5 h-3.5 text-[#8B1528]" />
                <span>{isAr ? 'توصيل مبرد سريع' : 'Chilled Delivery'}</span>
              </button>
              <button
                type="button"
                onClick={() => setDeliveryType('pickup')}
                className={`py-1.5 flex items-center justify-center gap-1.5 rounded-md transition-all ${
                  deliveryType === 'pickup'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Store className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>{isAr ? 'استلام من الفرع' : 'Branch Pickup'}</span>
              </button>
            </div>

            {/* Promo Code Input */}
            <div>
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-stone-400 absolute start-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => {
                      setPromoCode(e.target.value);
                      setPromoError(null);
                    }}
                    placeholder={isAr ? 'كود الخصم (جرب ROYAL10)' : 'Promo Code (e.g. ROYAL10)'}
                    className="w-full ps-8 pe-3 py-1.5 text-xs bg-white border border-stone-200 rounded-lg uppercase"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-stone-800 hover:bg-stone-900 text-white text-xs font-semibold rounded-lg"
                >
                  {isAr ? 'تطبيق' : 'Apply'}
                </button>
              </form>
              {appliedPromo && (
                <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  {isAr ? 'تم تطبيق خصم 10% بنجاح!' : '10% VIP Discount Applied!'}
                </p>
              )}
              {promoError && (
                <p className="text-[11px] text-rose-600 mt-1">{promoError}</p>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>{isAr ? 'المجموع الفرعي:' : 'Subtotal:'}</span>
                <span className="font-semibold text-stone-900 tabular-nums">${subtotal}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>{isAr ? 'خصم الكوبون الملكي:' : 'Royal Promo Discount:'}</span>
                  <span className="font-semibold tabular-nums">-${discount}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>
                  {deliveryType === 'pickup'
                    ? (isAr ? 'الاستلام من الفرع:' : 'Branch Pickup:')
                    : (isAr ? 'رسوم التوصيل المبرد:' : 'Chilled Express Delivery:')}
                </span>
                <span className="font-semibold text-stone-900 tabular-nums">
                  {deliveryFee === 0 ? (isAr ? 'مجاناً' : 'Free') : `$${deliveryFee}`}
                </span>
              </div>

              {deliveryType === 'delivery' && subtotal < 60 && (
                <p className="text-[10px] text-stone-400">
                  {isAr
                    ? `أضف بقيمة $${60 - subtotal} أخرى للحصول على توصيل مجاني`
                    : `Add $${60 - subtotal} more for complimentary delivery`}
                </p>
              )}

              <div className="flex items-baseline justify-between pt-2 border-t border-stone-200 text-sm font-bold text-stone-900">
                <span className="font-display">{isAr ? 'المجموع النهائي:' : 'Grand Total:'}</span>
                <span className="text-xl text-[#8B1528] font-display tabular-nums">
                  ${grandTotal}
                </span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={handleCheckout}
              className="w-full py-3 bg-[#8B1528] hover:bg-[#700C1C] text-white text-xs sm:text-sm font-semibold rounded-lg shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isAr ? 'متابعة إتمام الطلب' : 'Proceed to Checkout'}</span>
              <ArrowIcon className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
