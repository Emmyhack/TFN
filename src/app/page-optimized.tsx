'use client';

import { useState, useEffect, Suspense, lazy } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { PageLoader, ComponentLoader, SkeletonCard } from '@/components/ui/loading';
import Link from 'next/link';
import { Header } from '@/components/layout/header';

// Lazy load heavy components
const StatsSection = lazy(() => import('@/components/sections/StatsSection'));
const FeaturesSection = lazy(() => import('@/components/sections/FeaturesSection'));
const TestimonialsSection = lazy(() => import('@/components/sections/TestimonialsSection'));

export default function HomePage() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Mock user - in real app this would come from auth context
  const mockUser = {
    id: '1',
    displayName: 'Demo User',
    handle: 'demouser',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
  };

  const slides = [
    {
      title: "Welcome to The Fellowship Network",
      subtitle: "Connecting believers worldwide through faith, fellowship, and community",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop",
      cta: "Join Fellowship",
      action: () => router.push('/auth/register')
    },
    {
      title: "Live Streaming Services",
      subtitle: "Join thousands in worship and prayer from anywhere in the world",
      image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=400&fit=crop",
      cta: "Watch Live",
      action: () => router.push('/live')
    },
    {
      title: "Prayer Requests",
      subtitle: "Share your prayer needs and pray for others in our community",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=400&fit=crop",
      cta: "Submit Prayer",
      action: () => router.push('/prayer')
    },
    {
      title: "Testimony Corner",
      subtitle: "Share how God has been working in your life",
      image: "https://images.unsplash.com/photo-1519452649417-90905ad41e4f?w=800&h=400&fit=crop",
      cta: "Share Testimony",
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header user={mockUser} />
      
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
                Learn More
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
      <section className="py-20 bg-gradient-to-br from-blue-900 to-purple-900">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Join Our Fellowship?
          </h2>
          <p className="text-xl text-blue-200 mb-8 max-w-2xl mx-auto">
            Connect with believers worldwide, grow in faith, and experience the power of Christian community. Your spiritual journey begins here.
          </p>
          <div className="space-x-4">
            <Button 
              size="lg" 
              variant="gradient"
              onClick={() => router.push('/auth/register')}
              className="text-lg px-8 py-4 transform hover:scale-105 transition-transform duration-200"
            >
              Join Fellowship Today
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-purple-900 transform hover:scale-105 transition-all duration-200"
              onClick={() => router.push('/live')}
            >
              Watch Live Stream
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}