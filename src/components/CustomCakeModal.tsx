import React, { useState } from 'react';
import { 
  X, Cake, Sparkles, Image as ImageIcon, Calendar, Clock, 
  MapPin, Phone, Upload, Trash2, CheckCircle2, AlertCircle, 
  Ruler, Heart, ChevronDown, Check, Loader2, Store 
} from 'lucide-react';
import { Language, OrderRecord } from '../types';
import { EGYPT_GOVERNORATES } from './CheckoutModal';
import { saveNewOrder, getShopSettings } from '../services/shopService';

interface CustomCakeModalProps {
  isOpen: boolean;
  language: Language;
  onClose: () => void;
  onOrderSuccess?: (orderNum: string) => void;
}

export const CustomCakeModal: React.FC<CustomCakeModalProps> = ({
  isOpen,
  language,
  onClose,
  onOrderSuccess,
}) => {
  if (!isOpen) return null;
  const isAr = language === 'ar';

  // Customer Contact
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [governorate, setGovernorate] = useState('cairo');
  const [address, setAddress] = useState('');
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');

  // Cake Shape & Dimensions
  const [cakeShape, setCakeShape] = useState<'rectangle' | 'round' | 'heart' | 'tiered' | 'custom_theme'>('rectangle');
  const [sizePreset, setSizePreset] = useState('60x40');
  const [customDimensions, setCustomDimensions] = useState('');
  const [cakeDescription, setCakeDescription] = useState('');
  const [cakeWriting, setCakeWriting] = useState('');

  // Cake Flavors & Fillings
  const [spongeFlavor, setSpongeFlavor] = useState('half_half');
  const [fillingFlavor, setFillingFlavor] = useState('nutella_hazelnut');
  const [tierCount, setTierCount] = useState('1');

  // Delivery Deadline
  const [deliveryDate, setDeliveryDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [deliveryTime, setDeliveryTime] = useState('18:00');

  // Attached Reference Images
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmedOrderNumber, setConfirmedOrderNumber] = useState<string | null>(null);

  const sizePresets = [
    { id: '60x40', label: { ar: 'مستطيلة 60×40 سم (حفلات كبرى 50-65 فرداً)', en: 'Rectangle 60x40 cm (Grand Event 50-65 Servings)' }, basePrice: 1200 },
    { id: '40x40', label: { ar: 'مستطيلة 40×40 سم (عائلية كبيرة 30-40 فرداً)', en: 'Square 40x40 cm (Large Family 30-40 Servings)' }, basePrice: 850 },
    { id: '30x40', label: { ar: 'مستطيلة 30×40 سم (وسط 20-25 فرداً)', en: 'Rectangle 30x40 cm (Medium 20-25 Servings)' }, basePrice: 650 },
    { id: 'round_30', label: { ar: 'دائرية قطر 30 سم (15-20 فرداً)', en: 'Round 30 cm Diameter (15-20 Servings)' }, basePrice: 550 },
    { id: 'round_24', label: { ar: 'دائرية قطر 24 سم (8-10 أفراد)', en: 'Round 24 cm Diameter (8-10 Servings)' }, basePrice: 420 },
    { id: 'two_tiers', label: { ar: 'دورين فاخرة للمناسبات (35-45 فرداً)', en: 'Two-Tier Celebration (35-45 Servings)' }, basePrice: 1450 },
    { id: 'custom', label: { ar: 'مقاس مخصص آخر (حدد الأبعاد بنفسك)', en: 'Custom Dimensions (Specify Below)' }, basePrice: 700 },
  ];

  const spongeOptions = [
    { id: 'half_half', label: { ar: 'نصف شوكولاتة بلجيكية ونصف فانيليا تاهيتي', en: 'Half Belgian Chocolate & Half Vanilla' } },
    { id: 'belgian_chocolate', label: { ar: 'شوكولاتة بلجيكية داكنة غنية', en: 'Rich Dark Belgian Chocolate' } },
    { id: 'tahitian_vanilla', label: { ar: 'فانيليا تاهيتية ناعمة', en: 'Tahitian Vanilla Sponge' } },
    { id: 'red_velvet', label: { ar: 'ريد فيلفيت مخملي ملكي', en: 'Royal Velvet Sponge' } },
    { id: 'lotus', label: { ar: 'كيك اللوتس البلجيكي المقرمش', en: 'Lotus Biscoff Crunch' } },
    { id: 'pistachio', label: { ar: 'سبونج الفستق الحلبي الأخضر الفاخر', en: 'Pure Aleppo Pistachio Sponge' } },
  ];

  const fillingOptions = [
    { id: 'nutella_hazelnut', label: { ar: 'نوتيلا إيطالية مع بندق محمص وفيريرو روشيه', en: 'Nutella, Roasted Hazelnut & Ferrero' } },
    { id: 'fresh_cream_fruits', label: { ar: 'كريمة ديبلومات خفيفة مع فواكه طازجة', en: 'Diplomat Cream & Fresh Glazed Fruits' } },
    { id: 'lotus_caramel', label: { ar: 'كريمة لوتس مع كراميل مملح وقرمشة بسكويت', en: 'Lotus Cream & Salted Butter Caramel' } },
    { id: 'pistachio_mascarpone', label: { ar: 'كريمة فستق حلبي وجبن ماسكاربوني وتوت', en: 'Pistachio Mascarpone & Berries' } },
    { id: 'dark_ganache', label: { ar: 'غاناش شوكولاتة داكنة 70%', en: '70% Dark Chocolate Truffle Ganache' } },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (uploadedImages.length >= 4) return;
      if (file.size > 4 * 1024 * 1024) {
        alert(isAr ? 'حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 4 ميجابايت' : 'Image too large (max 4MB)');
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setUploadedImages((prev) => [...prev, ev.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const selectedPreset = sizePresets.find((s) => s.id === sizePreset);
  const baseEstimatedPrice = (selectedPreset?.basePrice || 700) + (tierCount === '2' ? 350 : tierCount === '3' ? 700 : 0);

  const selectedGovName = EGYPT_GOVERNORATES.find((g) => g.id === governorate)?.name[language] || governorate;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!customerName.trim() || !customerPhone.trim()) {
      setValidationError(isAr ? 'برجاء كتابة الاسم ورقم الهاتف' : 'Please provide name and phone number');
      return;
    }

    if (deliveryType === 'delivery' && !address.trim()) {
      setValidationError(isAr ? 'برجاء كتابة عنوان التوصيل بالتفصيل' : 'Please provide delivery address');
      return;
    }

    if (!cakeDescription.trim() && uploadedImages.length === 0) {
      setValidationError(isAr ? 'برجاء كتابة وصف لشكل التورتة أو إرفاق صورة توضيحية للديزاين' : 'Please describe the cake or attach reference photo');
      return;
    }

    setSubmitError(null);
    setIsSubmitting(true);
    const generatedOrderNum = `CK-${Math.floor(1000 + Math.random() * 9000)}`;

    const sizeDisplay = sizePreset === 'custom' ? `أبعاد مخصصة: ${customDimensions}` : selectedPreset?.label.ar || sizePreset;
    const spongeDisplay = spongeOptions.find((s) => s.id === spongeFlavor)?.label[language] || spongeFlavor;
    const fillingDisplay = fillingOptions.find((f) => f.id === fillingFlavor)?.label[language] || fillingFlavor;

    const orderData: Omit<OrderRecord, 'id'> = {
      orderNumber: generatedOrderNum,
      createdAt: new Date().toISOString(),
      createdAtTimestamp: Date.now(),
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      deliveryType,
      governorate: deliveryType === 'delivery' ? selectedGovName : undefined,
      address: deliveryType === 'delivery' ? `${selectedGovName} - ${address.trim()}` : undefined,
      timing: 'scheduled',
      scheduledTime: `${deliveryDate} الساعة ${deliveryTime}`,
      paymentMethod: 'cod',
      isGiftWrap: true,
      subtotal: baseEstimatedPrice,
      discount: 0,
      deliveryFee: deliveryType === 'delivery' ? 40 : 0,
      total: baseEstimatedPrice + (deliveryType === 'delivery' ? 40 : 0),
      status: 'new' as const,
      uploadedImages: uploadedImages.length > 0 ? uploadedImages : undefined,
      items: [
        {
          id: 'custom-torta',
          nameAr: `تورتة مخصصة بالطلب (${sizeDisplay})`,
          nameEn: `Bespoke Custom Cake (${sizeDisplay})`,
          portionAr: sizeDisplay || 'مقاس مخصص',
          portionEn: sizeDisplay || 'Custom Size',
          quantity: 1,
          price: baseEstimatedPrice,
          image: uploadedImages[0] || '',
          sweetnessPreference: spongeDisplay,
          specialNote: `الوصف: ${cakeDescription} | كتابة على التورتة: ${cakeWriting || 'بدون'} | ميعاد التسليم: ${deliveryDate} الساعة ${deliveryTime}`,
        },
      ],
    };

    try {
      // Direct registration in Firestore database (Live sync with shop portal)
      await saveNewOrder(orderData);
      setConfirmedOrderNumber(generatedOrderNum);
      if (onOrderSuccess) {
        onOrderSuccess(generatedOrderNum);
      }
    } catch (err: any) {
      console.error('Could not save custom cake order to firestore:', err);
      setSubmitError(err?.message || String(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200 flex flex-col text-stone-900 my-auto"
        onClick={(e) => e.stopPropagation()}
        dir={isAr ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#6B0817] via-[#8B1528] to-[#550512] text-white p-6 relative rounded-t-3xl overflow-hidden shrink-0">
          <button
            onClick={onClose}
            className="absolute top-5 end-5 p-1.5 text-stone-300 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#DFB15B] text-xs font-semibold backdrop-blur-xs mb-2 border border-white/10">
            <Cake className="w-4 h-4 text-[#DFB15B]" />
            <span>{isAr ? 'استوديو تفصيل التورت الملكية' : 'Royal Bespoke Cake Studio'}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
            {confirmedOrderNumber
              ? (isAr ? 'تم استلام وتأكيد طلب التورتة بنجاح' : 'Custom Cake Order Confirmed')
              : (isAr ? 'صمم تورتتك الخاصة بالمقاس والشكل الذي تريده' : 'Design Your Custom Celebration Cake')}
          </h2>
          <p className="text-xs text-stone-200 mt-1 max-w-lg leading-relaxed">
            {confirmedOrderNumber
              ? (isAr ? 'تم تسجيل وتوثيق طلبك مباشرة في نظام إدارة المحل وجاري مراجعته وتجهيزه طازجاً.' : 'Order recorded in shop management system.')
              : (isAr
                ? 'حدد المقاس المطلوب (مثل 60×40 سم)، واكتب شكل التورتة وأرفق صوراً للنموذج وميعاد التسليم.'
                : 'Specify custom size (e.g. 60x40cm), describe the design, upload reference photos, and choose delivery deadline.')}
          </p>
        </div>

        {/* Form Body or Direct Success Screen */}
        {confirmedOrderNumber ? (
          <div className="p-6 sm:p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200 shadow-xs">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider">
                {isAr ? 'مسجل في لوحة تحكم المحل مباشرة' : 'Logged in Shop Manager Portal'}
              </span>
              <h3 className="text-xl font-bold text-stone-900 mt-2 font-display">
                {isAr ? 'شكراً لك، تم استلام تفاصيل التورتة المخصصة' : 'Thank you, Custom Cake Request Received'}
              </h3>
              <div className="mt-2 inline-block px-4 py-1.5 bg-stone-100 border border-stone-300 rounded-lg text-lg font-mono font-bold text-[#8B1528]">
                #{confirmedOrderNumber}
              </div>
            </div>

            <div className="bg-stone-50 rounded-xl p-4 text-start border border-stone-200 max-w-md mx-auto text-xs space-y-2">
              <div className="flex justify-between border-b border-stone-200 pb-2 font-semibold">
                <span>{isAr ? 'العميل:' : 'Customer:'} {customerName}</span>
                <span className="font-mono">{customerPhone}</span>
              </div>
              <div className="flex justify-between text-stone-700">
                <span>{isAr ? 'تاريخ التسليم:' : 'Delivery Date:'}</span>
                <span className="font-bold text-[#8B1528]">{deliveryDate} ({deliveryTime})</span>
              </div>
              <div className="flex justify-between text-stone-700">
                <span>{isAr ? 'المقاس:' : 'Size:'}</span>
                <span>{sizePreset === 'custom' ? customDimensions : selectedPreset?.label.ar}</span>
              </div>
              <div className="border-t border-stone-200 pt-2 flex justify-between font-bold text-stone-900 text-sm">
                <span>{isAr ? 'السعر التقديري:' : 'Estimated Price:'}</span>
                <span className="text-[#8B1528]">{baseEstimatedPrice} ج.م</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 bg-[#8B1528] hover:bg-[#700C1C] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-sm"
              >
                {isAr ? 'إغلاق ومتابعة التسوق' : 'Close & Continue'}
              </button>
            </div>
          </div>
        ) : (
          <div className="p-5 sm:p-6 space-y-5">
            {/* Section 1: Dimensions & Shape */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-[#8B1528] border-b border-stone-200 pb-1.5">
                <Ruler className="w-4 h-4" />
                <span>{isAr ? '1. المقاس والأبعاد المطلوبة للتورتة' : '1. Cake Size & Dimensions'}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {sizePresets.map((preset) => (
                  <button
                    type="button"
                    key={preset.id}
                    onClick={() => setSizePreset(preset.id)}
                    className={`p-3 rounded-xl border text-start transition-all cursor-pointer flex flex-col justify-between ${
                      sizePreset === preset.id
                        ? 'border-[#8B1528] bg-rose-50/70 ring-1 ring-[#8B1528] text-stone-900 shadow-2xs'
                        : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700'
                    }`}
                  >
                    <div className="font-semibold text-xs leading-snug">
                      {preset.label[language]}
                    </div>
                    <div className="text-[11px] text-[#8B1528] font-bold font-mono mt-1.5">
                      {preset.id === 'custom' ? (isAr ? 'يبدأ من 700 ج.م' : 'From 700 EGP') : `${preset.basePrice} ج.م تقريباً`}
                    </div>
                  </button>
                ))}
              </div>

              {sizePreset === 'custom' && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 animate-in fade-in">
                  <label className="block text-xs font-bold text-amber-900 mb-1">
                    {isAr ? 'اكتب الأبعاد بالتفصيل (مثل: 70×50 سم أو 80×60 سم أو 3 أدوار) *' : 'Enter Custom Dimensions (e.g. 70x50 cm) *'}
                  </label>
                  <input
                    type="text"
                    value={customDimensions}
                    onChange={(e) => setCustomDimensions(e.target.value)}
                    placeholder={isAr ? 'مثال: 70 في 50 سم مستطيل، ارتفاع 15 سم' : 'e.g. 70x50 cm rectangular'}
                    className="w-full px-3 py-2 text-xs bg-white border border-amber-300 rounded-lg focus:outline-none focus:border-[#8B1528]"
                  />
                </div>
              )}
            </div>

            {/* Section 2: Flavors & Fillings */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 text-sm font-bold text-[#8B1528] border-b border-stone-200 pb-1.5">
                <Sparkles className="w-4 h-4" />
                <span>{isAr ? '2. نكهات الكيك والحشوة المفضلة' : '2. Sponge & Filling Options'}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {isAr ? 'نوع الكيك (السبونج):' : 'Sponge Cake Flavor:'}
                  </label>
                  <select
                    value={spongeFlavor}
                    onChange={(e) => setSpongeFlavor(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-[#8B1528] font-medium"
                  >
                    {spongeOptions.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label[language]}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {isAr ? 'الحشوة الداخلية والكريمة:' : 'Filling & Cream:'}
                  </label>
                  <select
                    value={fillingFlavor}
                    onChange={(e) => setFillingFlavor(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-[#8B1528] font-medium"
                  >
                    {fillingOptions.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label[language]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Section 3: Design Description & Writing */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 text-sm font-bold text-[#8B1528] border-b border-stone-200 pb-1.5">
                <Cake className="w-4 h-4" />
                <span>{isAr ? '3. تفاصيل الديزاين والكتابة المخصصة' : '3. Cake Theme & Writing'}</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {isAr ? 'وصف شكل وتفاصيل التورتة المطلوبة بالتفصيل:' : 'Describe the custom design & theme:'}
                </label>
                <textarea
                  rows={2}
                  value={cakeDescription}
                  onChange={(e) => setCakeDescription(e.target.value)}
                  placeholder={isAr ? 'مثال: تورتة عيد ميلاد باللون البورغندي والذهبي مع لمسات شوكولاتة وفواكه طبيعية' : 'Describe colors, decorations, figurines, theme...'}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-[#8B1528]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {isAr ? 'النص أو الإهداء المراد كتابته على التورتة (اختياري):' : 'Dedication Text on Cake (Optional):'}
                </label>
                <input
                  type="text"
                  value={cakeWriting}
                  onChange={(e) => setCakeWriting(e.target.value)}
                  placeholder={isAr ? 'مثال: Happy Birthday Sarah / ألف مبروك النجاح' : 'e.g. Happy Anniversary Mom & Dad'}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-[#8B1528]"
                />
              </div>

              {/* Upload Reference Images */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  {isAr ? 'إرفاق صور مرجعية لشكل التورتة (اختياري، حتى 4 صور):' : 'Attach Reference Images (Up to 4 images):'}
                </label>

                <div className="flex flex-wrap items-center gap-2.5">
                  {uploadedImages.map((img, idx) => (
                    <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-stone-300 group">
                      <img src={img} alt="Reference" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4 text-rose-400" />
                      </button>
                    </div>
                  ))}

                  {uploadedImages.length < 4 && (
                    <label className="w-16 h-16 rounded-lg border-2 border-dashed border-stone-300 hover:border-[#8B1528] bg-stone-50 flex flex-col items-center justify-center cursor-pointer transition-colors text-stone-500 hover:text-[#8B1528]">
                      <Upload className="w-4 h-4 mb-0.5" />
                      <span className="text-[9px] font-medium">{isAr ? 'إضافة' : 'Add'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* Section 4: Date, Time & Contact */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 text-sm font-bold text-[#8B1528] border-b border-stone-200 pb-1.5">
                <Calendar className="w-4 h-4" />
                <span>{isAr ? '4. موعد التسليم وبيانات العميل' : '4. Delivery Date & Contact'}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {isAr ? 'تاريخ التسليم المطلوب *' : 'Delivery Date *'}
                  </label>
                  <input
                    type="date"
                    required
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-[#8B1528]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {isAr ? 'ساعة التسليم التقريبية *' : 'Delivery Time *'}
                  </label>
                  <input
                    type="time"
                    required
                    value={deliveryTime}
                    onChange={(e) => setDeliveryTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-[#8B1528]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {isAr ? 'اسم العميل *' : 'Customer Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder={isAr ? 'الاسم الكريم' : 'Full Name'}
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
                    placeholder={isAr ? '01012345678' : 'Mobile Phone'}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-[#8B1528]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setDeliveryType('delivery')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    deliveryType === 'delivery'
                      ? 'border-[#8B1528] bg-rose-50 text-[#8B1528]'
                      : 'border-stone-200 bg-stone-50 text-stone-600'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5 mx-auto mb-1" />
                  <span>{isAr ? 'توصيل مبرد لباب البيت' : 'Chilled Delivery'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryType('pickup')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    deliveryType === 'pickup'
                      ? 'border-[#8B1528] bg-rose-50 text-[#8B1528]'
                      : 'border-stone-200 bg-stone-50 text-stone-600'
                  }`}
                >
                  <Store className="w-3.5 h-3.5 mx-auto mb-1" />
                  <span>{isAr ? 'استلام من أقرب فرع' : 'Branch Pickup'}</span>
                </button>
              </div>

              {deliveryType === 'delivery' && (
                <div className="space-y-2 p-3 bg-stone-50 rounded-xl border border-stone-200 animate-in fade-in">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      {isAr ? 'المحافظة والمدينة *' : 'Governorate / City *'}
                    </label>
                    <select
                      value={governorate}
                      onChange={(e) => setGovernorate(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-stone-200 rounded-lg focus:outline-none focus:border-[#8B1528]"
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
                      {isAr ? 'العنوان بالتفصيل *' : 'Detailed Address *'}
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder={isAr ? 'الحي، الشارع، رقم العمارة أو الفيلا' : 'Street, building, apt'}
                      className="w-full px-3 py-2 text-xs bg-white border border-stone-200 rounded-lg focus:outline-none focus:border-[#8B1528]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Validation Error */}
            {validationError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl text-center">
                {validationError}
              </div>
            )}

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

            {/* Estimated Total & Action */}
            <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-start">
                <span className="text-xs text-stone-500 block">
                  {isAr ? 'السعر التقديري المبدئي:' : 'Estimated Price:'}
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold text-[#8B1528] font-display">
                    {baseEstimatedPrice} ج.م
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full sm:w-auto px-7 py-3.5 bg-[#8B1528] hover:bg-[#700C1C] text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:bg-stone-400"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{isAr ? 'جاري تسجيل الطلب...' : 'Submitting...'}</span>
                  </>
                ) : (
                  <>
                    <Cake className="w-4 h-4" />
                    <span>
                      {isAr
                        ? 'تأكيد طلب التورتة وإرساله للمحل مباشرة'
                        : 'Submit Custom Cake Order to Shop'}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
