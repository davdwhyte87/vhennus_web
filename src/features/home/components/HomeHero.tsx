import React, { useEffect, useState } from 'react';

interface HeroSectionProps {
  profileImage: string;
  title?: string;
  subtitle?: string;
}

const MinimalHeroSection: React.FC<HeroSectionProps> = ({ 
  profileImage,
  title = "Vhennus Digital Nation",
  subtitle = "Bringing like minded people to create a new civilization"
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="relative h-screen min-h-[700px] w-full overflow-hidden">
      {/* Background with Blur Effect */}
      <div className="absolute inset-0">
        <img
          src={profileImage}
          alt="Digital Nation Background"
          className="absolute inset-0 h-full w-full object-cover scale-105 transition-transform duration-10000 ease-out"
          loading="eager"
        />
        
        {/* Modern Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-gray-900/90 via-purple-900/70 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/90"></div>
        
        {/* Animated Grid Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#fff_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          <div className="absolute inset-0 bg-[linear-gradient(#fff_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-20 flex h-full items-center px-6 md:px-12 lg:px-20">
        <div className="max-w-4xl mx-auto w-full">
          <div className={`space-y-6 md:space-y-8 transition-all duration-1000 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            {/* Title with Accent Line */}
            <div className="space-y-4">
              <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-8"></div>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight tracking-tighter">
                {title.split(' ').map((word, i) => (
                  <span 
                    key={i} 
                    className={`block ${i === 1 ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300' : ''}`}
                  >
                    {word}
                  </span>
                ))}
              </h1>
            </div>

            {/* Subtitle */}
            <div className="max-w-2xl">
              <p className="text-xl md:text-2xl text-white/80 font-light leading-relaxed border-l-4 border-purple-500/50 pl-6 py-2">
                {subtitle}
              </p>
            </div>

         

            {/* Stats Bar */}
            <div className="flex flex-wrap items-center gap-6 md:gap-10 pt-12 border-t border-white/20">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">100%</div>
                <div className="text-sm text-white/60">Digital</div>
              </div>
              <div className="hidden md:block w-px h-8 bg-white/30"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">24/7</div>
                <div className="text-sm text-white/60">Access</div>
              </div>
              <div className="hidden md:block w-px h-8 bg-white/30"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">Global</div>
                <div className="text-sm text-white/60">Network</div>
              </div>
            </div>
          </div>
        </div>
      </div>

    
    </section>
  );
};

export default MinimalHeroSection;