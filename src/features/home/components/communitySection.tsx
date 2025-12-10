import React, { useState, useEffect } from 'react';

interface CommunitySectionProps {
  imageSrc: string;
  imageAlt?: string;
}

const CommunitySection: React.FC<CommunitySectionProps> = ({ 
  imageSrc, 
  imageAlt = "Community illustration" 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative px-4 py-20 md:py-28 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-100 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-20 -left-40 w-80 h-80 bg-pink-100 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-50 to-pink-50 rounded-full opacity-30 blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
          {/* Image Container */}
          <div 
            className={`w-full lg:w-1/2 transition-all duration-700 transform ${
              isVisible 
                ? 'opacity-100 translate-x-0' 
                : 'opacity-0 -translate-x-10'
            }`}
          >
            <div className="relative group">
              {/* Main Image Container */}
              <div className="relative overflow-hidden rounded-3xl shadow-2xl transition-all duration-500 group-hover:shadow-3xl group-hover:-translate-y-2">
                <img 
                  src={imageSrc} 
                  alt={imageAlt}
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              
              {/* Decorative elements around image */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl -z-10 opacity-80 blur-sm"></div>
              <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-gradient-to-tr from-blue-400 to-purple-400 rounded-2xl -z-10 opacity-80 blur-sm"></div>
              
              {/* Floating badge */}
              <div className="absolute -top-6 -right-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full shadow-lg transform rotate-6">
                <span className="text-sm font-bold">Our Community</span>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div 
            className={`w-full lg:w-1/2 transition-all duration-700 delay-200 ${
              isVisible 
                ? 'opacity-100 translate-x-0' 
                : 'opacity-0 translate-x-10'
            }`}
          >
            {/* Section Tag */}
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-purple-50 rounded-full">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-purple-600">OUR PHILOSOPHY</span>
            </div>

            {/* Main Heading */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="text-gray-900">We believe in </span>
              <span className="relative inline-block">
                <span className="relative z-10">Community</span>
                <span className="absolute bottom-0 left-0 w-full h-4 bg-gradient-to-r from-purple-200 to-pink-200 opacity-70 -z-0"></span>
              </span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                Love is our culture.
              </span>
            </h2>

            {/* Subheading */}
            <div className="relative pl-6 mb-8">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full"></div>
              <p className="text-xl md:text-2xl font-semibold text-gray-700 leading-relaxed">
                Win together, every life matters, 
                <span className="text-purple-600 font-bold"> every role is important.</span>
              </p>
            </div>

            {/* Supporting Text */}
            <div 
              className={`space-y-4 transition-all duration-700 delay-300 ${
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-10'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center mt-1">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                </div>
                <p className="text-gray-600">
                  Together we create a supportive ecosystem where everyone can thrive.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center mt-1">
                  <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                </div>
                <p className="text-gray-600">
                  Our culture celebrates diversity, empathy, and collective success.
                </p>
              </div>
            </div>

            {/* Interactive Stats */}
            <div 
              className={`mt-10 grid grid-cols-3 gap-4 max-w-md transition-all duration-700 delay-400 ${
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-10'
              }`}
            >
              <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="text-2xl font-bold text-purple-600">500+</div>
                <div className="text-sm text-gray-500">Members</div>
              </div>
              <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="text-2xl font-bold text-pink-600">100+</div>
                <div className="text-sm text-gray-500">Projects</div>
              </div>
              <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="text-2xl font-bold text-purple-600">24/7</div>
                <div className="text-sm text-gray-500">Support</div>
              </div>
            </div>

            {/* CTA Button */}
            <div
              className={`mt-12 transition-all duration-700 delay-500 ${
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-10'
              }`}
            >
              <button className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-purple-200">
                <span className="relative z-10">Join Our Community</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-0 group-hover:opacity-30 blur-md transition-opacity duration-500"></div>
                {/* Shine effect without JSX style tag */}
                <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-[shine_1.5s_infinite]"></div>
              </button>
            </div>
          </div>
        </div>

        {/* Decorative Bottom Element */}
        <div className="mt-20 pt-10 border-t border-gray-100">
          <div className="flex justify-center">
            <div className="flex items-center space-x-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div 
                  key={i}
                  className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-70 animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;