import { useState, useEffect } from 'react';

export default function StatsSection() {
  const [stats, setStats] = useState({
    members: 0,
    events: 0,
    prayers: 0,
    testimonies: 0
  });

  useEffect(() => {
    // Animate stats counter
    const targets = { members: 50000, events: 1200, prayers: 25000, testimonies: 8500 };
    const duration = 2000;
    const steps = 60;
    const stepTime = duration / steps;

    const timers = Object.keys(targets).map(key => {
      const target = targets[key as keyof typeof targets];
      const increment = target / steps;
      let current = 0;

      return setInterval(() => {
        current += increment;
        if (current >= target) {
          setStats(prev => ({ ...prev, [key]: target }));
          clearInterval(timers[Object.keys(targets).indexOf(key)]);
        } else {
          setStats(prev => ({ ...prev, [key]: Math.floor(current) }));
        }
      }, stepTime);
    });

    return () => timers.forEach(clearInterval);
  }, []);

  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
          <div className="transform hover:scale-105 transition-transform duration-200">
            <div className="text-4xl md:text-5xl font-bold mb-2">
              {stats.members.toLocaleString()}+
            </div>
            <div className="text-lg text-blue-200">Members Worldwide</div>
          </div>
          <div className="transform hover:scale-105 transition-transform duration-200">
            <div className="text-4xl md:text-5xl font-bold mb-2">
              {stats.events.toLocaleString()}+
            </div>
            <div className="text-lg text-blue-200">Events Hosted</div>
          </div>
          <div className="transform hover:scale-105 transition-transform duration-200">
            <div className="text-4xl md:text-5xl font-bold mb-2">
              {stats.prayers.toLocaleString()}+
            </div>
            <div className="text-lg text-blue-200">Prayers Answered</div>
          </div>
          <div className="transform hover:scale-105 transition-transform duration-200">
            <div className="text-4xl md:text-5xl font-bold mb-2">
              {stats.testimonies.toLocaleString()}+
            </div>
            <div className="text-lg text-blue-200">Testimonies Shared</div>
          </div>
        </div>
      </div>
    </section>
  );
}