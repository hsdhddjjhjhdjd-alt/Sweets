import React, { useState, useEffect, useRef } from 'react';
import { X, CheckCircle2, Clock, Phone, MapPin, Gift, CreditCard, ShieldCheck, Loader2, Copy, Check, Building2, Store } from 'lucide-react';
import { Language, CartItem, OrderRecord } from '../types';
import { saveNewOrder, getShopSettings } from '../services/shopService';

export const EGYPT_GOVERNORATES = [
  { id: 'cairo', name: { ar: 'القاهرة (العاصمة)', en: 'Cairo (Capital)' } },
  { id: 'giza', name: { ar: 'الجيزة والشيخ زايد وأكتوبر', en: 'Giza, Zayed & October' } },
  { id: 'alexandria', name: { ar: 'الإسكندرية والساحل', en: 'Alexandria' } },
  { id: 'qalyubia', name: { ar: 'القليوبية (شبرا / بنها)', en: 'Qalyubia' } },
  { id: 'sharqia', name: { ar: 'الشرقية (الزقازيق / العاشر)', en: 'Sharqia' } },
  { id: 'dakahlia', name: { ar: 'الدقهلية (المنصورة)', en: 'Dakahlia (Mansoura)' } },
  { id: 'gharbia', name: { ar: 'الغربية (طنطا / المحلة)', en: 'Gharbia (Tanta)' } },
  { id: 'monufia', name: { ar: 'المنوفية (شبين الكوم)', en: 'Monufia' } },
  { id: 'beheira', name: { ar: 'البحيرة (دمنهور)', en: 'Beheira' } },
  { id: 'kafr_el_sheikh', name: { ar: 'كفر الشيخ', en: 'Kafr El Sheikh' } },
  { id: 'damietta', name: { ar: 'دمياط ودمياط الجديدة', en: 'Damietta' } },
  { id: 'port_said', name: { ar: 'بورسعيد', en: 'Port Said' } },
  { id: 'ismailia', name: { ar: 'الإسماعيلية', en: 'Ismailia' } },
  { id: 'suez', name: { ar: 'السويس', en: 'Suez' } },
  { id: 'faiyum', name: { ar: 'الفيوم', en: 'Faiyum' } },
  { id: 'beni_suef', name: { ar: 'بني سويف', en: 'Beni Suef' } },
  { id: 'minya', name: { ar: 'المنيا', en: 'Minya' } },
  { id: 'asyut', name: { ar: 'أسيوط', en: 'Asyut' } },
  { id: 'sohag', name: { ar: 'سوهاج', en: 'Sohag' } },
  { id: 'qena', name: { ar: 'قنا', en: 'Qena' } },
  { id: 'luxor', name: { ar: 'الأقصر', en: 'Luxor' } },
  { id: 'aswan', name: { ar: 'أسوان', en: 'Aswan' } },
  { id: 'red_sea', name: { ar: 'البحر الأحمر (الغردقة / الجونة)', en: 'Red Sea (Hurghada / Gouna)' } },
  { id: 'south_sinai', name: { ar: 'جنوب سيناء (شرم الشيخ / دهب)', en: 'South Sinai (Sharm / Dahab)' } },
  { id: 'north_sinai', name: { ar: 'شمال سيناء', en: 'North Sinai' } },
  { id: 'matrouh', name: { ar: 'مطروح والساحل الشمالي', en: 'Matrouh & North Coast' } },
  { id: 'new_valley', name: { ar: 'الوادي الجديد', en: 'New Valley' } },
];

interface OrderSummary {
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  deliveryType: 'delivery' | 'pickup';
  appliedPromo: string | null;
}

