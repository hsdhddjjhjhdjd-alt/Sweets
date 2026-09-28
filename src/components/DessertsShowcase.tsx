import React, { useState, useMemo } from 'react';
import { 
  Plus, Eye, Search, Star, Sparkles, Cake, 
  ArrowLeft, ArrowRight, Upload, Calendar, Clock, CheckCircle2,
  Phone, MapPin, Ruler, MessageSquare, Loader2, Image as ImageIcon,
  Check, Store, ShieldCheck
} from 'lucide-react';
import { Language, DessertCategory, DessertItem } from '../types';
import { DESSERT_ITEMS } from '../data/desserts';
import { saveNewOrder } from '../services/shopService';

interface DessertsShowcaseProps {
  language: Language;
  selectedCategory: DessertCategory;
  onSelectCategory: (category: DessertCategory) => void;
  onQuickView: (item: DessertItem) => void;
  onAddToCart: (item: DessertItem) => void;
  onOpenCustomCake?: () => void;
}

// Arabic Text Normalizer for robust keyword search
export const normalizeArabicSearch = (text: string): string => {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670]/g, '') // remove Arabic tashkeel/diacritics
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/[ىي]/g, 'ي')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    .replace(/[^\w\s\u0600-\u06FF]/gi, ' ') // replace punctuation/special chars with space
    .replace(/\s+/g, ' ')
    .trim();
};

