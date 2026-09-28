import React, { useState, useEffect, useRef } from 'react';
import { 
  ShoppingBag, Calendar, Globe, Menu, X, Type, ShieldCheck, 
  Sparkles, UtensilsCrossed, Crown, BookOpen, Star, Package,
  Bell, ChefHat
} from 'lucide-react';
import { Language, FontFamily, PageViewId } from '../types';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  currentFont: FontFamily;
  onFontChange: (font: FontFamily) => void;
  cartCount: number;
  onOpenCart: () => void;
  currentPage: PageViewId;
  onNavigate: (pageId: PageViewId) => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  currentFont,
  onFontChange,
  cartCount,
  onOpenCart,
  currentPage,
  onNavigate,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [fontMenuOpen, setFontMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollY = useRef(0);
  const isAr = language === 'ar';

  // Smart Auto-Hide on Scroll Down / Reveal on Scroll Up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Track if page is scrolled past top
      setIsScrolled(currentScrollY > 15);

      // Threshold to avoid micro-jitter
      if (Math.abs(currentScrollY - lastScrollY.current) < 6) {
        return;
      }

      if (currentScrollY > lastScrollY.current && currentScrollY > 60) {
        // Scrolling DOWN -> Hide Header
        setIsVisible(false);
        setMobileMenuOpen(false);
        setFontMenuOpen(false);
      } else {
        // Scrolling UP or at the Top -> Show Header
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fonts: { id: FontFamily; labelAr: string; labelEn: string; sample: string }[] = [
    { id: 'cairo', labelAr: 'خط كايرو الحديث (افتراضي)', labelEn: 'Cairo Modern (Default)', sample: 'أصالة وفخامة' },
    { id: 'alexandria', labelAr: 'خط الإسكندرية الهندسي الراقي', labelEn: 'Alexandria Elegant', sample: 'حلويات ملكية' },
    { id: 'almarai', labelAr: 'خط المراعي العصري الناعم', labelEn: 'Almarai Clean', sample: 'مذاق استثنائي' },
    { id: 'amiri', labelAr: 'خط الأميري التراثي الكلاسيكي', labelEn: 'Amiri Traditional', sample: 'تراث الأجداد' },
    { id: 'tajawal', labelAr: 'خط تجوال المتزن', labelEn: 'Tajawal Balanced', sample: 'قصر الحلويات' },
  ];

  const mainNavItems: { id: PageViewId; label: { ar: string; en: string }; icon: React.ComponentType<{ className?: string }>; badge?: string }[] = [
    { id: 'home', label: { ar: 'الرئيسية', en: 'Home' }, icon: Sparkles },
    { id: 'menu', label: { ar: 'قائمة الحلويات والتورت', en: 'Menu & Cakes' }, icon: UtensilsCrossed, badge: isAr ? 'كريمة لباني' : 'Cakes' },
    { id: 'catering', label: { ar: 'حاسبة الضيافة والأعراس', en: 'Catering & Events' }, icon: Crown },
    { id: 'reservation', label: { ar: 'حجز صالون VIP', en: 'Salon Booking' }, icon: Calendar },
    { id: 'orders', label: { ar: 'متابعة طلباتي', en: 'Track Orders' }, icon: Package },
    { id: 'story', label: { ar: 'قصتنا وحرفيتنا', en: 'Our Story' }, icon: BookOpen },
    { id: 'reviews', label: { ar: 'آراء الذواقة', en: 'Reviews' }, icon: Star },
  ];

  const handleNavClick = (id: PageViewId) => {
    onNavigate(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/90 transition-transform duration-300 ease-in-out ${
          isVisible ? 'translate-y-0' : '-translate-y-full shadow-none'
        } ${isScrolled ? 'shadow-[0_4px_20px_rgba(0,0,0,0.06)]' : 'shadow-xs'}`}
      >
        {/* Main 1-Row Elegant Navigation Bar */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between">
          {/* Zone 1: Brand Logo & Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNavClick('home')}
              className="text-start group cursor-pointer active:scale-95 transition-transform"
            >
              <div className="flex items-baseline gap-2">
                <span className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-[#8B1528] font-display">
                  {isAr ? 'قصر الحلويات الملكي' : 'Royal Pâtisserie'}
                </span>
                <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#C5A059] font-bold hidden sm:inline">
                  {isAr ? 'شرقي & غربي' : 'Haute Sweets'}
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-stone-500 font-normal -mt-0.5 hidden xs:block">
                {isAr ? 'تورت كريمة لباني وشانتيه وحلويات بالسمن البلدي' : 'Artisanal Cream Cakes & Heritage Desserts'}
              </p>
            </button>
          </div>

          {/* Zone 2: Navigation Links for Separate Page Views */}
          <nav className="hidden lg:flex items-center gap-2.5 xl:gap-4 text-xs xl:text-sm font-medium">
            {mainNavItems.map((item) => {
              const isActive = currentPage === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`transition-all duration-150 relative py-1.5 px-2 rounded-xl cursor-pointer whitespace-nowrap group flex items-center gap-1.5 active:scale-90 ${
                    isActive
                      ? 'text-[#8B1528] font-bold bg-rose-50/80 shadow-2xs'
                      : 'text-stone-700 hover:text-[#8B1528] hover:bg-stone-50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-[#8B1528]' : 'text-stone-400 group-hover:text-[#8B1528]'
                  }`} />
                  <span>{item.label[language]}</span>
                  {item.badge && (
                    <span className="text-[9px] bg-amber-100 text-[#8B1528] font-bold px-1.5 py-0.2 rounded-full border border-amber-300">
                      {item.badge}
                    </span>
                  )}
                  {/* Active Indicator Line */}
                  {isActive && (
                    <span className="absolute bottom-0 inset-x-2 h-0.5 bg-[#8B1528] rounded-full animate-in fade-in" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Right Side Actions (Admin, Font, Lang, Cart, Mobile Toggle) */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Shop Owner Portal Button */}
            <button
              onClick={() => handleNavClick('admin')}
              className={`hidden md:inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-xl transition-all border cursor-pointer active:scale-95 ${
                currentPage === 'admin'
                  ? 'bg-[#8B1528] text-white border-[#8B1528] shadow-sm'
                  : 'text-stone-700 hover:text-[#8B1528] hover:bg-stone-50 border-stone-200'
              }`}
              title={isAr ? 'لوحة تحكم صاحب المحل' : 'Shop Management'}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>{isAr ? 'لوحة الإدارة' : 'Manager'}</span>
            </button>

            {/* Font Family Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setFontMenuOpen(!fontMenuOpen)}
                className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 text-xs font-semibold text-stone-700 hover:text-[#8B1528] hover:bg-stone-50 rounded-lg transition-all border border-stone-200 cursor-pointer active:scale-95"
                title={isAr ? 'تغيير نوع الخط' : 'Change Font'}
              >
                <Type className="w-3.5 h-3.5 text-[#8B1528]" />
                <span className="hidden xl:inline">
                  {fonts.find((f) => f.id === currentFont)?.[isAr ? 'labelAr' : 'labelEn'].split(' ')[1] || (isAr ? 'الخط' : 'Font')}
                </span>
              </button>

              {/* Font Options Popover */}
              {fontMenuOpen && (
                <div
                  className={`absolute top-full mt-2 ${
                    isAr ? 'start-0' : 'end-0'
                  } w-60 bg-white rounded-xl shadow-xl border border-stone-200 py-2 z-50 animate-in fade-in duration-150`}
                >
                  <div className="px-3 py-1.5 border-b border-stone-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                      {isAr ? 'اختر خط الموقع' : 'Select Typography'}
                    </span>
                    <span className="text-[10px] text-[#8B1528] font-medium">5 خطوط</span>
                  </div>
                  <div className="py-1">
                    {fonts.map((f) => {
                      const isSelected = currentFont === f.id;
                      const fontClass =
                        f.id === 'cairo'
                          ? 'font-cairo'
                          : f.id === 'alexandria'
                          ? 'font-alexandria'
                          : f.id === 'almarai'
                          ? 'font-almarai'
                          : f.id === 'amiri'
                          ? 'font-amiri'
                          : '';
                      return (
                        <button
                          key={f.id}
                          onClick={() => {
                            onFontChange(f.id);
                            setFontMenuOpen(false);
                          }}
                          className={`w-full text-start px-3 py-2 text-xs transition-colors flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-[#8B1528]/10 text-[#8B1528] font-bold'
                              : 'text-stone-700 hover:bg-stone-50'
                          }`}
                        >
                          <div className="flex flex-col">
                            <span className={fontClass}>{isAr ? f.labelAr : f.labelEn}</span>
                            <span className={`text-[11px] text-stone-400 ${fontClass}`}>{f.sample}</span>
                          </div>
                          {isSelected && <span className="text-[#8B1528] font-bold">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Language Switcher */}
            <button
              onClick={() => onLanguageChange(isAr ? 'en' : 'ar')}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 text-xs font-medium text-stone-700 hover:text-[#8B1528] hover:bg-stone-50 rounded-lg transition-all border border-stone-200 cursor-pointer active:scale-95"
              title={isAr ? 'Switch to English' : 'التحويل إلى العربية'}
            >
              <Globe className="w-3.5 h-3.5 text-[#C5A059]" />
              <span className="font-semibold">{isAr ? 'En' : 'عربي'}</span>
            </button>

            {/* Cart Drawer Trigger */}
            <button
              onClick={onOpenCart}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#8B1528] hover:bg-[#700C1C] active:scale-90 rounded-xl shadow-sm transition-all cursor-pointer whitespace-nowrap"
              aria-label={isAr ? 'سلة الطلبات' : 'Shopping Cart'}
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 text-[#DFB15B]" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#DFB15B] text-[#7A0C1E] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden xs:inline">{isAr ? 'السلة' : 'Bag'}</span>
            </button>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-stone-700 hover:text-[#8B1528] hover:bg-stone-100 rounded-lg active:scale-90 transition-transform"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-2 duration-200">
            <div className="space-y-1">
              {mainNavItems.map((item) => {
                const isActive = currentPage === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full text-start px-3 py-2.5 text-sm font-semibold rounded-xl transition-all flex items-center justify-between active:scale-95 ${
                      isActive
                        ? 'bg-[#8B1528] text-white shadow-sm'
                        : 'text-stone-800 hover:bg-stone-50 hover:text-[#8B1528]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[#DFB15B]' : 'text-stone-500'}`} />
                      <span>{item.label[language]}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive ? 'bg-[#DFB15B] text-stone-950' : 'bg-rose-100 text-[#8B1528]'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-stone-100 flex flex-col gap-2">
              <button
                onClick={() => handleNavClick('admin')}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-white bg-stone-900 rounded-xl cursor-pointer active:scale-95 transition-transform"
              >
                <ShieldCheck className="w-4 h-4 text-[#DFB15B]" />
                <span>{isAr ? 'لوحة تحكم صاحب المحل' : 'Shop Management Portal'}</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Spacer to prevent content jump under fixed header */}
      <div className="h-18 sm:h-20" />
    </>
  );
};
