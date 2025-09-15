import Image from 'next/image';

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      location: "Lagos, Nigeria",
      text: "TFN has connected me with believers worldwide. The prayer support I have received is incredible!",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b5b42d5c?w=60&h=60&fit=crop&crop=face"
    },
    {
      name: "David Chen",
      location: "Toronto, Canada", 
      text: "The live streaming services have been a blessing. I feel connected to the global body of Christ.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face"
    },
    {
      name: "Grace Okafor",
      location: "Abuja, Nigeria",
      text: "Through TFN&apos;s Bible study groups, I have grown spiritually and made lasting friendships.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            What Our Community Says
          </h2>
          <p className="text-xl text-purple-200 max-w-3xl mx-auto">
            Hear from believers around the world who have experienced God&apos;s love through our fellowship network.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-white transform hover:scale-105 transition-all duration-300 border border-white/20"
            >
              <div className="flex items-center mb-6">
                <Image
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-full mr-4 border-2 border-white/30"
                />
                <div>
                  <h4 className="font-bold text-lg">{testimonial.name}</h4>
                  <p className="text-purple-200">{testimonial.location}</p>
                </div>
              </div>
              <p className="text-lg leading-relaxed italic">
                &ldquo;{testimonial.text}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}