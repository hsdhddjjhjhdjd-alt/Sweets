import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, Instagram, Facebook, Shield } from 'lucide-react';
import { Language } from '../types';

interface FooterProps {
  language: Language;
  onNavigate: (sectionId: string) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ language, onNavigate, onOpenAdmin }) => {
  const isAr = language === 'ar';
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubscribed(true);
  };

  const locations = [
    {
      city: { ar: 'دبي - الفرع الرئيسي (داون تاون)', en: 'Dubai - Downtown Flagship' },
      address: { ar: 'بوليفارد الشيخ محمد بن راشد، برج بلازا', en: 'Sheikh Mohammed Bin Rashid Blvd, Plaza Tower' },
      phone: '+971 4 800 79338',
      mapUrl: 'https://maps.google.com/?q=Downtown+Dubai',
    },
    {
      city: { ar: 'دبي - نخلة جميرا (رويال بوتيك)', en: 'Dubai - Palm Jumeirah Boutique' },
      address: { ar: 'الممشى الملكي، نخلة جميرا', en: 'The Royal Boardwalk, Palm Jumeirah' },
      phone: '+971 4 800 79339',
      mapUrl: 'https://maps.google.com/?q=Palm+Jumeirah+Dubai',
    },
    {
      city: { ar: 'الرياض - صالون العليا الفاخر', en: 'Riyadh - Olaya Luxury Salon' },
      address: { ar: 'طريق الأمير محمد بن عبدالعزيز (التحلية)', en: 'Prince Mohammed Bin Abdulaziz Rd (Tahlia)' },
      phone: '+966 11 800 7933',
      mapUrl: 'https://maps.google.com/?q=Olaya+Riyadh',
    },
  ];

  return (
    <footer id="contact" className="bg-[#680E1C] text-white border-t border-[#DFB15B]/30 relative overflow-hidden">
      {/* Subtle Arabesque Pattern Overlay */}
      <div className="absolute inset-0 bg-arabesque-ruby opacity-70 pointer-events-none"></div>

      {/* Main Footer Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Brand & Newsletter (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <div>
              <span className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
                {isAr ? 'قصر الحلويات الملكي' : 'Royal Pâtisserie'}
              </span>
              <p className="text-xs uppercase tracking-widest text-[#DFB15B] font-semibold mt-1">
                {isAr ? 'أصالة الشرق & فخامة الغرب' : 'Oriental Heritage & Parisian Elegance'}
              </p>
            </div>

            <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
              {isAr
                ? 'علامة الضيافة الفاخرة التي تعيد تعريف فنون صناعة الحلويات. طهاة محترفون، زبدة فرنسية أصيلة، وفستق حلبي أخضر نخب أول.'
                : 'The premier destination for handcrafted epicurean sweets, marrying centuries of Levantine tradition with refined French pastry techniques.'}
            </p>

            {/* Newsletter Subscription */}
            <div className="pt-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#DFB15B] mb-2">
                {isAr ? 'نادي الذواقة الملكي (خصم 10%)' : 'VIP Epicurean Club (10% Off)'}
              </h4>
              <p className="text-xs text-stone-300 mb-2">
                {isAr ? 'اشترك لتصلك تشكيلات المواسم ودعوات التذوق الحصرية' : 'Subscribe for seasonal menu previews and tasting invitations'}
              </p>

              {subscribed ? (
                <div className="p-3 bg-white/10 rounded-lg text-xs text-[#DFB15B] flex items-center gap-2 border border-[#DFB15B]/40">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{isAr ? 'شكراً لاشتراكك! تم إرسال كود الهدية إلى بريدك.' : 'Welcome! Your 10% welcome coupon is in your inbox.'}</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder={isAr ? 'بريدك الإلكتروني...' : 'Your email address...'}
                    className="flex-1 px-3 py-2 text-xs bg-white/10 border border-white/20 rounded-lg text-white placeholder-stone-300 focus:outline-none focus:border-[#DFB15B]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#DFB15B] hover:bg-[#C5A059] text-[#680E1C] text-xs font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Quick Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#DFB15B]">
              {isAr ? 'روابط سريعة' : 'Navigation'}
            </h4>
            <ul className="space-y-2 text-xs text-stone-200">
              <li>
                <button onClick={() => onNavigate('hero')} className="hover:text-[#DFB15B] transition-colors cursor-pointer">
                  {isAr ? 'الرئيسية' : 'Home'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('categories')} className="hover:text-[#DFB15B] transition-colors cursor-pointer">
                  {isAr ? 'أقسام الحلويات' : 'Featured Collections'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('menu')} className="hover:text-[#DFB15B] transition-colors cursor-pointer">
                  {isAr ? 'قائمة الطلب أونلاين' : 'Order Online'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catering')} className="hover:text-[#DFB15B] transition-colors cursor-pointer">
                  {isAr ? 'بوفيهات الأعراس والضيافة' : 'Catering & Events'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('story')} className="hover:text-[#DFB15B] transition-colors cursor-pointer">
                  {isAr ? 'قصة الحرفية والشيفات' : 'Craftsmanship Story'}
                </button>
              </li>
              <li className="pt-2 border-t border-white/10">
                <button
                  onClick={onOpenAdmin}
                  className="text-[#DFB15B] hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 font-semibold"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>{isAr ? 'بوابة إدارة المحل (Admin)' : 'Owner / Admin Portal'}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Opening Hours & Direct Contact (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#DFB15B]">
              {isAr ? 'أوقات العمل واستقبال الضيوف' : 'Salon & Bakery Hours'}
            </h4>

            <div className="space-y-2 text-xs text-stone-200">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#DFB15B] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-white">
                    {isAr ? 'يومياً (طوال أيام الأسبوع):' : 'Daily (7 Days a Week):'}
                  </span>
                  <span>{isAr ? '09:00 صباحاً – 12:00 منتصف الليل' : '09:00 AM – 12:00 Midnight'}</span>
                </div>
              </div>

              <div className="flex items-start gap-2 pt-1 border-t border-white/10">
                <Clock className="w-4 h-4 text-[#DFB15B] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-white">
                    {isAr ? 'أوقات شهر رمضان المبارك:' : 'Holy Month of Ramadan:'}
                  </span>
                  <span>{isAr ? '04:00 عصراً – 03:30 فجراً' : '04:00 PM – 03:30 AM'}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 text-xs text-stone-200 space-y-1.5">
              <a href="https://api.whatsapp.com/send?phone=201069844724" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[#DFB15B] transition-colors">
                <Phone className="w-3.5 h-3.5 text-[#DFB15B]" />
                <span className="tabular-nums" dir="ltr">+20 106 984 4724 (هاتف & واتساب)</span>
              </a>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#DFB15B]" />
                <span>concierge@royal-patisserie.com</span>
              </div>
            </div>
          </div>

          {/* Locations & Google Maps (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#DFB15B]">
              {isAr ? 'فروعنا وصالونات الشاي' : 'Boutiques & Salons'}
            </h4>

            <div className="space-y-3">
              {locations.map((loc, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-xs">
                  <div className="flex items-center justify-between font-semibold text-white">
                    <span>{loc.city[language]}</span>
                    <a
                      href={loc.mapUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#DFB15B] hover:underline flex items-center gap-0.5 text-[10px]"
                    >
                      <MapPin className="w-3 h-3" />
                      <span>{isAr ? 'الخريطة' : 'Map'}</span>
                    </a>
                  </div>
                  <p className="text-stone-300 text-[11px] mt-0.5">{loc.address[language]}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Social */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-300">
          <p>
            © {new Date().getFullYear()} {isAr ? 'قصر الحلويات الملكي. جميع الحقوق محفوظة.' : 'Royal Pâtisserie & Gourmet Sweets. All rights reserved.'}
          </p>

          <div className="flex items-center gap-4 text-stone-200">
            <button
              onClick={onOpenAdmin}
              className="text-stone-300 hover:text-[#DFB15B] text-xs flex items-center gap-1 cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5 text-[#DFB15B]" />
              <span>{isAr ? 'دخول الإدارة' : 'Owner Portal'}</span>
            </button>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-[#DFB15B] transition-colors" aria-label="Instagram">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-[#DFB15B] transition-colors" aria-label="Facebook">
              <Facebook className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
