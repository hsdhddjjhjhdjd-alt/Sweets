import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { FeaturedCategories } from './components/FeaturedCategories';
import { DessertsShowcase } from './components/DessertsShowcase';
import { CateringCalculator } from './components/CateringCalculator';
import { CraftsmanshipStory } from './components/CraftsmanshipStory';
import { CustomerReviews } from './components/CustomerReviews';
import { Footer } from './components/Footer';
import { QuickViewModal } from './components/QuickViewModal';
import { TableReservationModal } from './components/TableReservationModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { Language, DessertCategory, DessertItem, CartItem, PortionOption, FontFamily, PageViewId } from './types';
import { 
  ArrowLeft, ArrowRight, Sparkles, Cake, UtensilsCrossed, 
  Crown, Calendar, Package, BookOpen, Star, ShieldCheck, ShoppingBag 
} from 'lucide-react';

export default function App() {
  const [language, setLanguage] = useState<Language>('ar');
  const [fontFamily, setFontFamily] = useState<FontFamily>('cairo');
  const [currentPage, setCurrentPage] = useState<PageViewId>('home');
  const [selectedCategory, setSelectedCategory] = useState<DessertCategory>('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Modals & Drawers
  const [quickViewItem, setQuickViewItem] = useState<DessertItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderSummary, setOrderSummary] = useState<any>(null);

  // Sync dir and lang on document root
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const handleNavigate = (page: PageViewId) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategoryFromHome = (cat: DessertCategory) => {
    setSelectedCategory(cat);
    setCurrentPage('menu');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add default portion to cart directly from grid
  const handleQuickAddToCart = (item: DessertItem) => {
    const defaultPortion = item.portionOptions[0];
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (ci) => ci.item.id === item.id && ci.selectedPortion.label.en === defaultPortion.label.en
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      }
      return [
        ...prev,
        {
          item,
          quantity: 1,
          selectedPortion: defaultPortion,
          sweetnessPreference: language === 'ar' ? 'معتدل متوازن' : 'Balanced Classic',
        },
      ];
    });
  };

  // Add customized item from quick view modal
  const handleCustomAddToCart = (
    item: DessertItem,
    portion: PortionOption,
    quantity: number,
    sweetness: string,
    specialNote: string
  ) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (ci) =>
          ci.item.id === item.id &&
          ci.selectedPortion.label.en === portion.label.en &&
          ci.sweetnessPreference === sweetness &&
          ci.specialNote === specialNote
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [
        ...prev,
        {
          item,
          quantity,
          selectedPortion: portion,
          sweetnessPreference: sweetness,
          specialNote,
        },
      ];
    });
  };

  const handleUpdateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(index);
      return;
    }
    setCart((prev) => {
      const updated = [...prev];
      updated[index].quantity = newQuantity;
      return updated;
    });
  };

  const handleRemoveItem = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const handleProceedToCheckout = (summary: any) => {
    setOrderSummary(summary);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderComplete = () => {
    setCart([]);
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const getFontClass = () => {
    switch (fontFamily) {
      case 'cairo':
        return 'font-cairo';
      case 'alexandria':
        return 'font-alexandria';
      case 'almarai':
        return 'font-almarai';
      case 'amiri':
        return 'font-amiri';
      case 'tajawal':
      default:
        return '';
    }
  };

  const isAr = language === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  return (
    <div className={`min-h-screen flex flex-col bg-[#FDFCF7] text-stone-900 selection:bg-[#8B1528] selection:text-white pb-16 lg:pb-0 ${getFontClass()}`}>
      {/* Clean Luxury Header (Auto-Hides on Scroll Down) */}
      <Header
        language={language}
        onLanguageChange={setLanguage}
        currentFont={fontFamily}
        onFontChange={setFontFamily}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        currentPage={currentPage}
        onNavigate={handleNavigate}
      />

      {/* Dynamic View Rendering: Separate Pages */}
      <main className="flex-1">
        {/* VIEW 1: HOME PAGE */}
        {currentPage === 'home' && (
          <div className="animate-in fade-in duration-300">
            <HeroSection
              language={language}
              onExploreMenu={() => {
                setSelectedCategory('all');
                setCurrentPage('menu');
              }}
              onOrderNow={() => {
                setSelectedCategory('all');
                setCurrentPage('menu');
              }}
              onOpenReservation={() => setCurrentPage('reservation')}
            />

            {/* Quick Cake Customization Promo Banner */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 relative z-20 mb-8">
              <div className="bg-gradient-to-r from-[#7A0C1E] via-[#8B1528] to-[#5C0916] rounded-2xl p-4 sm:p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 border border-[#DFB15B]/30">
                <div className="flex items-center gap-3.5 text-start">
                  <div className="w-12 h-12 rounded-xl bg-[#DFB15B]/20 border border-[#DFB15B]/40 flex items-center justify-center text-[#DFB15B] shrink-0">
                    <Cake className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold font-display text-white">
                      {isAr ? 'تورت كريمة لباني وشوكولاتة مقاسات كبرى (60×40) مع خدمة كتابة الإهداء' : 'Fresh Dairy Cream & Custom Celebration Cakes'}
                    </h3>
                    <p className="text-xs text-stone-200 mt-0.5">
                      {isAr
                        ? 'اختر النكهات والمقاس المفضل مع إمكانية إرفاق صورة الديزاين وتوصيل مبرد لباب البيت.'
                        : 'Custom dimensions, fresh dairy cream, personalized writing, and refrigerated delivery.'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedCategory('chantilly_cakes');
                    setCurrentPage('menu');
                  }}
                  className="px-6 py-2.5 bg-[#DFB15B] hover:bg-[#c99f4d] text-stone-950 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 active:scale-95"
                >
                  <span>{isAr ? 'تصفح وتفصيل التورت الآن' : 'Browse & Customise Cakes'}</span>
                  <ArrowIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            <FeaturedCategories
              language={language}
              onSelectCategory={handleSelectCategoryFromHome}
            />
          </div>
        )}

        {/* VIEW 2: DESSERTS & SPECIALTY CAKES (WITH EMBEDDED CUSTOMIZER) */}
        {currentPage === 'menu' && (
          <div className="animate-in fade-in duration-300">
            <DessertsShowcase
              language={language}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              onQuickView={(item) => setQuickViewItem(item)}
              onAddToCart={handleQuickAddToCart}
            />
          </div>
        )}

        {/* VIEW 3: CATERING & BANQUET CALCULATOR */}
        {currentPage === 'catering' && (
          <div className="animate-in fade-in duration-300">
            <CateringCalculator language={language} />
          </div>
        )}

        {/* VIEW 4: VIP HIGH TEA SALON RESERVATION */}
        {currentPage === 'reservation' && (
          <div className="animate-in fade-in duration-300 py-6">
            <TableReservationModal
              isOpen={true}
              language={language}
              onClose={() => setCurrentPage('home')}
            />
          </div>
        )}

        {/* VIEW 5: LIVE ORDER TRACKING */}
        {currentPage === 'orders' && (
          <div className="animate-in fade-in duration-300 py-6">
            <OrderTrackingModal
              isOpen={true}
              language={language}
              onClose={() => setCurrentPage('home')}
            />
          </div>
        )}

        {/* VIEW 6: ROYAL STORY & CRAFTSMANSHIP */}
        {currentPage === 'story' && (
          <div className="animate-in fade-in duration-300">
            <CraftsmanshipStory language={language} />
          </div>
        )}

        {/* VIEW 7: CUSTOMER REVIEWS */}
        {currentPage === 'reviews' && (
          <div className="animate-in fade-in duration-300">
            <CustomerReviews language={language} />
          </div>
        )}

        {/* VIEW 8: SHOP OWNER & ADMIN PORTAL */}
        {currentPage === 'admin' && (
          <div className="animate-in fade-in duration-300 py-6">
            <AdminDashboardModal
              isOpen={true}
              language={language}
              onClose={() => setCurrentPage('home')}
            />
          </div>
        )}
      </main>

      {/* Elegant Mobile Bottom Navigation Dock */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-stone-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-3 py-1.5 transition-all">
        <div className="flex items-center justify-around">
          {/* Home Tab */}
          <button
            onClick={() => handleNavigate('home')}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all duration-200 cursor-pointer active:scale-85 group ${
              currentPage === 'home'
                ? 'text-[#8B1528] font-bold'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <div className={`p-1 rounded-lg transition-transform duration-200 ${
              currentPage === 'home'
                ? 'bg-rose-50 text-[#8B1528] scale-110 shadow-2xs'
                : 'group-hover:scale-105'
            }`}>
              <Sparkles className="w-4.5 h-4.5" />
            </div>
            <span className="text-[10px] tracking-tight">{isAr ? 'الرئيسية' : 'Home'}</span>
            {currentPage === 'home' && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#8B1528] -mt-0.5 animate-pulse" />
            )}
          </button>

          {/* Menu Tab */}
          <button
            onClick={() => {
              setSelectedCategory('all');
              handleNavigate('menu');
            }}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all duration-200 cursor-pointer active:scale-85 group ${
              currentPage === 'menu'
                ? 'text-[#8B1528] font-bold'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <div className={`p-1 rounded-lg transition-transform duration-200 ${
              currentPage === 'menu'
                ? 'bg-rose-50 text-[#8B1528] scale-110 shadow-2xs'
                : 'group-hover:scale-105'
            }`}>
              <UtensilsCrossed className="w-4.5 h-4.5" />
            </div>
            <span className="text-[10px] tracking-tight">{isAr ? 'القائمة والتورت' : 'Menu'}</span>
            {currentPage === 'menu' && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#8B1528] -mt-0.5 animate-pulse" />
            )}
          </button>

          {/* Catering Tab */}
          <button
            onClick={() => handleNavigate('catering')}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all duration-200 cursor-pointer active:scale-85 group ${
              currentPage === 'catering'
                ? 'text-[#8B1528] font-bold'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <div className={`p-1 rounded-lg transition-transform duration-200 ${
              currentPage === 'catering'
                ? 'bg-rose-50 text-[#8B1528] scale-110 shadow-2xs'
                : 'group-hover:scale-105'
            }`}>
              <Crown className="w-4.5 h-4.5" />
            </div>
            <span className="text-[10px] tracking-tight">{isAr ? 'الضيافة' : 'Catering'}</span>
            {currentPage === 'catering' && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#8B1528] -mt-0.5 animate-pulse" />
            )}
          </button>

          {/* Orders Tracking Tab */}
          <button
            onClick={() => handleNavigate('orders')}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all duration-200 cursor-pointer active:scale-85 group ${
              currentPage === 'orders'
                ? 'text-[#8B1528] font-bold'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <div className={`p-1 rounded-lg transition-transform duration-200 ${
              currentPage === 'orders'
                ? 'bg-rose-50 text-[#8B1528] scale-110 shadow-2xs'
                : 'group-hover:scale-105'
            }`}>
              <Package className="w-4.5 h-4.5" />
            </div>
            <span className="text-[10px] tracking-tight">{isAr ? 'طلباتي' : 'Orders'}</span>
            {currentPage === 'orders' && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#8B1528] -mt-0.5 animate-pulse" />
            )}
          </button>

          {/* Cart Bag Tab */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-stone-600 hover:text-[#8B1528] transition-all duration-200 cursor-pointer active:scale-85 group"
          >
            <div className="relative p-1 rounded-lg group-hover:bg-rose-50 group-hover:scale-105 transition-transform duration-200">
              <ShoppingBag className="w-4.5 h-4.5 text-stone-700 group-hover:text-[#8B1528]" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#8B1528] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {totalCartCount}
                </span>
              )}
            </div>
            <span className="text-[10px] tracking-tight">{isAr ? 'السلة' : 'Bag'}</span>
          </button>
        </div>
      </nav>

      {/* Footer */}
      <Footer
        language={language}
        onNavigate={(pageId) => {
          if (['home', 'menu', 'catering', 'story', 'reviews'].includes(pageId)) {
            setCurrentPage(pageId as PageViewId);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            setCurrentPage('home');
          }
        }}
        onOpenAdmin={() => setCurrentPage('admin')}
      />

      {/* Quick View & Customization Modal for single dessert portion */}
      {quickViewItem && (
        <QuickViewModal
          item={quickViewItem}
          language={language}
          onClose={() => setQuickViewItem(null)}
          onAddToCart={handleCustomAddToCart}
        />
      )}

      {/* Slide-out Cart Drawer */}
      {isCartOpen && (
        <CartDrawer
          isOpen={isCartOpen}
          language={language}
          cart={cart}
          onClose={() => setIsCartOpen(false)}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onProceedToCheckout={handleProceedToCheckout}
        />
      )}

      {/* Checkout Modal */}
      {isCheckoutOpen && orderSummary && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          language={language}
          cart={cart}
          orderSummary={orderSummary}
          onClose={() => setIsCheckoutOpen(false)}
          onOrderComplete={handleOrderComplete}
        />
      )}
    </div>
  );
}
