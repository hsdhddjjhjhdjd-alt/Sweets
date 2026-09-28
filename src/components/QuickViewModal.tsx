import React, { useState, useEffect } from 'react';
import { X, Star, Flame, Sparkles, Check, ShoppingBag, ShieldCheck } from 'lucide-react';
import { Language, DessertItem, PortionOption } from '../types';

interface QuickViewModalProps {
  item: DessertItem | null;
  language: Language;
  onClose: () => void;
  onAddToCart: (
    item: DessertItem,
    portion: PortionOption,
    quantity: number,
    sweetness: string,
    specialNote: string
  ) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  item,
  language,
  onClose,
  onAddToCart,
}) => {
  const isAr = language === 'ar';

  const [selectedPortion, setSelectedPortion] = useState<PortionOption | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [sweetness, setSweetness] = useState<string>(
    isAr ? 'معتدل متوازن' : 'Balanced Classic'
  );
  const [specialNote, setSpecialNote] = useState('');
  const [addedSuccess, setAddedSuccess] = useState(false);

  useEffect(() => {
    if (item && item.portionOptions.length > 0) {
      setSelectedPortion(item.portionOptions[0]);
    }
    setQuantity(1);
    setSweetness(isAr ? 'معتدل متوازن' : 'Balanced Classic');
    setSpecialNote('');
  }, [item, isAr]);

  if (!item) return null;

  const currentPortion = selectedPortion || item.portionOptions[0];
  const calculatedUnitPrice = Math.round(item.price * currentPortion.priceMultiplier);
  const calculatedTotalPrice = calculatedUnitPrice * quantity;

  const sweetnessOptions = isAr
    ? ['خفيف سكر أقل', 'معتدل متوازن', 'أصيل غني بالقطر/العسل']
    : ['Light (Reduced Sugar)', 'Balanced Classic', 'Authentic Rich'];

  const handleAdd = () => {
    const portionToUse = selectedPortion || item.portionOptions[0];
    onAddToCart(item, portionToUse, quantity, sweetness, specialNote);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 end-4 z-10 p-2 text-stone-500 hover:text-stone-900 bg-white/90 backdrop-blur-md rounded-full shadow-xs hover:bg-stone-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Top Banner with Image */}
        <div className="relative aspect-[16/9] w-full bg-stone-100 overflow-hidden">
          <img
            src={item.image}
            alt={item.name[language]}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent"></div>
          
          <div className="absolute bottom-4 start-5 end-5 text-white">
            <div className="flex items-center gap-2 text-xs mb-1 text-[#DFB15B]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{item.subCategory ? item.subCategory[language] : (item.category === 'oriental' ? (isAr ? 'حلويات شرقية' : 'Oriental') : (isAr ? 'باتيسري غربي' : 'Western'))}</span>
              <span>·</span>
              <div className="flex items-center gap-1 text-white">
                <Star className="w-3.5 h-3.5 fill-[#DFB15B] text-[#DFB15B]" />
                <span className="font-semibold tabular-nums">{item.rating}</span>
                <span className="text-stone-300 text-xs">({item.reviewsCount} {isAr ? 'تقييم' : 'reviews'})</span>
              </div>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-display leading-tight">
              {item.name[language]}
            </h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Description & Ingredients */}
          <div>
            <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">
              {isAr ? 'عن هذا الصنف' : 'About this Creation'}
            </h4>
            <p className="text-sm text-stone-700 leading-relaxed">
              {item.description[language]}
            </p>

            <div className="mt-3 p-3 bg-stone-50 rounded-xl border border-stone-200/80 text-xs text-stone-600 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-[#8B1528] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-stone-800">{isAr ? 'المكونات الأصيلة: ' : 'Artisan Ingredients: '}</span>
                <span>{item.ingredients[language]}</span>
              </div>
            </div>
          </div>

          {/* Portion / Size Selector */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
              {isAr ? 'اختر الحجم أو طريقة التقديم' : 'Select Portion & Presentation'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {item.portionOptions.map((portion, idx) => {
                const isSelected = currentPortion.label.en === portion.label.en;
                const portionPrice = Math.round(item.price * portion.priceMultiplier);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedPortion(portion)}
                    className={`p-3 rounded-xl border text-start transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#8B1528] bg-[#8B1528]/5 shadow-xs'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-900">
                        {portion.label[language]}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#8B1528]" />}
                    </div>
                    <span className="text-[11px] text-stone-500 block mt-0.5">
                      {portion.weightOrPieces?.[language] || portion.servings?.[language] || ''}
                    </span>
                    <span className="text-xs font-semibold text-[#8B1528] font-display mt-1 block tabular-nums">
                      ${portionPrice}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sweetness Preference Selector */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
              {isAr ? 'درجة الحلاوة والقطر المفضلة' : 'Sweetness & Syrup Level'}
            </label>
            <div className="flex flex-wrap gap-2">
              {sweetnessOptions.map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSweetness(opt)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                    sweetness === opt
                      ? 'bg-[#8B1528] text-white border-[#8B1528]'
                      : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Note or Gift Card Inscription */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              {isAr ? 'ملاحظة خاصة أو رسالة إهداء (اختياري)' : 'Special Request or Gift Message (Optional)'}
            </label>
            <input
              type="text"
              value={specialNote}
              onChange={(e) => setSpecialNote(e.target.value)}
              placeholder={isAr ? 'اكتب عبارة الإهداء لتطبع على بطاقة ذهبية فاخرة...' : 'Write custom gift note or allergies for the kitchen...'}
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-[#8B1528] focus:bg-white"
            />
          </div>

          {/* Bottom Bar: Quantity & Add to Cart */}
          <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Quantity Stepper */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-stone-500">
                {isAr ? 'الكمية:' : 'Qty:'}
              </span>
              <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1.5 text-stone-600 hover:text-stone-900 font-bold"
                >
                  -
                </button>
                <span className="px-3 text-xs sm:text-sm font-semibold text-stone-800 tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-1.5 text-stone-600 hover:text-stone-900 font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Total Price & Add Button */}
            <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
              <div className="text-end">
                <span className="text-[10px] text-stone-400 block font-normal">
                  {isAr ? 'المجموع' : 'Total'}
                </span>
                <span className="text-xl font-bold text-stone-900 font-display tabular-nums">
                  ${calculatedTotalPrice}
                </span>
              </div>

              <button
                type="button"
                onClick={handleAdd}
                className={`px-6 py-3 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-md ${
                  addedSuccess
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#8B1528] hover:bg-[#700C1C] text-white active:scale-95'
                }`}
              >
                <ShoppingBag className="w-4 h-4 text-[#DFB15B]" />
                <span>
                  {addedSuccess
                    ? (isAr ? 'تمت الإضافة بنجاح ✓' : 'Added to Cart ✓')
                    : (isAr ? 'إضافة إلى سلة الطلبات' : 'Add to Order Bag')}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
