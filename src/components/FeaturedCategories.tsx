import React from 'react';
import { ArrowRight, ArrowLeft, Sparkles, Gift, Flame, Cake } from 'lucide-react';
import { Language, DessertCategory } from '../types';

interface FeaturedCategoriesProps {
  language: Language;
  onSelectCategory: (category: DessertCategory) => void;
}

export const FeaturedCategories: React.FC<FeaturedCategoriesProps> = ({
  language,
  onSelectCategory,
}) => {
  const isAr = language === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  return (
    <section id="categories" className="py-16 sm:py-20 bg-stone-50/60 border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8B1528] uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>{isAr ? 'عالم الحلويات الفاخرة' : 'Signature Masterpieces'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold font-display text-stone-900 tracking-tight">
            {isAr ? 'أقسامنا المميزة والمختارة بعناية' : 'Featured Epicurean Categories'}
          </h2>
          <p className="mt-3 text-stone-600 text-sm sm:text-base">
            {isAr
              ? 'رحلة مذاق تأخذك بين عبق التراث الشامي العريق ورقي الباتيسري الفرنسي المبتكر'
              : 'Immerse your senses in centuries of authentic Middle Eastern baking and refined European confectionery'}
          </p>
        </div>

        {/* 3 Prominent Featured Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Card 1: Oriental Sweets (Deep Red Borders & Arabesque motif) */}
          <div
            onClick={() => onSelectCategory('oriental')}
            className="group relative rounded-2xl overflow-hidden bg-white border-2 border-[#8B1528] shadow-md hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
          >
            {/* Image Banner */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
              <img
                src="/src/assets/images/oriental_collection_1790375016344.jpg"
                alt={isAr ? 'تشكيلة الحلويات الشرقية الملكية' : 'Oriental sweets collection'}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#7A0C1E]/80 via-transparent to-transparent"></div>
              
              <div className="absolute bottom-3 start-4 flex items-center gap-2">
                <span className="p-1.5 bg-[#DFB15B] text-[#7A0C1E] rounded-md shadow-xs">
                  <Flame className="w-4 h-4" />
                </span>
                <span className="text-xs font-bold text-white tracking-wide uppercase">
                  {isAr ? 'تراث وأصالة' : 'Eastern Heritage'}
                </span>
              </div>
            </div>

            {/* Content with deep ruby header */}
            <div className="p-6 bg-arabesque-subtle flex-1 flex flex-col justify-between border-t border-[#8B1528]/20">
              <div>
                <h3 className="text-xl font-bold font-display text-[#8B1528] group-hover:text-[#680E1C] transition-colors">
                  {isAr ? 'الحلويات الشرقية الفاخرة' : 'Royal Oriental Sweets'}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {isAr
                    ? 'كنافة نابلسية طازجة، تشكيلات البقلاوة بالفستق الحلبي الملكي، حلاوة الجبن، معمول التمر الفاخر، والبسبوسة بالسمن البلدي.'
                    : 'Warm Nabulsi Knafeh, multi-layered Aleppo pistachio baklava, Halawet El Jibn, fragrant date maamoul, and rich golden basbousa.'}
                </p>

                {/* Sub items tags unboxed text */}
                <div className="mt-4 pt-3 border-t border-stone-200/60 flex flex-wrap items-center gap-x-2 text-xs text-[#8B1528]/80 font-medium">
                  <span>{isAr ? 'كنافة نابلسية' : 'Nabulsi Knafeh'}</span>
                  <span>·</span>
                  <span>{isAr ? 'بقلاوة حلبية' : 'Pistachio Baklava'}</span>
                  <span>·</span>
                  <span>{isAr ? 'معمول ملكي' : 'Royal Maamoul'}</span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between text-xs font-semibold text-[#8B1528] group-hover:text-[#680E1C]">
                <span>{isAr ? 'تصفح الحلويات الشرقية' : 'Explore Oriental Sweets'}</span>
                <ArrowIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>

          {/* Card 2: Western Sweets (Crisp White Background with Red & Gold Accents) */}
          <div
            onClick={() => onSelectCategory('western')}
            className="group relative rounded-2xl overflow-hidden bg-white border border-stone-200 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer hover:border-[#8B1528]/60"
          >
            {/* Image Banner */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
              <img
                src="/src/assets/images/western_collection_1790375025087.jpg"
                alt={isAr ? 'تشكيلة الباتيسري الفرنسي والغربي' : 'French patisserie and western sweets'}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/70 via-transparent to-transparent"></div>

              <div className="absolute bottom-3 start-4 flex items-center gap-2">
                <span className="p-1.5 bg-white text-[#8B1528] rounded-md shadow-xs">
                  <Cake className="w-4 h-4" />
                </span>
                <span className="text-xs font-bold text-white tracking-wide uppercase">
                  {isAr ? 'فخامة فرنسية' : 'French Elegance'}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 bg-white flex-1 flex flex-col justify-between border-t border-stone-100">
              <div>
                <h3 className="text-xl font-bold font-display text-stone-900 group-hover:text-[#8B1528] transition-colors">
                  {isAr ? 'الباتيسري والحلويات الغربية' : 'Haute Pâtisserie & Cakes'}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {isAr
                    ? 'ميل فوي الفانيليا والتوت البري، تشيز كيك سان سيباستيان، كيكة الرد فيلفت المخملية، تارت الفواكه الطازجة، والماكرون الباريسي.'
                    : 'Crispy berry mille-feuille, burnt San Sebastián cheesecake, signature red velvet gateaux, fruit tartlets, and French macarons.'}
                </p>

                {/* Sub items tags */}
                <div className="mt-4 pt-3 border-t border-stone-100 flex flex-wrap items-center gap-x-2 text-xs text-stone-500 font-medium">
                  <span>{isAr ? 'ميل فوي فرنسي' : 'Mille-Feuille'}</span>
                  <span>·</span>
                  <span>{isAr ? 'رد فيلفت' : 'Red Velvet'}</span>
                  <span>·</span>
                  <span>{isAr ? 'سان سيباستيان' : 'Cheesecake'}</span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between text-xs font-semibold text-[#8B1528]">
                <span>{isAr ? 'تصفح الباتيسري الغربي' : 'Explore Western Sweets'}</span>
                <ArrowIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>

          {/* Card 3: Gift Boxes & Special Celebrations */}
          <div
            onClick={() => onSelectCategory('gifts')}
            className="group relative rounded-2xl overflow-hidden bg-gradient-to-b from-stone-900 to-stone-950 text-white border border-[#C5A059]/40 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer hover:border-[#DFB15B]"
          >
            {/* Image Banner */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-950">
              <img
                src="/src/assets/images/patisserie_craft_story_1790375035549.jpg"
                alt={isAr ? 'صناديق الهدايا الفاخرة والأعراس' : 'Luxury gift boxes and hampers'}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent"></div>

              <div className="absolute bottom-3 start-4 flex items-center gap-2">
                <span className="p-1.5 bg-[#DFB15B] text-stone-950 rounded-md shadow-xs">
                  <Gift className="w-4 h-4" />
                </span>
                <span className="text-xs font-bold text-[#DFB15B] tracking-wide uppercase">
                  {isAr ? 'هدايا ملكية ومناسبات' : 'Royal Gifting'}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 bg-stone-950 flex-1 flex flex-col justify-between border-t border-stone-800">
              <div>
                <h3 className="text-xl font-bold font-display text-white group-hover:text-[#DFB15B] transition-colors">
                  {isAr ? 'بوكسات الهدايا وصواني الضيافة' : 'Luxury Gift Hampers & Platters'}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-stone-300 leading-relaxed">
                  {isAr
                    ? 'صناديق مخملية مذهبة تضم مزيجاً راقياً من أشهى أصناف الشرق والغرب، مصممة للمجالس الفاخرة، حفلات الزفاف، والأعياد المباركة.'
                    : 'Gold-embossed velvet hampers containing our signature East-West duets, bespoke wedding platters, and seasonal holiday collections.'}
                </p>

                {/* Sub items tags */}
                <div className="mt-4 pt-3 border-t border-stone-800 flex flex-wrap items-center gap-x-2 text-xs text-[#DFB15B] font-medium">
                  <span>{isAr ? 'صواني نحاسية' : 'Brass Trays'}</span>
                  <span>·</span>
                  <span>{isAr ? 'صناديق مخملية' : 'Velvet Boxes'}</span>
                  <span>·</span>
                  <span>{isAr ? 'ضيافة أعراس' : 'Wedding Platters'}</span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between text-xs font-semibold text-[#DFB15B] group-hover:text-white">
                <span>{isAr ? 'استكشف بوكسات الهدايا' : 'View Gift Hampers'}</span>
                <ArrowIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
