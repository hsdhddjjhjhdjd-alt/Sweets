import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Users, CheckCircle2, Sparkles, Phone, Loader2 } from 'lucide-react';
import { Language, ReservationRecord } from '../types';
import { saveNewReservation, getShopSettings } from '../services/shopService';

interface TableReservationModalProps {
  isOpen: boolean;
  language: Language;
  onClose: () => void;
}

export const TableReservationModal: React.FC<TableReservationModalProps> = ({
  isOpen,
  language,
  onClose,
}) => {
  const isAr = language === 'ar';

  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('16:00');
  const [guests, setGuests] = useState(2);
  const [seating, setSeating] = useState<'indoor' | 'terrace' | 'majlis'>('indoor');
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [specialOccasion, setSpecialOccasion] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [reservationCode, setReservationCode] = useState('');
  const [shopWhatsApp, setShopWhatsApp] = useState('201069844724');

  useEffect(() => {
    getShopSettings().then((s) => {
      if (s.whatsappNumber) setShopWhatsApp(s.whatsappNumber);
    });
  }, []);

  if (!isOpen) return null;

  const timeSlots = [
    { value: '11:00', label: { ar: '11:00 صباحاً (فطور ملكي)', en: '11:00 AM (Royal Breakfast)' } },
    { value: '14:00', label: { ar: '02:00 ظهراً (شاي بعد الظهيرة)', en: '02:00 PM (Afternoon Tea)' } },
    { value: '16:30', label: { ar: '04:30 عصراً (جلسة الضيافة)', en: '04:30 PM (Hospitality Hour)' } },
    { value: '19:00', label: { ar: '07:00 مساءً (سهرة الحلوى)', en: '07:00 PM (Dessert Salon)' } },
    { value: '21:30', label: { ar: '09:30 مساءً (كنافة ساخنة وقهوة)', en: '09:30 PM (Late Night Knafeh)' } },
  ];

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !guestPhone) return;

    setIsSubmitting(true);
    const code = `RSV-${Math.floor(1000 + Math.random() * 9000)}`;

    const record: Omit<ReservationRecord, 'id'> = {
      reservationCode: code,
      createdAt: new Date().toISOString(),
      date: date || new Date().toISOString().split('T')[0],
      timeSlot,
      guests,
      seating,
      guestName,
      guestPhone,
      specialOccasion,
      status: 'pending',
    };

    try {
      await saveNewReservation(record);
    } catch (err) {
      console.warn('Failed saving reservation to Firestore:', err);
    } finally {
      setIsSubmitting(false);
      setReservationCode(code);
      setIsSuccess(true);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    onClose();
  };

  const cleanShopPhone = shopWhatsApp.replace(/[^0-9]/g, '');
  const whatsAppText = encodeURIComponent(
    `مرحباً قصر الحلويات الملكي، أرغب في تأكيد حجز صالون الشاي رقم (${reservationCode}) باسم ${guestName} لعدد ${guests} ضيوف بتاريخ ${date} في تمام ${timeSlot}.`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative bg-white rounded-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#7A0C1E] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 end-4 p-1.5 text-stone-300 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-[#DFB15B] text-xs font-semibold mb-1">
            <Sparkles className="w-4 h-4" />
            <span>{isAr ? 'صالون الشاي والحلويات الفاخرة' : 'Royal Tea & Dessert Salon'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display">
            {isAr ? 'حجز طاولة أو جلسة شاي ملكية' : 'Reserve Salon Experience'}
          </h2>
          <p className="text-xs text-stone-200 mt-1">
            {isAr
              ? 'استمتع بتجربة التذوق الفاخرة مع القهوة العربية والشاي المغربي والحلويات الطازجة'
              : 'Delight in an intimate tea salon experience pairing freshly baked pastries with artisan teas'}
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSuccess ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold font-display text-stone-900">
                {isAr ? 'تم استلام وتأكيد حجز طاولتك!' : 'Salon Table Confirmed!'}
              </h3>
              <p className="text-xs text-stone-600 mt-2 max-w-sm mx-auto leading-relaxed">
                {isAr
                  ? `أهلاً بك يا ${guestName}. لقد تم إرسال حجزك لإدارة الصالون لـ (${guests} ضيوف) في الموعد المحدد. رمز الحجز:`
                  : `Welcome, ${guestName}. Your table reservation for ${guests} guests has been recorded. Your booking reference is:`}
              </p>
              <div className="mt-3 inline-block px-4 py-2 bg-stone-100 border border-stone-300 rounded-lg text-sm font-mono font-bold text-[#8B1528]">
                {reservationCode}
              </div>

              <div className="mt-5 space-y-2">
                <a
                  href={`https://api.whatsapp.com/send?phone=${cleanShopPhone}&text=${whatsAppText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{isAr ? 'مشاركة الحجز مع إدارة الصالون عبر واتساب' : 'Send Booking via WhatsApp'}</span>
                </a>

                <button
                  onClick={handleReset}
                  className="w-full py-2.5 bg-stone-900 text-white text-xs font-semibold rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  {isAr ? 'إغلاق ومتابعة التصفح' : 'Close & Continue Browsing'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleBooking} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {isAr ? 'تاريخ الزيارة *' : 'Visit Date *'}
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-[#8B1528]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {isAr ? 'عدد الضيوف' : 'Number of Guests'}
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-[#8B1528] cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6, 8, 10, 12].map((n) => (
                      <option key={n} value={n}>
                        {n} {isAr ? 'أشخاص' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  {isAr ? 'الفترة الزمنية المفضلة' : 'Preferred Time Slot'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.value}
                      type="button"
                      onClick={() => setTimeSlot(slot.value)}
                      className={`px-3 py-2 text-xs rounded-lg border text-start transition-all cursor-pointer ${
                        timeSlot === slot.value
                          ? 'border-[#8B1528] bg-[#8B1528] text-white font-semibold'
                          : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      {slot.label[language]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Seating Preference */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  {isAr ? 'منطقة الجلوس' : 'Salon Ambience'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSeating('indoor')}
                    className={`py-2 px-2 text-xs rounded-lg border text-center transition-all cursor-pointer ${
                      seating === 'indoor'
                        ? 'border-[#8B1528] bg-[#8B1528]/10 text-[#8B1528] font-bold'
                        : 'border-stone-200 bg-stone-50 text-stone-600'
                    }`}
                  >
                    {isAr ? 'الصالون الداخلي' : 'Indoor Salon'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSeating('terrace')}
                    className={`py-2 px-2 text-xs rounded-lg border text-center transition-all cursor-pointer ${
                      seating === 'terrace'
                        ? 'border-[#8B1528] bg-[#8B1528]/10 text-[#8B1528] font-bold'
                        : 'border-stone-200 bg-stone-50 text-stone-600'
                    }`}
                  >
                    {isAr ? 'التراس الخارجي' : 'Garden Terrace'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSeating('majlis')}
                    className={`py-2 px-2 text-xs rounded-lg border text-center transition-all cursor-pointer ${
                      seating === 'majlis'
                        ? 'border-[#8B1528] bg-[#8B1528]/10 text-[#8B1528] font-bold'
                        : 'border-stone-200 bg-stone-50 text-stone-600'
                    }`}
                  >
                    {isAr ? 'المجلس الخاص VIP' : 'VIP Majlis'}
                  </button>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <input
                  type="text"
                  required
                  placeholder={isAr ? 'الاسم الكريم *' : 'Your Name *'}
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-[#8B1528]"
                />
                <input
                  type="tel"
                  required
                  placeholder={isAr ? 'رقم الجوال *' : 'Phone Number *'}
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-[#8B1528]"
                />
              </div>

              <input
                type="text"
                placeholder={isAr ? 'مناسبة خاصة (عيد ميلاد، ذكرى زواج، لقاء عمل)...' : 'Special occasion (anniversary, birthday, business)...'}
                value={specialOccasion}
                onChange={(e) => setSpecialOccasion(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-[#8B1528]"
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#8B1528] hover:bg-[#700C1C] disabled:bg-stone-400 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{isAr ? 'جاري تسجيل الحجز...' : 'Recording Booking...'}</span>
                  </>
                ) : (
                  <span>{isAr ? 'تأكيد الحجز الفوري وإرساله للصالون' : 'Confirm Salon Reservation'}</span>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