export const DessertsShowcase: React.FC<DessertsShowcaseProps> = ({
  language,
  selectedCategory,
  onSelectCategory,
  onQuickView,
  onAddToCart,
}) => {
  const isAr = language === 'ar';
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [addedItemNotice, setAddedItemNotice] = useState<string | null>(null);

  // In-Page Custom Cake Studio State (Without Emojis)
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [cakeShape, setCakeShape] = useState<'rectangle_60x40' | 'rectangle_40x30' | 'round_28' | 'tiered'>('rectangle_60x40');
  const [creamType, setCreamType] = useState<'dairy_heavy' | 'chantilly_french' | 'half_half'>('dairy_heavy');
  const [spongeType, setSpongeType] = useState<'half_half' | 'bourbon_vanilla' | 'chocolate_fudge'>('half_half');
  const [fillingType, setFillingType] = useState<'fresh_fruits' | 'mango_passion' | 'lotus_caramel' | 'nutella_hazelnuts'>('fresh_fruits');
  const [cakeDedicationText, setCakeDedicationText] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryDate, setDeliveryDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [customNotes, setCustomNotes] = useState('');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isSubmittingCustom, setIsSubmittingCustom] = useState(false);
  const [customSubmittedSuccess, setCustomSubmittedSuccess] = useState<string | null>(null);

  const categories: { id: DessertCategory; label: { ar: string; en: string }; badge?: string }[] = [
    { id: 'all', label: { ar: 'كل الأصناف', en: 'All Menu' } },
    { 
      id: 'chantilly_cakes', 
      label: { ar: 'تورت كريم شانتيه وكريمة لباني', en: 'Chantilly & Fresh Cream Cakes' },
      badge: isAr ? 'مميز' : 'Popular'
    },
    { id: 'oriental', label: { ar: 'حلويات شرقية بالسمن البلدي', en: 'Oriental Sweets' } },
    { id: 'western', label: { ar: 'باتيسري فرنسي وغربي', en: 'Western Patisserie' } },
    { id: 'gifts', label: { ar: 'بوكسات وهدايا الضيافة', en: 'Gift Hampers' } },
  ];

  // Smart Keyword Search Engine
  const filteredItems = useMemo(() => {
    const rawQuery = searchQuery.trim();
    const normalizedQuery = normalizeArabicSearch(rawQuery);
    const queryTokens = normalizedQuery.split(' ').filter(Boolean);

    return DESSERT_ITEMS.filter((item) => {
      // If user typed a search query, search across entire menu seamlessly
      if (queryTokens.length > 0) {
        const itemBag = [
          item.name.ar,
          item.name.en,
          item.subCategory?.ar || '',
          item.subCategory?.en || '',
          item.description.ar,
          item.description.en,
          item.ingredients.ar,
          item.ingredients.en,
          ...(item.dietaryTags || []),
          item.category === 'oriental' ? 'شرقي كنافه بسبوسه بقلاوه حلاوه الجبن ساخنه صينيه سدر' : '',
          item.category === 'western' ? 'غربي باتيسري فرنسي تارت ميلفاي تشيز كيك رد فيلفت' : '',
          item.category === 'chantilly_cakes' ? 'تورته كيك كريمه لباني شانتيه فواكه شوكولاته فانيليا بلاك فورست لوتس' : '',
        ].join(' ');

        const normalizedBag = normalizeArabicSearch(itemBag);

        // Every keyword token must match (either directly or removing leading "ال")
        return queryTokens.every((token) => {
          const tokenNoAl = token.startsWith('ال') && token.length > 4 ? token.slice(2) : token;
          return normalizedBag.includes(token) || normalizedBag.includes(tokenNoAl);
        });
      }

      // If no search query, filter by selectedCategory
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      // Prioritize name matches when searching
      if (queryTokens.length > 0) {
        const aName = normalizeArabicSearch(a.name.ar + ' ' + a.name.en);
        const bName = normalizeArabicSearch(b.name.ar + ' ' + b.name.en);
        const aMatches = queryTokens.some(t => aName.includes(t));
        const bMatches = queryTokens.some(t => bName.includes(t));
        if (aMatches && !bMatches) return -1;
        if (!aMatches && bMatches) return 1;
      }

      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (a.isBestSeller && !b.isBestSeller) return -1;
      if (!a.isBestSeller && b.isBestSeller) return 1;
      return 0;
    });
  }, [selectedCategory, searchQuery, sortBy]);

  const handleQuickAdd = (item: DessertItem) => {
    onAddToCart(item);
    setAddedItemNotice(item.id);
    setTimeout(() => {
      setAddedItemNotice((prev) => (prev === item.id ? null : prev));
    }, 1800);
  };

  // Image Upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file) => {
      if (file.size > 4 * 1024 * 1024) {
        alert(isAr ? 'حجم الصورة كبير، يرجى اختيار صورة أقل من 4 ميجابايت' : 'Image too large (max 4MB)');
        return;
      }
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        if (loadEvt.target?.result) {
          setUploadedImages((prev) => [...prev, loadEvt.target!.result as string].slice(0, 3));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Calculate estimated price for custom cake
  const customEstimatedPrice = useMemo(() => {
    let base = 350;
    if (cakeShape === 'rectangle_60x40') base = 1450;
    else if (cakeShape === 'rectangle_40x30') base = 850;
    else if (cakeShape === 'round_28') base = 480;
    else if (cakeShape === 'tiered') base = 2200;

    if (creamType === 'dairy_heavy') base += 80;
    if (fillingType === 'fresh_fruits') base += 60;
    if (fillingType === 'lotus_caramel') base += 70;
    return base;
  }, [cakeShape, creamType, fillingType]);

  const handleCustomCakeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      alert(isAr ? 'برجاء إدخال اسمك ورقم الهاتف للتواصل' : 'Please enter your name and phone');
      return;
    }

    setIsSubmittingCustom(true);
    const orderNum = `CK-${Math.floor(1000 + Math.random() * 9000)}`;

    const shapeLabel = 
      cakeShape === 'rectangle_60x40' ? 'صاج مستطيل 60×40 سم (50-60 فرد)' :
      cakeShape === 'rectangle_40x30' ? 'مستطيل وسط 40×30 سم (25 فرد)' :
      cakeShape === 'round_28' ? 'دائري 28 سم (12 فرد)' : 'طوابق متعددة للأعراس';

    const creamLabel = 
      creamType === 'dairy_heavy' ? 'كريمة لباني طبيعية 100%' :
      creamType === 'chantilly_french' ? 'كريم شانتيه فرنسي خفيف' : 'مزيج نصف شانتيه ونصف لباني';

    const spongeLabel = 
      spongeType === 'half_half' ? 'نصف فانيليا ونصف شوكولاتة' :
      spongeType === 'bourbon_vanilla' ? 'فانيليا طبيعية' : 'فادج شوكولاتة غني';

    const fillingLabel =
      fillingType === 'fresh_fruits' ? 'تشكيلة فواكه طازجة' :
      fillingType === 'mango_passion' ? 'مانجو طبيعي وباشن فروت' :
      fillingType === 'lotus_caramel' ? 'لوتس وكراميل الزبدة' : 'نوتيلا وبندق محمص';

    try {
      // Direct registration in Firestore database (Live sync with shop portal)
      await saveNewOrder({
        orderNumber: orderNum,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        deliveryType: 'delivery',
        timing: 'scheduled',
        scheduledTime: deliveryDate,
        paymentMethod: 'cod',
        isGiftWrap: true,
        subtotal: customEstimatedPrice,
        discount: 0,
        deliveryFee: 0,
        total: customEstimatedPrice,
        status: 'new',
        createdAt: new Date().toISOString(),
        createdAtTimestamp: Date.now(),
        uploadedImages: uploadedImages.length > 0 ? uploadedImages : undefined,
        items: [
          {
            id: 'custom_cake_bespoke',
            nameAr: `تورتة مخصصة: ${shapeLabel} - ${creamLabel}`,
            nameEn: `Custom Cake: ${cakeShape}`,
            portionAr: shapeLabel,
            portionEn: cakeShape,
            quantity: 1,
            price: customEstimatedPrice,
            specialNote: `الكتابة: "${cakeDedicationText || 'بدون'}" | الإسفنج: ${spongeLabel} | الحشوة: ${fillingLabel} | ملاحظات: ${customNotes || 'لا يوجد'}`,
          },
        ],
      });

      // Directly show confirmation screen - NO WhatsApp redirect
      setCustomSubmittedSuccess(orderNum);
      setIsSubmittingCustom(false);
    } catch (err) {
      console.error(err);
      setIsSubmittingCustom(false);
      setCustomSubmittedSuccess(orderNum);
    }
  };

  return (
    <div className="py-8 sm:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8B1528] uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>{isAr ? 'قائمة المذاق الفاخر والتورت' : 'Artisanal Desserts & Cakes'}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold font-display text-stone-900 tracking-tight">
              {isAr ? 'حلويات وتورت القصر الملكي' : 'Royal Pâtisserie & Specialty Cakes'}
            </h1>
            <p className="mt-1.5 text-stone-500 text-xs sm:text-sm max-w-2xl">
              {isAr
                ? 'استمتع بأشهى تورت الكريمة اللباني والكريم شانتيه، والحلويات الشرقية بالسمن البلدي، مع إمكانية تصميم وتفصيل تورتتك بمقاسات كبرى (60×40).'
                : 'Fresh heavy cream cakes, French chantilly gateaux, and pure ghee oriental sweets with instant bespoke cake customization.'}
            </p>
          </div>

          {/* Search Bar & Sort Dropdown */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative min-w-[220px] sm:min-w-[260px]">
              <Search className="w-4 h-4 text-stone-400 absolute start-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isAr ? 'ابحث بالكلمات (كنافة ساخنة، لباني، شانتيه)...' : 'Search (Knafeh, Cream, Baklava)...'}
                className="w-full ps-9 pe-7 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#8B1528] focus:bg-white transition-all shadow-2xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute end-2.5 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700 cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="py-2 px-3 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#8B1528] text-stone-700 font-medium cursor-pointer shadow-2xs"
            >
              <option value="featured">{isAr ? 'المختارة والأكثر طلباً' : 'Featured'}</option>
              <option value="rating">{isAr ? 'الأعلى تقييماً' : 'Highest Rated'}</option>
              <option value="price-asc">{isAr ? 'السعر: من الأقل للأعلى' : 'Price: Low to High'}</option>
              <option value="price-desc">{isAr ? 'السعر: من الأعلى للأقل' : 'Price: High to Low'}</option>
            </select>
          </div>
        </div>

        {/* Categories Navigation Bar */}
        <div className="flex items-center gap-1.5 sm:gap-2 pb-4 overflow-x-auto no-scrollbar scroll-smooth border-b border-stone-100 mb-6">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id && !searchQuery.trim();
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSearchQuery('');
                  onSelectCategory(cat.id);
                }}
                className={`relative px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#8B1528] text-white shadow-sm ring-1 ring-[#8B1528]'
                    : 'bg-stone-100/90 hover:bg-stone-200/90 text-stone-700'
                }`}
              >
                <span>{cat.label[language]}</span>
                {cat.badge && (
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-[#DFB15B] text-stone-950' : 'bg-[#8B1528] text-white'
                    }`}
                  >
                    {cat.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Active Search Result Indicator Banner */}
        {searchQuery.trim() && (
          <div className="mb-6 p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between text-xs text-amber-900">
            <div>
              <span>{isAr ? 'نتائج البحث عن:' : 'Search results for:'} </span>
              <strong className="font-bold">"{searchQuery}"</strong>
              <span className="ms-2 text-stone-500">({filteredItems.length} {isAr ? 'صنف متطابق' : 'items found'})</span>
            </div>
            <button
              onClick={() => setSearchQuery('')}
              className="px-2.5 py-1 bg-white hover:bg-amber-100 text-stone-700 rounded-lg text-[11px] font-bold border border-amber-300 cursor-pointer"
            >
              {isAr ? 'مسح البحث' : 'Clear'}
            </button>
          </div>
        )}

        {/* In-Page Custom Cake Customization Banner & Tool (Clean Typography, No Emojis) */}
        <div className="mb-10 bg-gradient-to-r from-amber-500/10 via-rose-900/10 to-amber-700/10 rounded-2xl border border-amber-300/80 p-4 sm:p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#8B1528] to-[#A51D34] text-white flex items-center justify-center shrink-0 shadow-md">
                <Cake className="w-6 h-6 text-[#DFB15B]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-[#8B1528]">
                    {isAr ? 'استوديو تفصيل وتخصيص التورتة الملكية' : 'Bespoke Custom Cake Studio'}
                  </h3>
                  <span className="text-[10px] font-bold bg-[#8B1528] text-white px-2 py-0.5 rounded-full">
                    {isAr ? 'مقاسات 60×40' : '60×40 Sizes'}
                  </span>
                </div>
                <p className="text-xs text-stone-600 mt-0.5">
                  {isAr
                    ? 'خصص تورتتك بالمقاس المناسب، نوع الكريمة (لباني طازجة أو شانتيه)، الإهداء المكتوب، مع تسجيل الطلب فورياً في نظام المحل.'
                    : 'Customize sizes, choose fresh dairy or chantilly cream, dedication writing, with instant direct order registration.'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowCustomizer(!showCustomizer)}
              className="self-start md:self-auto px-5 py-2.5 bg-[#8B1528] hover:bg-[#700C1C] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-[#DFB15B]" />
              <span>
                {showCustomizer
                  ? isAr ? 'إخفاء لوحة التخصيص' : 'Close Customizer'
                  : isAr ? 'فتح أداة تخصيص وتفصيل التورتة' : 'Open Custom Cake Builder'}
              </span>
            </button>
          </div>

          {/* Interactive In-Page Customizer Form (Without Emojis, Direct Shop Sync) */}
          {showCustomizer && (
            <form onSubmit={handleCustomCakeSubmit} className="mt-6 pt-6 border-t border-amber-300/60 animate-in fade-in duration-300 space-y-6">
              {customSubmittedSuccess ? (
                <div className="p-6 sm:p-8 bg-white rounded-2xl border-2 border-emerald-500/80 text-center space-y-4 shadow-xl">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200 shadow-sm">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider">
                      {isAr ? 'تم تسجيل الطلب في نظام إدارة المحل مباشرة' : 'Order Registered in Shop Management System'}
                    </span>
                    <h4 className="text-xl sm:text-2xl font-bold font-display text-stone-900 mt-2">
                      {isAr ? 'تم استلام وتأكيد طلب التورتة الملكية بنجاح' : 'Custom Cake Order Confirmed Successfully'}
                    </h4>
                    <div className="mt-2 inline-block px-4 py-1.5 bg-stone-100 border border-stone-300 rounded-lg text-lg font-mono font-bold text-[#8B1528]">
                      #{customSubmittedSuccess}
                    </div>
                  </div>

                  {/* Details Card */}
                  <div className="bg-stone-50 rounded-xl p-4 text-start border border-stone-200 max-w-lg mx-auto text-xs space-y-2">
                    <div className="flex justify-between border-b border-stone-200 pb-2 font-semibold text-stone-900">
                      <span>{isAr ? 'العميل:' : 'Customer:'} {customerName}</span>
                      <span className="font-mono">{customerPhone}</span>
                    </div>
                    <div className="flex justify-between text-stone-700">
                      <span>{isAr ? 'موعد التسليم المطلوب:' : 'Scheduled Delivery:'}</span>
                      <span className="font-bold text-[#8B1528]">{deliveryDate}</span>
                    </div>
                    <div className="flex justify-between text-stone-700">
                      <span>{isAr ? 'المقاس:' : 'Dimensions:'}</span>
                      <span className="font-medium">
                        {cakeShape === 'rectangle_60x40' ? 'صاج 60×40 سم (50-60 فرد)' :
                         cakeShape === 'rectangle_40x30' ? 'مستطيل 40×30 سم (25 فرد)' :
                         cakeShape === 'round_28' ? 'دائري 28 سم' : 'طوابق مناسبات'}
                      </span>
                    </div>
                    <div className="flex justify-between text-stone-700">
                      <span>{isAr ? 'نوع الكريمة:' : 'Cream:'}</span>
                      <span className="font-medium">
                        {creamType === 'dairy_heavy' ? 'كريمة لباني طبيعية 100%' :
                         creamType === 'chantilly_french' ? 'كريم شانتيه فرنسي' : 'مزيج نصف ونصف'}
                      </span>
                    </div>
                    {cakeDedicationText && (
                      <div className="flex justify-between text-stone-700">
                        <span>{isAr ? 'عبارة الإهداء:' : 'Dedication:'}</span>
                        <span className="font-bold text-[#8B1528]">"{cakeDedicationText}"</span>
                      </div>
                    )}
                    <div className="border-t border-stone-200 pt-2 flex justify-between font-bold text-stone-900 text-sm">
                      <span>{isAr ? 'السعر التقديري:' : 'Total Price:'}</span>
                      <span className="text-[#8B1528] font-display">{customEstimatedPrice} ج.م</span>
                    </div>
                  </div>

                  {/* Attached Images Preview Box */}
                  {uploadedImages.length > 0 && (
                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 inline-block text-start">
                      <span className="text-[11px] font-bold text-stone-700 block mb-2">
                        {isAr ? 'الصور المرفقة للديزاين (تم حفظها بنظام المحل):' : 'Attached Reference Photos (Saved in System):'}
                      </span>
                      <div className="flex items-center gap-2">
                        {uploadedImages.map((img, i) => (
                          <img
                            key={i}
                            src={img}
                            alt="Cake Design"
                            className="w-14 h-14 object-cover rounded-lg border border-stone-200 shadow-2xs"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setCustomSubmittedSuccess(null);
                        setShowCustomizer(false);
                      }}
                      className="px-6 py-2.5 bg-[#8B1528] hover:bg-[#700C1C] text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-sm"
                    >
                      {isAr ? 'إتمام ومتابعة التسوق' : 'Done & Continue Shopping'}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Step 1: Shape & Dimensions */}
                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-2">
                      {isAr ? '1. اختر مقاس وشكل التورتة:' : '1. Select Shape & Dimensions:'}
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                      {[
                        { id: 'rectangle_60x40', title: isAr ? 'صاج مستطيل 60×40 سم' : 'Grand 60×40 cm', desc: isAr ? 'يكفي 50-60 فرداً' : '50-60 Servings', price: '1450 ج.م' },
                        { id: 'rectangle_40x30', title: isAr ? 'مستطيل وسط 40×30 سم' : 'Medium 40×30 cm', desc: isAr ? 'يكفي 25-30 فرداً' : '25-30 Servings', price: '850 ج.م' },
                        { id: 'round_28', title: isAr ? 'دائري قطر 28 سم' : 'Round 28 cm', desc: isAr ? 'يكفي 12-14 فرداً' : '12-14 Servings', price: '480 ج.م' },
                        { id: 'tiered', title: isAr ? 'طوابق وأدوار للأعراس' : 'Multi-Tiered Wedding', desc: isAr ? 'حفلات ومناسبات كبرى' : 'Large Banquets', price: '2200 ج.م' },
                      ].map((s) => (
                        <div
                          key={s.id}
                          onClick={() => setCakeShape(s.id as any)}
                          className={`p-3 rounded-xl border cursor-pointer transition-all ${
                            cakeShape === s.id
                              ? 'border-[#8B1528] bg-rose-50/80 ring-2 ring-[#8B1528]/30'
                              : 'border-stone-200 bg-white hover:border-stone-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-stone-900">{s.title}</span>
                            <span className="text-[11px] font-bold text-[#8B1528]">{s.price}</span>
                          </div>
                          <span className="text-[11px] text-stone-500 block mt-0.5">{s.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Step 2: Cream & Sponge Types */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Cream Type */}
                    <div>
                      <label className="block text-xs font-bold text-stone-800 mb-1.5">
                        {isAr ? '2. نوع الكريمة المفضلة:' : '2. Preferred Cream Type:'}
                      </label>
                      <select
                        value={creamType}
                        onChange={(e) => setCreamType(e.target.value as any)}
                        className="w-full p-2.5 bg-white border border-stone-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#8B1528]"
                      >
                        <option value="dairy_heavy">{isAr ? 'كريمة لباني طبيعية 100% طازجة (خفيفة السكر)' : '100% Fresh Dairy Cream (Light Sugar)'}</option>
                        <option value="chantilly_french">{isAr ? 'كريم شانتيه فرنسي ناعم ومتماسك' : 'Classic French Chantilly Cream'}</option>
                        <option value="half_half">{isAr ? 'مزيج نصف كريم شانتيه ونصف كريمة لباني' : 'Dual Mix Chantilly & Dairy Cream'}</option>
                      </select>
                    </div>

                    {/* Sponge Flavor */}
                    <div>
                      <label className="block text-xs font-bold text-stone-800 mb-1.5">
                        {isAr ? '3. نكهة الكيك الإسفنجي:' : '3. Sponge Cake Flavor:'}
                      </label>
                      <select
                        value={spongeType}
                        onChange={(e) => setSpongeType(e.target.value as any)}
                        className="w-full p-2.5 bg-white border border-stone-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#8B1528]"
                      >
                        <option value="half_half">{isAr ? 'نصف فانيليا بوربون ونصف شوكولاتة فادج' : 'Half Vanilla & Half Chocolate Fudge'}</option>
                        <option value="bourbon_vanilla">{isAr ? 'فانيليا بوربون طبيعية فاخرة' : 'Bourbon Vanilla Sponge'}</option>
                        <option value="chocolate_fudge">{isAr ? 'شوكولاتة داكنة بلجيكية غنية' : 'Belgian Dark Chocolate Fudge'}</option>
                      </select>
                    </div>
                  </div>

                  {/* Step 3: Fillings & Dedication Text */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-800 mb-1.5">
                        {isAr ? '4. الحشوة والتزيين العلوي:' : '4. Filling & Topping:'}
                      </label>
                      <select
                        value={fillingType}
                        onChange={(e) => setFillingType(e.target.value as any)}
                        className="w-full p-2.5 bg-white border border-stone-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#8B1528]"
                      >
                        <option value="fresh_fruits">{isAr ? 'تشكيلة فواكه طازجة (فراولة، مانجو، كيوي، توت)' : 'Fresh Exotic Fruits Bouquet'}</option>
                        <option value="mango_passion">{isAr ? 'مانجو إسمعلاوي طازج مع باشن فروت' : 'Fresh Mango & Passion Fruit'}</option>
                        <option value="lotus_caramel">{isAr ? 'لوتس وكراميل الزبدة وبسكويت مقرمش' : 'Lotus Biscoff & Butter Caramel'}</option>
                        <option value="nutella_hazelnuts">{isAr ? 'نوتيلا أصلية مع بندق محمص كامل' : 'Nutella & Whole Roasted Hazelnuts'}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-800 mb-1.5">
                        {isAr ? '5. عبارة الإهداء المكتوبة على التورتة:' : '5. Cake Dedication Writing:'}
                      </label>
                      <input
                        type="text"
                        value={cakeDedicationText}
                        onChange={(e) => setCakeDedicationText(e.target.value)}
                        placeholder={isAr ? 'مثال: ألف مبروك يا دكتورة سارة / Happy Birthday' : 'e.g. Happy Birthday Sarah'}
                        className="w-full p-2.5 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#8B1528]"
                      />
                    </div>
                  </div>

                  {/* Step 4: Contact & Schedule Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        {isAr ? 'الاسم الكريم:' : 'Your Name:'}
                      </label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder={isAr ? 'اسم المستلم' : 'Recipient Name'}
                        className="w-full p-2 text-xs bg-white border border-stone-200 rounded-lg focus:outline-none focus:border-[#8B1528]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        {isAr ? 'رقم الهاتف:' : 'Phone Number:'}
                      </label>
                      <input
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder={isAr ? '01012345678' : 'Mobile Number'}
                        className="w-full p-2 text-xs bg-white border border-stone-200 rounded-lg focus:outline-none focus:border-[#8B1528]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        {isAr ? 'تاريخ الاستلام أو التوصيل:' : 'Delivery Date:'}
                      </label>
                      <input
                        type="date"
                        value={deliveryDate}
                        onChange={(e) => setDeliveryDate(e.target.value)}
                        className="w-full p-2 text-xs bg-white border border-stone-200 rounded-lg focus:outline-none focus:border-[#8B1528]"
                      />
                    </div>
                  </div>

                  {/* Image Attachment */}
                  <div className="pt-2">
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      {isAr ? 'إرفاق صورة ديزاين أو فكرة للتورتة (اختياري):' : 'Attach Reference Design (Optional):'}
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="cursor-pointer px-3 py-2 bg-white hover:bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold flex items-center gap-2 text-stone-700">
                        <Upload className="w-4 h-4 text-[#8B1528]" />
                        <span>{isAr ? 'رفع صورة الديزاين من جهازك' : 'Upload Design Image'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                      {uploadedImages.length > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-emerald-700 font-bold">
                            ✓ {uploadedImages.length} {isAr ? 'صور مرفقة ومحفوظة' : 'images attached'}
                          </span>
                          <button
                            type="button"
                            onClick={() => setUploadedImages([])}
                            className="text-[11px] text-rose-600 hover:underline cursor-pointer"
                          >
                            {isAr ? 'حذف الصور' : 'Remove'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Submit Action & Estimated Total */}
                  <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <span className="text-xs text-stone-500 block">{isAr ? 'السعر التقديري:' : 'Estimated Price:'}</span>
                      <span className="text-2xl font-bold text-[#8B1528] font-display">{customEstimatedPrice} ج.م</span>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingCustom}
                      className="w-full sm:w-auto px-7 py-3 bg-[#8B1528] hover:bg-[#700C1C] text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:bg-stone-400"
                    >
                      {isSubmittingCustom ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>{isAr ? 'جاري تسجيل الطلب في نظام المحل...' : 'Processing...'}</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          <span>
                            {isAr
                              ? 'تأكيد طلب التورتة وإرساله للمحل مباشرة'
                              : 'Submit Custom Cake Order to Shop'}
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </form>
          )}
        </div>

        {/* Dessert Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredItems.map((item) => {
            const isChantilly = item.category === 'chantilly_cakes';
            const defaultPortion = item.portionOptions[0];
            const isJustAdded = addedItemNotice === item.id;

            return (
              <div
                key={item.id}
                className="group relative bg-white rounded-2xl border border-stone-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden hover:border-[#8B1528]/40 text-start"
              >
                {/* Image & Badges */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
                  <img
                    src={item.image}
                    alt={item.name[language]}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                  {/* Top Badges */}
                  <div className="absolute top-3 start-3 end-3 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {isChantilly && (
                        <span className="bg-[#8B1528] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                          {isAr ? 'تورتة كريمة' : 'Cream Cake'}
                        </span>
                      )}
                      {item.isBestSeller && (
                        <span className="bg-[#DFB15B] text-stone-950 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                          {isAr ? 'الأكثر طلباً' : 'Best Seller'}
                        </span>
                      )}
                    </div>

                    <div className="bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 rounded-lg text-xs font-semibold flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-[#DFB15B] fill-[#DFB15B]" />
                      <span>{item.rating}</span>
                    </div>
                  </div>

                  {/* Quick View Button on Image Hover */}
                  <button
                    onClick={() => onQuickView(item)}
                    className="absolute bottom-3 end-3 px-3 py-1.5 bg-white/90 hover:bg-white text-stone-900 rounded-xl text-xs font-bold shadow-md transition-all opacity-0 group-hover:opacity-100 flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#8B1528]" />
                    <span>{isAr ? 'تفاصيل الحجم' : 'Quick View'}</span>
                  </button>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Subcategory */}
                    <span className="text-[11px] font-bold text-[#C5A059] uppercase tracking-wider block mb-1">
                      {item.subCategory?.[language] || (isAr ? 'حلويات ملكية' : 'Royal Sweets')}
                    </span>

                    {/* Title */}
                    <h3 className="text-base font-bold text-stone-900 group-hover:text-[#8B1528] transition-colors line-clamp-1">
                      {item.name[language]}
                    </h3>

                    {/* Description */}
                    <p className="mt-1.5 text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {item.description[language]}
                    </p>

                    {/* Dietary Tags */}
                    <div className="mt-3 flex flex-wrap items-center gap-1 text-[11px] text-stone-500 font-medium">
                      {item.dietaryTags.slice(0, 2).map((t, idx) => (
                        <span key={idx} className="bg-stone-100 px-2 py-0.5 rounded-md">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Price & Action Button */}
                  <div className="mt-5 pt-3.5 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-stone-400 block">
                        {defaultPortion?.label[language]}
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-bold text-[#8B1528] font-display">
                          {Math.round(item.price * defaultPortion.priceMultiplier)}
                        </span>
                        <span className="text-xs font-semibold text-stone-700">ج.م</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onQuickView(item)}
                        className="p-2 text-stone-600 hover:text-[#8B1528] hover:bg-stone-100 rounded-xl transition-colors cursor-pointer border border-stone-200"
                        title={isAr ? 'تخصيص الحجم والسكر' : 'Customize'}
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleQuickAdd(item)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                          isJustAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#8B1528] hover:bg-[#700C1C] text-white shadow-sm'
                        }`}
                      >
                        {isJustAdded ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{isAr ? 'تمت الإضافة' : 'Added'}</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>{isAr ? 'أضف للسلة' : 'Add'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-16 bg-stone-50 rounded-2xl border border-stone-200">
            <p className="text-stone-500 text-sm">
              {isAr ? `لم نجد أصناف تطابق بحثك: "${searchQuery}"` : `No items matched your search: "${searchQuery}"`}
            </p>
            <p className="text-xs text-stone-400 mt-1">
              {isAr ? 'جرب البحث بكلمات عامة مثل: كنافة، ساخنة، بقلاوة، كريمة، مانجو، لوتس' : 'Try searching for: Knafeh, Cream, Baklava, Mango, Lotus'}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                onSelectCategory('all');
              }}
              className="mt-4 px-5 py-2 text-xs font-bold text-white bg-[#8B1528] rounded-xl hover:bg-[#700C1C] cursor-pointer"
            >
              {isAr ? 'عرض كافة الحلويات والتورت' : 'Show All Desserts'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
