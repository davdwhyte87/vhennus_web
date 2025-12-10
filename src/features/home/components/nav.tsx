import { useState } from 'react';
import AppButton from '../../../Shared/components/Button';
import { useAuthStore } from '../../auth/useAuthStore';
import { useNavigate } from 'react-router-dom';
const logo =  (await import("../../../assets/vlogosm.png")).default
const ResponsiveNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const useAuth = useAuthStore()
  const navigate = useNavigate()
  return (
    <nav className="fixed w-full z-50 top-0 bg-white shadow-md">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0 flex items-center">
            <div><img className="w-10 h-5 object-contain" src={logo}/></div>
            <h1 className="text-2xl font-bold text-gray-800">Vhennus</h1>
          </div>

          {/* Desktop Navigation - Center Links */}
          <div className="hidden md:flex items-center justify-center flex-1">
            <div className="flex space-x-8">
              {/* <a href="#" className=" text-lg text-gray-700 hover:text-gray-900 px-3 py-2 font-medium">
                Download White Paper
              </a> */}
              {/* <a href="#" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-lg font-medium">
                About
              </a>
              <a href="#" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-lg font-medium">
                Services
              </a>
              <a href="#" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-lg font-medium">
                Contact
              </a> */}
            </div>
          </div>

          {/* Desktop Navigation - Login/Register (Right Side) */}
          <div className="hidden md:flex items-center space-x-4">
            <AppButton size="md" variant="secondary" onClick={()=> window.open("https://bend.vhennus.com/download/vwhite_paper_1.pdf", "_blank", "noopener,noreferrer")}>White Paper</AppButton>
            {useAuth.isLoggedIn()? <AppButton size="md" variant="outline" onClick={()=>navigate('/home/feeds')}>Go to app</AppButton> :
            <>
            <AppButton size="md" variant="primary" onClick={()=>navigate('/login')}>Login</AppButton>
            <AppButton size="md" variant="outline" onClick={()=>navigate('/signup')}>Signup</AppButton>
            </>
            }
            
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              className="text-gray-700 hover:text-gray-900 focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {/* <a
              href="#"
              className="text-gray-700 hover:text-gray-900 block px-3 py-2 text-base font-medium"
            >
              Download White Paper
            </a> */}
            {/* <a
              href="#"
              className="text-gray-700 hover:text-gray-900 block px-3 py-2 text-base font-medium"
            >
              About
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-gray-900 block px-3 py-2 text-base font-medium"
            >
              Services
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-gray-900 block px-3 py-2 text-base font-medium"
            >
              Contact
            </a> */}
            
            {/* Mobile Login/Register */}
            <div className="border-t border-gray-200 pt-4 mt-2 space-y-3">
                <div className='flex flex-col space-y-2'>
                    <AppButton size="lg" variant="secondary" onClick={()=> window.open("https://bend.vhennus.com/download/vwhite_paper_1.pdf", "_blank", "noopener,noreferrer")}>White Paper</AppButton>
                     {useAuth.isLoggedIn()? <AppButton size="lg" variant="outline" onClick={()=>navigate('/home/feeds')}>Go To App</AppButton> :
                     <>
                        <AppButton size="lg" onClick={()=>navigate('/login')} variant="primary">Login</AppButton>
                        <AppButton size="lg" onClick={()=>navigate('/signup')} variant="outline">Signup</AppButton>
                     </>
                     
                     }
                
                </div>
             
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default ResponsiveNavbar;