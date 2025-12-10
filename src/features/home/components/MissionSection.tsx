import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface SimpleMissionSectionProps {
  imageSrc: string;
  imageAlt?: string;
  missionTagline?: string;
  _missionTitle?: string;
  missionDescription?: string;
}

const SimpleMissionSection: React.FC<SimpleMissionSectionProps> = ({ 
  imageSrc,
  imageAlt = "Our vision for civilization",
  missionTagline = "Vhennus Mission",
  missionDescription = "We will provide our citizens with jobs, business financing, research financing, healthcare and other critical infrastructure."
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate()
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        {/* Mission Content */}
        <div className={`mb-12 md:mb-16 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          {/* Tagline */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            <span className="text-lg font-semibold text-blue-700">{missionTagline}</span>
          </div>

          {/* Title */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            <span className="text-gray-900">Build a new civilization </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              digitally
            </span>
            <span className="text-gray-900">, then </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              physically
            </span>
            <span className="text-gray-900">.</span>
          </h2>

          {/* Description */}
          <div className="relative pl-6 mb-8">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full"></div>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              {missionDescription}
            </p>
          </div>

          {/* Key Points */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {['Jobs', 'Financing', 'Research', 'Healthcare'].map((item, index) => (
              <div 
                key={index}
                className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
              >
                <div className="text-center">
                  <div className={`text-2xl mb-2 ${
                    index === 0 ? 'text-blue-500' : 
                    index === 1 ? 'text-green-500' : 
                    index === 2 ? 'text-purple-500' : 'text-pink-500'
                  }`}>
                    {index === 0 ? '💼' : index === 1 ? '💰' : index === 2 ? '🔬' : '🏥'}
                  </div>
                  <span className="font-medium text-gray-800">{item}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Image Section */}
        <div className={`relative group transition-all duration-700 delay-300 ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}>
          <div className="relative overflow-hidden rounded-2xl shadow-xl">
            <img
              src={imageSrc}
              alt={imageAlt}
              className="w-full h-64 md:h-80 object-cover transform transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
          
          {/* Image Caption */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500 italic">
              Envisioning the future of civilization through innovation
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <button onClick={()=>{navigate('/signup')}} className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            Join Our Mission
          </button>
        </div>
      </div>
    </section>
  );
};

export default SimpleMissionSection;