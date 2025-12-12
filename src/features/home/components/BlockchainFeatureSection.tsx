import React, { useState, useEffect } from 'react';
import { 
  ChartLine, 
  Users, 
  Globe, 
  AppWindow, 
  ChartBar,
  ShieldCheck,
  Microchip
} from 'lucide-react';

interface BlockchainFeature {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  delay: number;
}

const BlockchainSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeCard, setActiveCard] = useState<number | null>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features: BlockchainFeature[] = [
    {
      icon: <ChartLine className="w-12 h-12" />,
      title: "Tokenization",
      description: "Our blockchain helps people and organizations tokenize their real world assets and trade these assets on our decentralized exchange.",
      color: "from-blue-500 to-cyan-500",
      delay: 100
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: "Citizenship",
      description: "Anyone from all over the world can become citizens of our ecosystem and enjoy the benefits of being a loyal member of our new civilization.",
      color: "from-purple-500 to-pink-500",
      delay: 200
    },
    {
      icon: <Globe className="w-12 h-12" />,
      title: "DAOs",
      description: "We are giving teams and organizations the ability to create decentralized autonomous organizations on the Vhennus blockchain.",
      color: "from-green-500 to-emerald-500",
      delay: 300
    },
    {
      icon: <AppWindow className="w-12 h-12" />,
      title: "dApps",
      description: "Developers can build visual applications that run in our software ecosystem with seamless integration and powerful tools.",
      color: "from-orange-500 to-red-500",
      delay: 400
    },
    {
      icon: <ChartBar className="w-12 h-12" />,
      title: "Capital Markets",
      description: "Companies can sell tokenized shares on our exchange with full regulatory compliance and investor protection.",
      color: "from-indigo-500 to-blue-500",
      delay: 500
    },
    {
      icon: <ShieldCheck className="w-12 h-12" />,
      title: "Security",
      description: "Enterprise-grade security with multi-layer encryption and advanced consensus mechanisms for maximum protection.",
      color: "from-yellow-500 to-amber-500",
      delay: 600
    }
  ];

  return (
    <section className="relative py-16 md:py-24 lg:py-32 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-green-100 to-cyan-100 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl">
          <div className="grid grid-cols-6 gap-4 opacity-10">
            {[...Array(36)].map((_, i) => (
              <div key={i} className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse" 
                style={{ animationDelay: `${i * 0.1}s` }}>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative">
        {/* Header Section */}
        <div className="text-center mb-12 md:mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full mb-6 border border-blue-100">
            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-blue-700">TECHNOLOGY</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-gray-900">The </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Vhennus Blockchain
            </span>
          </h2>
          
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full mb-8"></div>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Powering the next generation of digital infrastructure with cutting-edge blockchain technology
          </p>
        </div>

        {/* Features Grid */}
        <div className="relative">
          {/* Decorative Connector Lines */}
          <div className="absolute inset-0 hidden lg:block pointer-events-none">
            <div className="absolute top-1/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent"></div>
            <div className="absolute top-2/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent"></div>
            <div className="absolute top-0 bottom-0 left-1/3 w-px bg-gradient-to-b from-transparent via-green-200 to-transparent"></div>
            <div className="absolute top-0 bottom-0 left-2/3 w-px bg-gradient-to-b from-transparent via-cyan-200 to-transparent"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`relative group transition-all duration-500 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${feature.delay}ms` }}
                onMouseEnter={() => setActiveCard(index)}
                onMouseLeave={() => setActiveCard(null)}
              >
                {/* Card Container */}
                <div className={`relative h-full p-6 md:p-8 rounded-2xl bg-white border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 ${
                  activeCard === index ? 'transform scale-105 border-blue-200' : ''
                }`}>
                  {/* Background Glow Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-500 -z-10`}></div>
                  
                  {/* Corner Accents */}
                  <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                    <div className={`absolute top-0 right-0 w-8 h-8 bg-gradient-to-br ${feature.color} opacity-20 rounded-bl-2xl`}></div>
                  </div>
                  
                  {/* Icon Container */}
                  <div className={`relative mb-6 p-4 bg-gradient-to-br ${feature.color} rounded-2xl w-16 h-16 flex items-center justify-center transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                    <div className="text-white">
                      {feature.icon}
                    </div>
                    {/* Icon Glow */}
                    <div className={`absolute -inset-2 bg-gradient-to-br ${feature.color} rounded-2xl opacity-0 group-hover:opacity-30 blur-md transition-opacity duration-500`}></div>
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    
                    <div className="relative pl-4">
                      <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${feature.color} rounded-full transition-all duration-500 ${
                        activeCard === index ? 'h-full' : 'h-1/2'
                      }`}></div>
                      <p className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>

                    {/* Read More Link */}
                   
                  </div>

                  {/* Floating Badge */}
                  <div className={`absolute -top-3 -right-3 bg-gradient-to-r ${feature.color} text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg transform rotate-3 transition-transform duration-300 group-hover:rotate-0`}>
                    #{index + 1}
                  </div>
                </div>

                {/* Connecting Lines (Mobile) */}
                {index < features.length - 1 && (
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-px h-8 bg-gradient-to-b from-blue-200 to-transparent md:hidden"></div>
                )}
              </div>
            ))}
          </div>

          {/* Stats Bar */}
          <div className={`mt-12 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 transition-all duration-1000 delay-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="text-center p-6 bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">100%</div>
              <div className="text-sm text-gray-600 mt-2">Decentralized</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">24/7</div>
              <div className="text-sm text-gray-600 mt-2">Uptime</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">∞</div>
              <div className="text-sm text-gray-600 mt-2">Scalability</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">0%</div>
              <div className="text-sm text-gray-600 mt-2">Downtime</div>
            </div>
          </div>

          {/* CTA Section */}
          <div className={`mt-16 text-center transition-all duration-1000 delay-900 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="inline-flex flex-col md:flex-row items-center gap-6 p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl border border-blue-100 max-w-2xl mx-auto">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <Microchip className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-gray-900">Ready to build on Vhennus?</h4>
                  <p className="text-sm text-gray-600">Start developing today</p>
                </div>
              </div>
              <div className="flex gap-4">
                <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-full hover:shadow-xl transition-all duration-300 hover:scale-105">
                  Get Started
                </button>
                <button className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-full border-2 border-blue-200 hover:border-blue-300 transition-all duration-300">
                  View Docs
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-1/4 right-10 hidden lg:block">
        <div className="relative">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
          <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 animate-ping"></div>
        </div>
      </div>
      <div className="absolute bottom-1/4 left-10 hidden lg:block">
        <div className="relative">
          <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full animate-pulse"></div>
          <div className="absolute -inset-2 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full opacity-20 animate-ping"></div>
        </div>
      </div>
    </section>
  );
};

export default BlockchainSection;