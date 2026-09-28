import React, { useState, useEffect } from 'react';
import { Calendar, Users, Sparkles, CheckCircle2, Send, Award, Phone, Loader2 } from 'lucide-react';
import { Language, CateringInquiry } from '../types';
import { saveNewCateringInquiry, getShopSettings } from '../services/shopService';

interface CateringCalculatorProps {
  language: Language;
}

export const CateringCalculator: React.FC<CateringCalculatorProps> = ({ language }) => {
  const isAr = language === 'ar';

  const [guestCount, setGuestCount] = useState(60);
  const [eventType, setEventType] = useState('wedding');
  const [ratioOriental, setRatioOriental] = useState(50); // Oriental percentage
  const [tier, setTier] = useState<'gold' | 'velvet' | 'crystal'>('gold');
  const [eventDate, setEventDate] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [notes, setNotes] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedInquiry, setSubmittedInquiry] = useState<CateringInquiry | null>(null);
  const [shopWhatsApp, setShopWhatsApp] = useState('201069844724');

  useEffect(() => {
    getShopSettings().then((s) => {
      if (s.whatsappNumber) setShopWhatsApp(s.whatsappNumber);
    });
  }, []);

  // Calculations
  const totalPieces = guestCount * 4;
  const orientalPieces = Math.round((totalPieces * ratioOriental) / 100);
  const westernPieces = totalPieces - orientalPieces;
  
  const basePricePerGuest = tier === 'gold' ? 14 : tier === 'velvet' ? 18 : 24;
  const estimatedTotal = guestCount * basePricePerGuest;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone) return;

    setIsSubmitting(true);
    const inquiry: Omit<CateringInquiry, 'id'> = {
      eventType,
      guestCount,
      ratioOriental,
      ratioWestern: 100 - ratioOriental,
      tier,
      eventDate: eventDate || new Date().toISOString().split('T')[0],
      clientName,
      clientPhone,
      clientEmail,
      notes,
    };

    try {
      await saveNewCateringInquiry(inquiry);
    } catch (err) {
      console.warn('Failed saving catering inquiry:', err);
    } finally {
      setIsSubmitting(false);
      setSubmittedInquiry(inquiry);
    }
  };

  const eventTypes = [
    { id: 'wedding', label: { ar: 'حفل زفاف ملكي', en: 'Royal Wedding' } },
    { id: 'corporate', label: { ar: 'فعالية شركات أو مؤتمر VIP', en: 'VIP Corporate Gala' } },
    { id: 'family', label: { ar: 'مجلس عائلي أو ملكة', en: 'Family Majlis & Engagement' } },
    { id: 'seasonal', label: { ar: 'غبقة رمضانية / عيد مبارك', en: 'Ramadan Ghabga & Eid' } },
  ];

  const cleanShopPhone = shopWhatsApp.replace(/[^0-9]/g, '');
  const whatsAppText = submittedInquiry
    ? encodeURIComponent(
        `مرحباً إدارة قصر الحلويات الملكي، قمت بتعبئة طلب حاسبة الضيافة وبوفيه المناسبات:\n• الاسم: ${submittedInquiry.clientName}\n• المناسبة: ${submittedInquiry.eventType}\n• عدد الضيوف: ${submittedInquiry.guestCount}\n• التكلفة التقديرية: $${estimatedTotal}\nأرجو التواصل لتأكيد التفاصيل وتنسيق التذوق.`
      )
    : '';

  return (
    <section id="catering" className="py-16 sm:py-24 bg-[#7A0C1E] text-white relative overflow-hidden">
      {/* Subtle Arabesque Motif Overlay */}
      <div className="absolute inset-0 bg-arabesque-ruby opacity-90 pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DFB15B]/20 border border-[#DFB15B]/30 text-[#DFB15B] text-xs font-semibold mb-3">
            <Award className="w-3.5 h-3.5" />
            <span>{isAr ? 'خدمات الضيافة الملكية والأعراس' : 'Royal Catering & Bespoke Events'}</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold font-display tracking-tight text-white">
            {isAr ? 'حاسبة بوفيه الضيافة والمناسبات الخاصة' : 'Bespoke Catering & Event Calculator'}
          </h2>

          <p className="mt-4 text-stone-200 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            {isAr
              ? 'صمم بوفيه حلويات متكامل يجمع بين أرقى أصناف الشرق والغرب. احسب الكميات المقترحة واحصل على عرض سعر فوري مخصص لضيوفك.'
              : 'Curate an unforgettable dessert table harmonizing Eastern pastry craft and Parisian gateaux for weddings, royal majlises, and galas.'}
          </p>
        </div>

        {/* Interactive Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column (7 cols) */}
          <div className="lg:col-span-7 bg-white/95 text-stone-900 rounded-2xl p-6 sm:p-8 shadow-2xl border border-[#DFB15B]/30 backdrop-blur-md">
            <h3 className="text-xl font-bold font-display text-[#7A0C1E] mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#C5A059]" />
              <span>{isAr ? 'تخصيص تفاصيل المناسبة' : 'Customize Event Specifications'}</span>
            </h3>

            <div className="space-y-6">
              {/* Event Type */}
              <div>
                <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-2">
                  {isAr ? 'نوع الفعالية' : 'Event Occasion'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {eventTypes.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setEventType(type.id)}
                      className={`p-2.5 text-xs font-medium rounded-lg border text-start transition-all cursor-pointer ${
                        eventType === type.id
                          ? 'border-[#8B1528] bg-[#8B1528] text-white shadow-xs'
                          : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      {type.label[language]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Guest Count Slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-[#8B1528]" />
                    <span>{isAr ? 'عدد الضيوف المتوقع' : 'Expected Guest Count'}</span>
                  </label>
                  <span className="text-base font-bold text-[#8B1528] font-display tabular-nums">
                    {guestCount} {isAr ? 'ضيف' : 'Guests'}
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="500"
                  step="10"
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-full accent-[#8B1528] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-stone-400 mt-1">
                  <span>20</span>
                  <span>100</span>
                  <span>250</span>
                  <span>500+</span>
                </div>
              </div>

              {/* Sweet Mix Ratio (Oriental vs Western) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider">
                    {isAr ? 'نسبة المزج بين الشرقي والغربي' : 'East vs. West Sweet Ratio'}
                  </label>
                  <span className="text-xs font-semibold text-stone-800 tabular-nums">
                    {ratioOriental}% {isAr ? 'شرقي' : 'Oriental'} · {100 - ratioOriental}% {isAr ? 'غربي' : 'Western'}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="10"
                  value={ratioOriental}
                  onChange={(e) => setRatioOriental(Number(e.target.value))}
                  className="w-full accent-[#C5A059] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-stone-500 font-medium mt-1">
                  <span className="text-[#8B1528]">{isAr ? '100% باتيسري فرنسي' : '100% French Patisserie'}</span>
                  <span className="text-[#C5A059]">{isAr ? '50 / 50 متوازن' : '50 / 50 Balanced'}</span>
                  <span className="text-[#8B1528]">{isAr ? '100% حلويات شرقية' : '100% Oriental Sweets'}</span>
                </div>
              </div>

              {/* Presentation Tier */}
              <div>
                <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-2">
                  {isAr ? 'مستوى التقديم والصواني' : 'Presentation Tier & Ware'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setTier('gold')}
                    className={`p-3 rounded-xl border text-start transition-all cursor-pointer ${
                      tier === 'gold'
                        ? 'border-[#8B1528] bg-[#8B1528]/5 shadow-xs'
                        : 'border-stone-200 bg-stone-50 hover:bg-stone-100'
                    }`}
                  >
                    <span className="text-xs font-bold text-stone-900 block">
                      {isAr ? 'صواني ذهبية فاخرة' : 'Signature Brass'}
                    </span>
                    <span className="text-[11px] text-stone-500 block mt-0.5">
                      {isAr ? '14$ / ضيف' : '$14 / guest'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTier('velvet')}
                    className={`p-3 rounded-xl border text-start transition-all cursor-pointer ${
                      tier === 'velvet'
                        ? 'border-[#8B1528] bg-[#8B1528]/5 shadow-xs'
                        : 'border-stone-200 bg-stone-50 hover:bg-stone-100'
                    }`}
                  >
                    <span className="text-xs font-bold text-stone-900 block">
                      {isAr ? 'صناديق مخملية مذهبة' : 'Velvet Prestige'}
                    </span>
                    <span className="text-[11px] text-stone-500 block mt-0.5">
                      {isAr ? '18$ / ضيف' : '$18 / guest'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTier('crystal')}
                    className={`p-3 rounded-xl border text-start transition-all cursor-pointer ${
                      tier === 'crystal'
                        ? 'border-[#8B1528] bg-[#8B1528]/5 shadow-xs'
                        : 'border-stone-200 bg-stone-50 hover:bg-stone-100'
                    }`}
                  >
                    <span className="text-xs font-bold text-stone-900 block">
                      {isAr ? 'أبراج كريستال وخدمة حية' : 'Crystal & Live Station'}
                    </span>
                    <span className="text-[11px] text-stone-500 block mt-0.5">
                      {isAr ? '24$ / ضيف' : '$24 / guest'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Breakdown & Inquiry Form Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Live Calculation Summary Card */}
            <div className="bg-stone-900/90 text-white p-6 sm:p-7 rounded-2xl border border-[#DFB15B]/40 shadow-2xl backdrop-blur-md">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-[#DFB15B] mb-4">
                {isAr ? 'تقدير الكميات والميزانية' : 'Estimated Allocation & Quote'}
              </h4>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between py-2 border-b border-stone-800">
                  <span className="text-stone-300">{isAr ? 'إجمالي القطع الموصى بها:' : 'Recommended Pieces:'}</span>
                  <span className="font-bold text-white tabular-nums">{totalPieces} {isAr ? 'قطعة' : 'Pcs'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-stone-800 text-stone-300">
                  <span>{isAr ? 'حلويات شرقية (بقلاوة، كنافة، معمول):' : 'Oriental (Baklava, Knafeh):'}</span>
                  <span className="font-semibold text-[#DFB15B] tabular-nums">{orientalPieces} {isAr ? 'قطعة' : 'Pcs'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-stone-800 text-stone-300">
                  <span>{isAr ? 'حلويات غربية (ميل فوي، ماكرون، تارت):' : 'Western (Mille-Feuille, Tarts):'}</span>
                  <span className="font-semibold text-rose-300 tabular-nums">{westernPieces} {isAr ? 'قطعة' : 'Pcs'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-stone-800 text-stone-300">
                  <span>{isAr ? 'شامل أواني التقديم والتنسيق الفاخر:' : 'Luxury Ware & Table Dressing:'}</span>
                  <span className="font-semibold text-emerald-400">{isAr ? 'مشمول مجاناً' : 'Included'}</span>
                </div>
                <div className="flex items-baseline justify-between pt-3 text-base">
                  <span className="font-bold text-white font-display text-lg">
                    {isAr ? 'التكلفة التقديرية:' : 'Estimated Total:'}
                  </span>
                  <span className="text-2xl font-bold text-[#DFB15B] font-display tabular-nums">
                    ${estimatedTotal.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Inquiry Form */}
            <div className="bg-white text-stone-900 p-6 rounded-2xl border border-stone-200 shadow-xl">
              {submittedInquiry ? (
                <div className="text-center py-6">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="text-lg font-bold font-display text-stone-900">
                    {isAr ? 'تم استلام طلب الضيافة بنجاح!' : 'Catering Inquiry Received!'}
                  </h4>
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                    {isAr
                      ? `شكراً لك يا ${submittedInquiry.clientName}. تم تسجيل طلبك في نظام إدارة المتجر وسيتواصل معك مدير الضيافة الملكية في غضون ساعتين.`
                      : `Thank you, ${submittedInquiry.clientName}. Your catering request is logged in the shop dashboard. Our executive director will contact you shortly.`}
                  </p>

                  <div className="mt-4 space-y-2">
                    <a
                      href={`https://api.whatsapp.com/send?phone=${cleanShopPhone}&text=${whatsAppText}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{isAr ? 'إرسال طلب الضيافة عبر واتساب المحل' : 'Send Quote via WhatsApp'}</span>
                    </a>

                    <button
                      onClick={() => setSubmittedInquiry(null)}
                      className="text-xs font-semibold text-[#8B1528] underline block mx-auto cursor-pointer"
                    >
                      {isAr ? 'إرسال استفسار لمناسبة أخرى' : 'Submit another inquiry'}
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <h4 className="text-sm font-bold font-display text-[#7A0C1E]">
                    {isAr ? 'احجز موعد تذوق أو استلم عرض السعر الرسمي' : 'Request Official Quote & Tasting'}
                  </h4>

                  <div>
                    <input
                      type="text"
                      required
                      placeholder={isAr ? 'الاسم الكريم *' : 'Full Name *'}
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-[#8B1528]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="tel"
                      required
                      placeholder={isAr ? 'رقم الجوال أو واتساب *' : 'Phone / WhatsApp *'}
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-[#8B1528]"
                    />
                    <input
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-[#8B1528]"
                    />
                  </div>

                  <div>
                    <input
                      type="email"
                      placeholder={isAr ? 'البريد الإلكتروني (اختياري)' : 'Email Address (Optional)'}
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-[#8B1528]"
                    />
                  </div>

                  <div>
                    <textarea
                      rows={2}
                      placeholder={isAr ? 'تفاصيل إضافية (المكان، الثيم المفضل، تفضيلات خاصة)...' : 'Additional requirements (location, theme, custom requests)...'}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-[#8B1528]"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 text-xs font-semibold text-white bg-[#8B1528] hover:bg-[#700C1C] disabled:bg-stone-400 rounded-lg shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>{isAr ? 'جاري الإرسال...' : 'Sending...'}</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>{isAr ? 'إرسال طلب الضيافة والتواصل الفوري' : 'Submit Catering Request'}</span>
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-center text-stone-500">
                    {isAr ? 'سيصل الطلب فورياً لشاشة إدارة المحل للتنسيق' : 'Request goes directly to shop event managers'}
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
