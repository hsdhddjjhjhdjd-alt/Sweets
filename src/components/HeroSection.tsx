import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Sparkles, ChefHat, Clock } from 'lucide-react';
import { Language } from '../types';

interface HeroSectionProps {
  language: Language;
  onExploreMenu: () => void;
  onOrderNow: () => void;
  onOpenReservation: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  language,
  onExploreMenu,
  onOrderNow,
  onOpenReservation,
}) => {
  const isAr = language === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;
  const [activeSide, setActiveSide] = useState<'both' | 'oriental' | 'western'>('both');
  const [ambianceMode, setAmbianceMode] = useState<'luminous' | 'twilight'>('luminous');

  return (
    <section id="hero" className="relative overflow-hidden bg-[#FDFCF7] border-b border-stone-200 min-h-[82vh] flex flex-col justify-center">
      {/* 1. Cinematic Animated Panoramic Background Image with Ken Burns motion */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        <img
          src="/src/assets/images/hero_luxury_salon_bg_1790426335840.jpg"
          alt="Royal Patisserie Salon Ambiance"
          className="w-full h-full object-cover object-center animate-kenburns"
        />

        {/* Dynamic Opacity Scrim depending on ambiance mode */}
        <div
          className={`absolute inset-0 transition-colors duration-1000 ${
            ambianceMode === 'luminous'
              ? 'bg-gradient-to-b from-[#FDFCF7]/88 via-[#FDFCF7]/92 to-[#FDFCF7]'
              : 'bg-gradient-to-b from-stone-950/80 via-stone-900/85 to-[#7A0C1E]/90'
          }`}
        />

        {/* Ambient Warm Golden Vignette & Arabesque Texture */}
        <div className="absolute inset-0 bg-radial from-transparent via-[#C5A059]/5 to-[#8B1528]/15 mix-blend-multiply opacity-60"></div>
        <div className="absolute inset-0 bg-arabesque-subtle opacity-35"></div>

        {/* Floating Glowing Golden Orbs & Bokeh Particles */}
        <div className="absolute -top-10 start-1/4 w-72 h-72 rounded-full bg-[#DFB15B]/20 blur-3xl animate-float-1 pointer-events-none"></div>
        <div className="absolute top-1/3 end-10 w-96 h-96 rounded-full bg-[#8B1528]/15 blur-3xl animate-float-2 pointer-events-none"></div>
        <div className="absolute bottom-10 start-10 w-80 h-80 rounded-full bg-[#C5A059]/15 blur-3xl animate-float-3 pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] rounded-full bg-white/30 blur-2xl animate-pulse-subtle pointer-events-none"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        {/* Top Floating Ambiance Control Pill */}
        <div className="flex justify-center mb-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 backdrop-blur-md border border-stone-200/80 text-[11px] font-medium text-stone-600 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>{isAr ? 'صالون الشاي والحلويات مفتوح الآن' : 'Royal Salon & Atelier is Open'}</span>
            <span className="text-stone-300">|</span>
            <button
              onClick={() => setAmbianceMode(ambianceMode === 'luminous' ? 'twilight' : 'luminous')}
              className="text-[#8B1528] font-semibold hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>
                {ambianceMode === 'luminous'
                  ? (isAr ? '✦ نمط السهرة الملكية' : '✦ Twilight Mode')
                  : (isAr ? '✦ النمط الصباحي المضيء' : '✦ Luminous Mode')}
              </span>
            </button>
          </div>
        </div>

        {/* Top Editorial Kicker & Main Headline */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-semibold tracking-wider mb-4 backdrop-blur-md transition-colors ${
              ambianceMode === 'luminous'
                ? 'bg-[#8B1528]/5 border-[#8B1528]/15 text-[#8B1528]'
                : 'bg-white/10 border-white/25 text-[#DFB15B]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059] animate-spin" style={{ animationDuration: '8s' }} />
            <span>{isAr ? 'رحلة في عالم المذاق الفاخر والضيافة الراقية' : 'Haute Pâtisserie & Eastern Confectionery'}</span>
          </div>

          <h1
            className={`text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.18] font-display text-balance transition-colors ${
              ambianceMode === 'luminous' ? 'text-stone-900' : 'text-white'
            }`}
          >
            {isAr ? (
              <>
                تناغم{' '}
                <span className="text-[#8B1528] underline decoration-[#C5A059]/50 underline-offset-8 drop-shadow-xs">
                  أصالة الشرق
                </span>{' '}
                وفخامة الغرب
              </>
            ) : (
              <>
                The Perfect Harmony of{' '}
                <span className="text-[#8B1528] underline decoration-[#C5A059]/50 underline-offset-8 drop-shadow-xs">
                  Eastern Tradition
                </span>{' '}
                & Western Elegance
              </>
            )}
          </h1>

          <p
            className={`mt-4 text-base sm:text-lg font-normal max-w-2xl mx-auto leading-relaxed text-balance transition-colors ${
              ambianceMode === 'luminous' ? 'text-stone-700' : 'text-stone-200'
            }`}
          >
            {isAr
              ? 'حلويات فاخرة تُصنع يدوياً يومياً بأجود المكونات الطبيعية والزبدة الفرنسية النقية والفستق الحلبي الأخضر لنصنع لك لحظات استثنائية.'
              : 'Handcrafted gourmet sweets baked fresh daily with premium ingredients, bringing together centuries of Levantine heritage and French pastry perfection.'}
          </p>

          {/* Call-to-Action Buttons */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {/* Primary Explore Menu Button */}
            <button
              onClick={onExploreMenu}
              className="px-6 py-3.5 text-sm font-semibold text-white bg-[#8B1528] hover:bg-[#700C1C] rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2 group cursor-pointer active:scale-95"
            >
              <span>{isAr ? 'استكشف القائمة' : 'Explore Menu'}</span>
              <ArrowIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            {/* Secondary Order Now Button */}
            <button
              onClick={onOrderNow}
              className={`px-6 py-3.5 text-sm font-semibold rounded-lg transition-all shadow-xs cursor-pointer active:scale-95 ${
                ambianceMode === 'luminous'
                  ? 'text-[#8B1528] hover:text-white bg-white/90 hover:bg-[#8B1528] border-2 border-[#8B1528]'
                  : 'text-white hover:text-[#7A0C1E] bg-[#DFB15B] hover:bg-white border-2 border-[#DFB15B]'
              }`}
            >
              <span>{isAr ? 'اطلب أونلاين الآن' : 'Order Now'}</span>
            </button>

            {/* Salon Booking */}
            <button
              onClick={onOpenReservation}
              className={`px-5 py-3.5 text-sm font-medium rounded-lg transition-colors cursor-pointer backdrop-blur-sm ${
                ambianceMode === 'luminous'
                  ? 'text-stone-700 hover:text-[#8B1528] hover:bg-stone-100/80 bg-white/70 border border-stone-200/80'
                  : 'text-stone-100 hover:text-white hover:bg-white/20 bg-white/10 border border-white/20'
              }`}
            >
              <span>{isAr ? 'حجز طاولة بالصالون' : 'Reserve Salon Table'}</span>
            </button>
          </div>
        </div>

        {/* Dual Split-Screen Showcase Cards */}
        <div className="relative mt-8 lg:mt-12">
          {/* Interactive Mode Selector: East & West Selector */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex p-1 bg-stone-100/90 rounded-lg border border-stone-200 text-xs font-semibold">
              <button
                onClick={() => setActiveSide('both')}
                className={`px-3.5 py-1.5 rounded-md transition-all ${
                  activeSide === 'both' ? 'bg-[#8B1528] text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {isAr ? 'الشرق & الغرب معاً' : 'Harmonious Duet'}
              </button>
              <button
                onClick={() => setActiveSide('oriental')}
                className={`px-3.5 py-1.5 rounded-md transition-all ${
                  activeSide === 'oriental' ? 'bg-[#8B1528] text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {isAr ? 'حلويات شرقية فقط' : 'Oriental Showcase'}
              </button>
              <button
                onClick={() => setActiveSide('western')}
                className={`px-3.5 py-1.5 rounded-md transition-all ${
                  activeSide === 'western' ? 'bg-[#8B1528] text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {isAr ? 'باتيسري غربي فقط' : 'Western Patisserie'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
            {/* Left Showcase: Oriental Kunafa & Aleppo Baklava */}
            {(activeSide === 'both' || activeSide === 'oriental') && (
              <div
                className={`group relative rounded-2xl overflow-hidden border border-[#8B1528]/20 bg-stone-900 text-white shadow-xl transition-all duration-300 hover:shadow-2xl ${
                  activeSide === 'oriental' ? 'lg:col-span-2 max-w-4xl mx-auto w-full' : ''
                }`}
              >
                <div className="aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden relative">
                  <img
                    src="/src/assets/images/hero_kunafa_baklava_1790374993908.jpg"
                    alt={isAr ? 'كنافة نابلسية ساخنة وبقلاوة بالفستق' : 'Hot crispy Kunafa with syrup dripping and pistachio baklava'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="eager"
                  />
                  {/* Contrast Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-transparent"></div>

                  {/* Corner Badge */}
                  <div className="absolute top-4 start-4 bg-[#7A0C1E]/90 backdrop-blur-md text-[#DFB15B] text-xs font-semibold px-3 py-1.5 rounded-md border border-[#DFB15B]/30">
                    {isAr ? 'الأصالة الشرقية · سمن بلدي وفستق حلبي' : 'Eastern Heritage · Aleppo Pistachio'}
                  </div>
                </div>

                <div className="p-6 sm:p-8 bg-stone-950/95 border-t border-stone-800">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl sm:text-2xl font-bold font-display text-white group-hover:text-[#DFB15B] transition-colors">
                      {isAr ? 'الكنافة النابلسية & البقلاوة الملكية' : 'Royal Nabulsi Knafeh & Crisp Baklava'}
                    </h3>
                    <span className="text-[#DFB15B] font-semibold text-sm">
                      {isAr ? 'من 18 $' : 'From $18'}
                    </span>
                  </div>

                  <p className="text-sm text-stone-300 leading-relaxed mb-4">
                    {isAr
                      ? 'خيوط الكنافة المحمصة بالسمن البقري النقي مع جبن عكاوي ذائب وقطر ماء الورد العطري، إلى جانب طبقات البقلاوة المورقة بالفستق الحلبي المقرمش.'
                      : 'Toasted golden kataifi soaked in fragrant rose nectar over warm gooey Akawi cheese, accompanied by fragile filo layers laden with crushed emerald pistachios.'}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-stone-800/80 text-xs text-stone-400">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#DFB15B]" />
                      <span>{isAr ? 'تُخبز طازجة كل 30 دقيقة' : 'Baked fresh every 30 mins'}</span>
                    </div>
                    <button
                      onClick={onExploreMenu}
                      className="text-[#DFB15B] hover:text-white font-medium flex items-center gap-1 group-hover:underline cursor-pointer"
                    >
                      <span>{isAr ? 'تذوق التشكيلة الشرقية' : 'View Oriental Menu'}</span>
                      <ArrowIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Right Showcase: French Mille-Feuille & Red Velvet */}
            {(activeSide === 'both' || activeSide === 'western') && (
              <div
                className={`group relative rounded-2xl overflow-hidden border border-stone-200 bg-white shadow-xl transition-all duration-300 hover:shadow-2xl ${
                  activeSide === 'western' ? 'lg:col-span-2 max-w-4xl mx-auto w-full' : ''
                }`}
              >
                <div className="aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden relative">
                  <img
                    src="/src/assets/images/hero_french_pastry_1790375005617.jpg"
                    alt={isAr ? 'ميل فوي فرنسي بالتوت وكيكة الرد فيلفت' : 'French berry mille-feuille and red velvet cake'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="eager"
                  />
                  {/* Contrast Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/30 to-transparent"></div>

                  {/* Corner Badge */}
                  <div className="absolute top-4 start-4 bg-white/95 backdrop-blur-md text-[#8B1528] text-xs font-semibold px-3 py-1.5 rounded-md border border-stone-200 shadow-xs">
                    {isAr ? 'الفخامة الباريسية · زبدة فرنسية AOP' : 'Parisian Haute Pâtisserie · AOP Butter'}
                  </div>
                </div>

                <div className="p-6 sm:p-8 bg-white border-t border-stone-100">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl sm:text-2xl font-bold font-display text-stone-900 group-hover:text-[#8B1528] transition-colors">
                      {isAr ? 'الميل فوي الفرنسي & الرد فيلفت المخملية' : 'Parisian Mille-Feuille & Red Velvet'}
                    </h3>
                    <span className="text-[#8B1528] font-semibold text-sm">
                      {isAr ? 'من 16 $' : 'From $16'}
                    </span>
                  </div>

                  <p className="text-sm text-stone-600 leading-relaxed mb-4">
                    {isAr
                      ? 'رقائق البف باستري المكرملة الهشة مع كريمة الفانيليا التاهيتية والتوت الأحمر البري، وكيكات الرد فيلفت الغنية بجبن الماسكاربوني المخملي.'
                      : 'Caramelized delicate puff pastry pastry layered with rich Tahitian vanilla mousseline and fresh forest raspberries, complemented by velvety artisanal gateaux.'}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs text-stone-500">
                    <div className="flex items-center gap-1.5">
                      <ChefHat className="w-3.5 h-3.5 text-[#8B1528]" />
                      <span>{isAr ? 'وصفات شيف معتمد من لو كوردون بلو' : 'Crafted by Le Cordon Bleu Master'}</span>
                    </div>
                    <button
                      onClick={onExploreMenu}
                      className="text-[#8B1528] hover:text-[#700C1C] font-semibold flex items-center gap-1 group-hover:underline cursor-pointer"
                    >
                      <span>{isAr ? 'تذوق التشكيلة الغربية' : 'View Western Menu'}</span>
                      <ArrowIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Trust Markers Bar */}
        <div className="mt-12 pt-8 border-t border-stone-200/80 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-3">
            <p className="text-2xl sm:text-3xl font-bold text-[#8B1528] font-display tabular-nums">100%</p>
            <p className="text-xs text-stone-600 mt-1 font-medium">
              {isAr ? 'مكونات طبيعية وزبدة نقية' : 'Pure Butter & Natural Flavors'}
            </p>
          </div>
          <div className="p-3">
            <p className="text-2xl sm:text-3xl font-bold text-[#8B1528] font-display tabular-nums">35+</p>
            <p className="text-xs text-stone-600 mt-1 font-medium">
              {isAr ? 'عاماً من التميز والريادة' : 'Years of Culinary Heritage'}
            </p>
          </div>
          <div className="p-3">
            <p className="text-2xl sm:text-3xl font-bold text-[#8B1528] font-display tabular-nums">4.95 ★</p>
            <p className="text-xs text-stone-600 mt-1 font-medium">
              {isAr ? 'تقييم أكثر من 2,500 ضيف' : 'Over 2,500 5-Star Reviews'}
            </p>
          </div>
          <div className="p-3">
            <p className="text-2xl sm:text-3xl font-bold text-[#8B1528] font-display tabular-nums">2</p>
            <p className="text-xs text-stone-600 mt-1 font-medium">
              {isAr ? 'أتيليه للحرفية (شرقي وغربي)' : 'Specialized Craft Ateliers'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
