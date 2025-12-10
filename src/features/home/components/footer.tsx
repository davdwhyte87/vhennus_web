import React, { useEffect, useState } from 'react';

const Footer = ({ 
  organizationName = "Purple Innovation Inc.", 
  email = "contact@purpleinnovation.com" 
}) => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const handleSmoothScroll = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]');
      
      if (!anchor) return;
      
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId as string);
      if (targetElement) {
        e.preventDefault();
        window.scrollTo({
          top: (targetElement as HTMLElement).offsetTop,
          behavior: 'smooth'
        });
      }
    };

    document.addEventListener('click', handleSmoothScroll);
    
    return () => {
      document.removeEventListener('click', handleSmoothScroll);
    };
  }, []);

  // Email icon SVG
  const EmailIcon = () => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className="h-5 w-5 text-purple-200" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
      />
    </svg>
  );

  return (
    <footer className="bg-primary text-white py-8 px-4 md:px-8 w-full">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Organization Info */}
          <div className="text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              {organizationName}
            </h2>
            
            <div className="hidden md:block w-16 h-0.5 bg-purple-400 my-3"></div>
            
            <div className="flex items-center justify-center md:justify-start gap-3 mt-4">
              <EmailIcon />
              <a 
                href={`mailto:${email}`}
                className="text-lg text-white hover:text-purple-100 transition-colors duration-200 font-medium hover:underline"
              >
                {email}
              </a>
            </div>
            
            {/* Divider for mobile */}
            <div className="md:hidden w-16 h-0.5 bg-purple-400 mx-auto my-4"></div>
          </div>
          
          {/* Copyright */}
          <div className="text-center md:text-right">
            <p className="text-purple-200 text-sm md:text-base">
              &copy; {currentYear} {organizationName}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;