interface CheckoutModalProps {
  isOpen: boolean;
  language: Language;
  cart: CartItem[];
  orderSummary: OrderSummary | null;
  onClose: () => void;
  onOrderComplete: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  language,
  cart,
  orderSummary,
  onClose,
  onOrderComplete,
}) => {
  if (!isOpen || !orderSummary) return null;
  const isAr = language === 'ar';

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [governorate, setGovernorate] = useState('cairo');
  const [address, setAddress] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('cairo_zayed');
  const [timing, setTiming] = useState<'asap' | 'scheduled'>('asap');
  const [scheduledTime, setScheduledTime] = useState('18:00');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card'>('cod');
  const [isGiftWrap, setIsGiftWrap] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [shopWhatsApp, setShopWhatsApp] = useState('201069844724');
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    getShopSettings().then((s) => {
      if (s.whatsappNumber) setShopWhatsApp(s.whatsappNumber);
    });
  }, []);

  const pickupBranches = [
    { id: 'cairo_zayed', name: { ar: 'فرع الشيخ زايد - أركان بلازا', en: 'Sheikh Zayed - Arkan Plaza' }, phone: '01069844724' },
    { id: 'cairo_tagamoa', name: { ar: 'فرع التجمع الخامس - مول كايرو فيستيفال', en: 'New Cairo - CFC Mall' }, phone: '01069844724' },
    { id: 'cairo_heliopolis', name: { ar: 'فرع مصر الجديدة - الكوربة التاريخية', en: 'Heliopolis - Korba Square' }, phone: '01069844724' },
    { id: 'cairo_zamalek', name: { ar: 'فرع الزمالك - شارع 26 يوليو', en: 'Zamalek - 26th July St' }, phone: '01069844724' },
    { id: 'alex_gleem', name: { ar: 'فرع الإسكندرية - جليم باي الكورنيش', en: 'Alexandria - Gleeem Bay Corniche' }, phone: '01069844724' },
  ];

  const selectedBranchObj = pickupBranches.find((b) => b.id === selectedBranch);
  const selectedGovName = EGYPT_GOVERNORATES.find((g) => g.id === governorate)?.name[language] || governorate;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      alert(isAr ? 'برجاء ملء الاسم ورقم الهاتف' : 'Please provide name and phone');
      return;
    }
    if (orderSummary.deliveryType === 'delivery' && !address.trim()) {
      alert(isAr ? 'برجاء كتابة عنوان التوصيل' : 'Please provide delivery address');
      return;
    }

    setSubmitError(null);
    setIsSubmitting(true);
    const generatedOrderNum = `RYL-${Math.floor(1000 + Math.random() * 9000)}`;

    const orderData: Omit<OrderRecord, 'id'> = {
      orderNumber: generatedOrderNum,
      createdAt: new Date().toISOString(),
      createdAtTimestamp: Date.now(),
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      deliveryType: orderSummary.deliveryType,
      timing,
      paymentMethod,
      isGiftWrap,
      subtotal: orderSummary.subtotal,
      discount: orderSummary.discount,
      deliveryFee: orderSummary.deliveryFee,
      total: orderSummary.total,
      status: 'new',
      items: cart.map((c) => ({
        id: c.item.id,
        nameAr: c.item.name.ar,
        nameEn: c.item.name.en,
        portionAr: c.selectedPortion.label.ar,
        portionEn: c.selectedPortion.label.en,
        quantity: c.quantity,
        price: Math.round(c.item.price * c.selectedPortion.priceMultiplier),
        image: c.item.image || '',
        sweetnessPreference: c.sweetnessPreference || '',
        specialNote: c.specialNote || '',
      })),
      ...(orderSummary.deliveryType === 'delivery' ? {
        governorate: selectedGovName,
        address: `${selectedGovName} - ${address.trim()}`,
      } : {}),
      ...(orderSummary.deliveryType === 'pickup' ? { selectedBranch } : {}),
      ...(timing === 'scheduled' ? { scheduledTime } : {}),
    };

    try {
      // Direct registration in Firestore database (Live sync with shop portal)
      await saveNewOrder(orderData);
      setOrderNumber(generatedOrderNum);
      setOrderConfirmed(true);
    } catch (err: any) {
      console.error('Failed to submit order to Firestore:', err);
      setSubmitError(err?.message || String(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinish = () => {
    onOrderComplete();
    onClose();
  };

  const handleCopyOrderNumber = async () => {
    try {
      await navigator.clipboard.writeText(`#${orderNumber}`);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch (err) {
      console.warn('Clipboard copy failed:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative bg-white rounded-2xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#7A0C1E] text-white p-6 relative">
          {!orderConfirmed && (
            <button
              onClick={onClose}
              className="absolute top-4 end-4 p-1.5 text-stone-300 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <h2 className="text-xl sm:text-2xl font-bold font-display">
            {orderConfirmed
              ? (isAr ? 'تم استلام وتأكيد طلبك بنجاح' : 'Order Confirmed Successfully')
              : (isAr ? 'إتمام الطلب الملكي الفاخر' : 'Complete Your Royal Order')}
          </h2>
          <p className="text-xs text-stone-200 mt-1">
            {orderConfirmed
              ? (isAr ? 'طلبك مسجل الآن في نظام إدارة المحل وجاري تحضيره في الفرن' : 'Your order is recorded in the shop management system for fresh baking')
              : (isAr ? 'أدخل تفاصيل التوصيل أو الاستلام لتأكيد تجهيز الأصناف طازجة' : 'Provide your contact and delivery preferences for fresh preparation')}
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {orderConfirmed ? (
            <div className="text-center py-2 space-y-4">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200 shadow-xs">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider">
                  {isAr ? 'تم تسجيل الطلب في نظام إدارة المحل مباشرة' : 'Directly Logged in Shop Management'}
                </span>
                <div className="mt-2.5">
                  <p className="text-xs text-stone-500 font-medium">
                    {isAr ? 'رقم الطلب الخاص بك للمتابعة:' : 'Your Order Reference Number:'}
                  </p>
                  <div className="mt-1 inline-flex items-center gap-2 px-4 py-2 bg-stone-100 border border-stone-300 rounded-lg text-lg font-mono font-bold text-[#8B1528]">
                    <span>#{orderNumber}</span>
                    <button
                      onClick={handleCopyOrderNumber}
                      className="text-xs text-stone-500 hover:text-[#8B1528] cursor-pointer"
                      title={isAr ? 'نسخ الرقم' : 'Copy'}
                    >
                      {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Receipt Summary Box */}
              <div className="bg-stone-50 rounded-xl p-4 text-start border border-stone-200/80 text-xs space-y-2">
                <div className="flex justify-between font-semibold text-stone-900 border-b border-stone-200 pb-2">
                  <span>{isAr ? 'العميل:' : 'Customer:'} {customerName}</span>
                  <span className="tabular-nums font-mono">{customerPhone}</span>
                </div>

                <div className="py-1">
                  <span className="font-semibold text-stone-700 block mb-1">
                    {isAr ? 'الأصناف المطلوبة:' : 'Ordered Items:'}
                  </span>
                  {cart.map((c, i) => (
                    <div key={i} className="flex justify-between text-stone-600 py-0.5">
                      <span>{c.quantity}x {c.item.name[language]} ({c.selectedPortion.label[language]})</span>
                      <span className="tabular-nums font-medium">
                        {Math.round(c.item.price * c.selectedPortion.priceMultiplier) * c.quantity} ج.م
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-stone-200 pt-2 flex justify-between font-bold text-stone-900 text-sm">
                  <span>{isAr ? 'المجموع المستحق:' : 'Total Amount:'}</span>
                  <span className="text-[#8B1528] font-display tabular-nums">{orderSummary.total} ج.م</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-stone-600 pt-1">
                <Clock className="w-4 h-4 text-[#8B1528]" />
                <span>
                  {orderSummary.deliveryType === 'delivery'
                    ? (isAr ? 'الوقت المتوقع للتوصيل: 45 - 60 دقيقة في حافظة مبردة' : 'Estimated delivery: 45 - 60 minutes in chilled van')
                    : (isAr ? 'جاهز للاستلام من الفرع خلال 30 دقيقة' : 'Ready for branch pickup in 30 minutes')}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={handleFinish}
                  className="w-full py-3 bg-[#8B1528] hover:bg-[#700C1C] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all cursor-pointer active:scale-95"
                >
                  {isAr ? 'إتمام والعودة للتسوق' : 'Done & Continue Shopping'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Customer Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {isAr ? 'الاسم الكامل *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder={isAr ? 'اسم المستلم' : 'Recipient Name'}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-[#8B1528]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {isAr ? 'رقم الهاتف *' : 'Mobile Number *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder={isAr ? '01012345678' : '01012345678'}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-[#8B1528]"
                  />
                </div>
              </div>

              {/* Delivery vs Pickup Details */}
              {orderSummary.deliveryType === 'delivery' ? (
                <div className="space-y-3 p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      {isAr ? 'المحافظة والمدينة *' : 'Governorate / City *'}
                    </label>
                    <select
                      value={governorate}
                      onChange={(e) => setGovernorate(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-stone-200 rounded-lg focus:outline-none focus:border-[#8B1528] font-medium"
                    >
                      {EGYPT_GOVERNORATES.map((gov) => (
                        <option key={gov.id} value={gov.id}>
                          {gov.name[language]}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      {isAr ? 'العنوان بالتفصيل (الحي، الشارع، رقم العمارة أو الفيلا) *' : 'Detailed Address (Street, Building, Apartment) *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder={isAr ? 'مثال: شارع التسعين الشمالي، كمبوند هايد بارك، فيلا 12' : 'e.g. 90th Street, Villa 12'}
                      className="w-full px-3 py-2 text-xs bg-white border border-stone-200 rounded-lg focus:outline-none focus:border-[#8B1528]"
                    />
                  </div>
                </div>
              ) : (
                <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                  <label className="block text-xs font-semibold text-stone-700">
                    {isAr ? 'اختر فرع الاستلام المفضل:' : 'Select Pickup Branch:'}
                  </label>
                  <select
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-200 rounded-lg focus:outline-none focus:border-[#8B1528] font-medium"
                  >
                    {pickupBranches.map((branch) => (
                      <option key={branch.id} value={branch.id}>
                        {branch.name[language]}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Timing */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setTiming('asap')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    timing === 'asap'
                      ? 'border-[#8B1528] bg-rose-50 text-[#8B1528]'
                      : 'border-stone-200 bg-stone-50 text-stone-600'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5 mx-auto mb-1" />
                  <span>{isAr ? 'تجهيز فوري طازج' : 'Fresh ASAP'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTiming('scheduled')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    timing === 'scheduled'
                      ? 'border-[#8B1528] bg-rose-50 text-[#8B1528]'
                      : 'border-stone-200 bg-stone-50 text-stone-600'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5 mx-auto mb-1" />
                  <span>{isAr ? 'جدولة ميعاد محدد' : 'Schedule Time'}</span>
                </button>
              </div>

              {timing === 'scheduled' && (
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {isAr ? 'الوقت المفضل للاستلام/التوصيل:' : 'Preferred Time:'}
                  </label>
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-200 rounded-lg focus:outline-none focus:border-[#8B1528]"
                  />
                </div>
              )}

              {/* Payment Method */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-stone-700">
                  {isAr ? 'طريقة الدفع:' : 'Payment Method:'}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-[#8B1528] bg-rose-50 text-[#8B1528] font-bold'
                        : 'border-stone-200 bg-stone-50 text-stone-700'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-xs">{isAr ? 'الدفع عند الاستلام' : 'Cash on Delivery'}</span>
                  </div>

                  <div
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                      paymentMethod === 'card'
                        ? 'border-[#8B1528] bg-rose-50 text-[#8B1528] font-bold'
                        : 'border-stone-200 bg-stone-50 text-stone-700'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span className="text-xs">{isAr ? 'بطاقة / إنستاباي' : 'Card / InstaPay'}</span>
                  </div>
                </div>
              </div>

              {/* Gift Wrap Option */}
              <label className="flex items-center gap-2.5 p-3 bg-stone-50 rounded-xl border border-stone-200 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={isGiftWrap}
                  onChange={(e) => setIsGiftWrap(e.target.checked)}
                  className="rounded text-[#8B1528] focus:ring-[#8B1528]"
                />
                <Gift className="w-4 h-4 text-[#DFB15B]" />
                <span className="text-stone-700 font-medium">
                  {isAr ? 'تغليف ملكي فاخر بشريطة مذهبة وكرت إهداء' : 'Royal velvet gift wrapping with golden ribbon'}
                </span>
              </label>

              {/* Submission Error Troubleshooting Box */}
              {submitError && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 space-y-1.5 animate-in fade-in text-start">
                  <div className="font-bold flex items-center gap-1.5 text-rose-900">
                    <span>⚠️ {isAr ? 'فشل إرسال الطلب سحابياً:' : 'Cloud Submission Failed:'}</span>
                  </div>
                  <p className="font-mono bg-white/60 p-1.5 rounded border border-rose-100 break-words">
                    {submitError}
                  </p>
                  <div className="leading-relaxed text-[11px] text-stone-600 space-y-1">
                    {isAr ? (
                      <>
                        <p><strong>سبب المشكلة:</strong> مشروعك السحابي <code>al-camino-cb3d7</code> يرفض استلام الطلب.</p>
                        <p><strong>طريقة الحل:</strong> يرجى التأكد من تعديل قواعد الحماية (Rules) في لوحة تحكم Firestore الخاصة بك لتسمح بالكتابة والقراءة كالتالي:</p>
                        <pre className="bg-stone-800 text-stone-100 p-2 rounded font-mono text-[10px] overflow-x-auto mt-1">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`}
                        </pre>
                      </>
                    ) : (
                      <>
                        <p><strong>Reason:</strong> Your cloud project <code>al-camino-cb3d7</code> rejected the order request.</p>
                        <p><strong>How to fix:</strong> Set your Firestore Security Rules to public access for testing in the Firebase Console:</p>
                        <pre className="bg-stone-800 text-stone-100 p-2 rounded font-mono text-[10px] overflow-x-auto mt-1">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`}
                        </pre>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Total & Submit Button */}
              <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
                <div>
                  <span className="text-xs text-stone-500 block">{isAr ? 'المجموع النهائي:' : 'Total Amount:'}</span>
                  <span className="text-xl sm:text-2xl font-bold text-[#8B1528] font-display">
                    {orderSummary.total} ج.م
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-[#8B1528] hover:bg-[#700C1C] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95 disabled:bg-stone-400"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{isAr ? 'جاري تسجيل الطلب...' : 'Processing...'}</span>
                    </>
                  ) : (
                    <span>{isAr ? 'تأكيد الطلب وإرساله للمحل' : 'Confirm Order to Shop'}</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
