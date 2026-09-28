import React from 'react';
import { Star, Quote, CheckCircle, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { CUSTOMER_REVIEWS } from '../data/desserts';

interface CustomerReviewsProps {
  language: Language;
}

export const CustomerReviews: React.FC<CustomerReviewsProps> = ({ language }) => {
  const isAr = language === 'ar';

  return (
    <section className="py-16 sm:py-20 bg-stone-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8B1528] uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>{isAr ? 'شهادات ضيوفنا الكرام' : 'Guest Impressions'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold font-display text-stone-900 tracking-tight">
            {isAr ? 'ما يقوله رواد قصر الحلويات الملكي' : 'Adored by Connoisseurs & Gourmands'}
          </h2>
          <p className="mt-2 text-stone-500 text-sm">
            {isAr
              ? 'أكثر من 2,500 تقييم 5 نجوم من ضيوفنا في دبي والرياض والدوحة وباريس'
              : 'Over 2,500 five-star verified experiences across our salons in Dubai, Riyadh, Doha, and Paris'}
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {CUSTOMER_REVIEWS.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-2xl p-6 sm:p-7 border border-stone-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Top Row: Stars and Quote icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-[#8B1528] text-[#8B1528]"
                      />
                    ))}
                  </div>
                  <Quote className="w-5 h-5 text-stone-300" />
                </div>

                {/* Comment */}
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic">
                  "{review.comment[language]}"
                </p>
              </div>

              {/* Author & Favorite item */}
              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-stone-900">
                      {review.author[language]}
                    </h4>
                    <span title={isAr ? 'مشتري موثق' : 'Verified Guest'}>
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    {review.role[language]}
                  </p>
                </div>

                <div className="text-end">
                  <span className="text-[10px] text-stone-400 block">
                    {isAr ? 'الصنف المفضل' : 'Favorite'}
                  </span>
                  <span className="text-[11px] font-semibold text-[#8B1528]">
                    {review.favoriteItem[language]}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
