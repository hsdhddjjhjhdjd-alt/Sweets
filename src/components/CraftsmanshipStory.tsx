import React from 'react';
import { Sparkles, Award, Shield, HeartHandshake } from 'lucide-react';
import { Language } from '../types';

interface CraftsmanshipStoryProps {
  language: Language;
}

export const CraftsmanshipStory: React.FC<CraftsmanshipStoryProps> = ({ language }) => {
  const isAr = language === 'ar';

  const pillars = [
    {
      icon: Award,
      title: { ar: 'الفستق الحلبي والمكسرات المنتقاة', en: 'First-Grade Aleppo Pistachios' },
      desc: {
        ar: 'ننتقي سنوياً أفضل محاصيل الفستق الحلبي الأخضر وحبات الجوز واللوز المحمصة بعناية دون أي مواد حافظة.',
        en: 'Strictly sourcing emerald-green Aleppo pistachios and roasted Mediterranean nuts directly from heritage groves.',
      },
    },
    {
      icon: Shield,
      title: { ar: 'الزبدة الفرنسية AOP والسمن البلدي', en: 'AOP Normandy Butter & Clarified Ghee' },
      desc: {
        ar: 'لا نستخدم الدهون النباتية أو الزيوت المهدرجة إطلاقاً؛ بل زبدة فرنسية أصيلة معتمدة وسمن بقر بلدي نقي 100%.',
        en: 'Zero hydrogenated vegetable fats. We exclusively employ certified French AOP churned butter and pure clarified ghee.',
      },
    },
    {
      icon: Sparkles,
      title: { ar: 'شيفات معتمدون من باريس ودمشق', en: 'Master Pâtissiers from Paris & Damascus' },
      desc: {
        ar: 'فريقنا يجمع بين أجيال من معلمي الكنافة والبقلاوة الشامية العريقة، وخريجي أرقى معاهد الحلويات الفرنسية في باريس.',
        en: 'Our kitchen unites multi-generational Levantine baklava masters with French patisserie alumni of Le Cordon Bleu.',
      },
    },
    {
      icon: HeartHandshake,
      title: { ar: 'خبز طازج على دفعات صغيرة', en: 'Fresh Daily Small-Batch Baking' },
      desc: {
        ar: 'نخبز حلوياتنا كل 45 دقيقة طوال اليوم لنضمن وصولها إلى مائدتك بطراوتها الساخنة وقرمشتها البكر.',
        en: 'Baked continuously every 45 minutes to guarantee peak warm crispness and melt-in-the-mouth freshness.',
      },
    },
  ];

  return (
    <section id="story" className="py-16 sm:py-24 bg-[#FDFCF7] border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Text Column (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8B1528]/10 text-[#8B1528] text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>{isAr ? 'قصتنا وحرفيتنا' : 'Our Story & Heritage'}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-stone-900 leading-tight">
              {isAr ? (
                <>
                  شغف يتوارثه الأجيال <br />
                  <span className="text-[#8B1528]">بين باريس وعبق الشرق</span>
                </>
              ) : (
                <>
                  Generations of Passion <br />
                  <span className="text-[#8B1528]">Bridging Paris & the Levant</span>
                </>
              )}
            </h2>

            <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
              {isAr
                ? 'تأسس قصر الحلويات الملكي برؤية واحدة: تقديم أرقى تجربة حلوى في العالم تجمع بين دفء وأصالة الحلويات الشرقية (الكنافة النابلسية الساخنة، صواني البقلاوة المورقة، والمعمول المعطر بماء الزهر) ودقة وحرفية الباتيسري الفرنسي الفاخر (الميل فوي المكرمل، كيكات الرد فيلفت، والماكرون الباريسي).'
                : 'Founded with a singular devotion: to craft an unparalleled dessert experience uniting the soul and warmth of Middle Eastern confectionery—warm Nabulsi knafeh, delicate pistachio baklava, and rosewater maamoul—with the technical precision of Parisian haute pâtisserie.'}
            </p>

            <p className="text-stone-600 text-sm leading-relaxed">
              {isAr
                ? 'نؤمن أن سر الحلوى الاستثنائية يكمن في نقاء المكون؛ لذلك نسافر سنوياً لاستيراد الفستق الحلبي من حلب، والفانيليا الطبيعية من تاهيتي، والزبدة النقية من مزارع النورماندي الفرنسية.'
                : 'We believe genuine luxury begins with uncompromising ingredients: sourcing our pistachios directly from Syrian heritage orchards, wild vanilla from Tahiti, and grass-fed butter from Normandy.'}
            </p>

            {/* Signature or Founder Quote */}
            <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
              <div>
                <p className="font-display font-bold text-stone-900 text-base">
                  {isAr ? 'الشيف كريم الصباغ & الشيف بيير دي بوفيه' : 'Chef Karim Al-Sabbagh & Chef Pierre Dubois'}
                </p>
                <p className="text-xs text-stone-500">
                  {isAr ? 'كبار طهاة ومؤسسي قصر الحلويات الملكي' : 'Master Culinary Directors & Founders'}
                </p>
              </div>
              <div className="text-end font-display text-[#C5A059] italic text-sm">
                {isAr ? '«صُنعت لتسعد القلوب»' : '"Crafted to evoke pure joy"'}
              </div>
            </div>
          </div>

          {/* Right Visual Image & Highlights Column (6 cols) */}
          <div className="lg:col-span-6 space-y-8">
            {/* Visual Frame */}
            <div className="relative rounded-2xl overflow-hidden border border-stone-200 shadow-xl bg-stone-100 aspect-[16/10]">
              <img
                src="/src/assets/images/patisserie_craft_story_1790375035549.jpg"
                alt={isAr ? 'شيف الحلويات في الأتيليه' : 'Master pastry chef in atelier'}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent"></div>
              
              <div className="absolute bottom-4 start-4 text-white text-xs">
                <span className="font-semibold block">{isAr ? 'أتيليه الحلويات المفتوح' : 'Open Atelier Kitchen'}</span>
                <span className="text-stone-300 text-[11px]">{isAr ? 'تحضير يدوي يومي أمام الضيوف' : 'Live handcrafted daily preparation'}</span>
              </div>
            </div>

            {/* 4 Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pillars.map((pillar, idx) => {
                const IconComponent = pillar.icon;
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-white border border-stone-200/90 shadow-2xs hover:border-[#8B1528]/30 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 rounded-lg bg-[#8B1528]/10 text-[#8B1528]">
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <h4 className="text-xs font-bold text-stone-900 leading-snug">
                        {pillar.title[language]}
                      </h4>
                    </div>
                    <p className="text-[11px] text-stone-600 leading-relaxed">
                      {pillar.desc[language]}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
