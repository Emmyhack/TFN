'use client';

import { useState, useEffect, Suspense, lazy } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { PageLoader, ComponentLoader, SkeletonCard } from '@/components/ui/loading';
import { useLanguage } from '@/providers/language-provider';

// Lazy load heavy components
const StatsSection = lazy(() => import('@/components/sections/StatsSection'));
const FeaturesSection = lazy(() => import('@/components/sections/FeaturesSection'));
const TestimonialsSection = lazy(() => import('@/components/sections/TestimonialsSection'));

export default function HomePage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const slides = [
    {
      title: t('home.welcome'),
      subtitle: t('home.subtitle'),
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop",
      cta: t('home.joinFellowship'),
      action: () => router.push('/auth/signup')
    },
    {
      title: t('home.liveStreaming'),
      subtitle: t('home.liveSubtitle'),
      image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=400&fit=crop",
      cta: t('home.watchLive'),
      action: () => router.push('/live')
    },
    {
      title: t('home.prayerRequests'),
      subtitle: t('home.prayerSubtitle'),
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=400&fit=crop",
      cta: t('home.submitPrayer'),
      action: () => router.push('/prayer')
    },
    {
      title: t('home.testimony'),
      subtitle: t('home.testimonySubtitle'),
      image: "https://images.unsplash.com/photo-1519452649417-90905ad41e4f?w=800&h=400&fit=crop",
      cta: t('home.shareTestimony'),
      action: () => router.push('/testimony')
    }
  ];

  useEffect(() => {
    // Auto-advance carousel
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    // Mark as loaded after initial render
    setIsLoaded(true);

    return () => clearInterval(interval);
  }, [slides.length]);

  if (!isLoaded) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      
      {/* Hero Carousel Section */}
      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-purple-900/80 z-10"></div>
        
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url(${slide.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
        ))}

        <div className="relative z-20 h-full flex items-center justify-center text-center text-white px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              {slides[currentSlide].title}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 animate-fade-in-delay">
              {slides[currentSlide].subtitle}
            </p>
            <div className="space-x-4">
              <Button 
                size="lg" 
                variant="gradient"
                onClick={slides[currentSlide].action}
                className="text-lg px-8 py-4 transform hover:scale-105 transition-transform duration-200"
              >
                {slides[currentSlide].cta}
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-purple-900 transform hover:scale-105 transition-all duration-200"
                onClick={() => router.push('/about')}
              >
                {t('home.learnMore')}
              </Button>
            </div>
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </section>

      {/* Lazy loaded sections with suspense */}
      <Suspense fallback={<ComponentLoader className="h-64" />}>
        <StatsSection />
      </Suspense>

      <Suspense fallback={<div className="py-20"><div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}</div></div>}>
        <FeaturesSection />
      </Suspense>

      <Suspense fallback={<ComponentLoader className="h-64" />}>
        <TestimonialsSection />
      </Suspense>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900 to-purple-900 dark:from-blue-950 dark:to-purple-950">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t('home.readyToJoin')}
          </h2>
          <p className="text-xl text-blue-200 mb-8 max-w-2xl mx-auto">
            {t('home.ctaSubtitle')}
          </p>
          <div className="space-x-4">
            <Button 
              size="lg" 
              variant="gradient"
              onClick={() => router.push('/auth/signup')}
              className="text-lg px-8 py-4 transform hover:scale-105 transition-transform duration-200"
            >
              {t('home.joinToday')}
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-purple-900 transform hover:scale-105 transition-all duration-200"
              onClick={() => router.push('/live')}
            >
              {t('home.watchLiveStream')}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}