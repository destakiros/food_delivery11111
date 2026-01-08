
import React from 'react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="relative h-[80vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2000&auto=format&fit=crop" 
            alt="Hero Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/20" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6">
              Craving something <span className="text-red-500">Delicious?</span>
            </h1>
            <p className="text-xl text-gray-200 mb-10 leading-relaxed">
              Experience the best burgers, pizzas, and shakes in town. Fast delivery, fresh ingredients, and unbeatable taste.
            </p>
            <button 
              onClick={onGetStarted}
              className="bg-red-600 text-white text-lg px-8 py-4 rounded-xl font-bold hover:bg-red-700 transition transform hover:scale-105 shadow-2xl shadow-red-500/50"
            >
              Order Now
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose In N Out?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">We pride ourselves on providing the fastest service with the freshest ingredients.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: 'Fresh Ingredients', desc: 'Sourced daily from local farmers to ensure top-notch quality.', icon: '🥗' },
              { title: 'Fast Delivery', desc: 'Our delivery partners ensure your food arrives hot and on time.', icon: '⚡' },
              { title: 'Expert Chefs', desc: 'Crafted by professionals with a passion for great taste.', icon: '👨‍🍳' }
            ].map((feature, i) => (
              <div key={i} className="text-center p-8 rounded-2xl bg-gray-50 hover:shadow-xl transition duration-300">
                <div className="text-5xl mb-6">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
