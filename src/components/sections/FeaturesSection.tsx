import Link from 'next/link';

export default function FeaturesSection() {
  const features = [
    {
      icon: "🎥",
      title: "Live Streaming",
      description: "Join live services, prayer meetings, and fellowship gatherings from anywhere in the world.",
      link: "/live"
    },
    {
      icon: "💬",
      title: "Community Chat",
      description: "Connect with believers worldwide through our real-time chat platform.",
      link: "/chat"
    },
    {
      icon: "🙏",
      title: "Prayer Network",
      description: "Submit prayer requests and join others in intercessory prayer.",
      link: "/prayer"
    },
    {
      icon: "📖",
      title: "Bible Study Groups",
      description: "Join or create Bible study groups with believers from around the globe.",
      link: "/groups"
    },
    {
      icon: "📅",
      title: "Events & Programs",
      description: "Discover and participate in fellowship events, conferences, and programs.",
      link: "/events"
    },
    {
      icon: "✨",
      title: "Testimonies",
      description: "Share and read inspiring testimonies of God's goodness and faithfulness.",
      link: "/testimony"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Platform Features
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the powerful tools and features designed to strengthen your faith and connect you with believers worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Link
              key={index}
              href={feature.link}
              className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100 hover:border-blue-200"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-200">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
              <div className="mt-4 text-blue-600 font-semibold group-hover:text-purple-600 transition-colors duration-200">
                Learn More →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}