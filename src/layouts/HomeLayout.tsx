import HomeBottomNav from "../features/Feed/Components/HomeBottomNav.tsx";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

const HomeLayout: React.FC = () => {
    const [scrollPosition, setScrollPosition] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrollPosition(window.scrollY);
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <style>{`
                .bg-grid-pattern {
                    background-image: 
                        radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.05) 0%, transparent 55%),
                        radial-gradient(circle at 75% 75%, rgba(168, 85, 247, 0.05) 0%, transparent 55%);
                    background-attachment: fixed;
                }
                
                .gradient-blur {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 200px;
                    background: linear-gradient(180deg, rgba(99, 102, 241, 0.1) 0%, transparent 100%);
                    pointer-events: none;
                    z-index: -1;
                }
                
                .content-blur {
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                }
                
                .min-h-screen-safe {
                    min-height: calc(100vh - env(safe-area-inset-bottom, 0px));
                }
                
                .pb-safe {
                    padding-bottom: env(safe-area-inset-bottom, 0px);
                }
            `}</style>

            {/* Gradient Background Effects */}
            <div className="gradient-blur"></div>
            
            <div className="min-h-screen-safe bg-grid-pattern">
                {/* Progress Indicator */}
                <div className="fixed top-0 left-0 right-0 h-1 z-50">
                    <div 
                        className="h-full bg-gradient-to-r from-primary via-purple-500 to-pink-500 transition-all duration-300"
                        style={{ width: `${Math.min((scrollPosition / 500) * 100, 100)}%` }}
                    ></div>
                </div>

                <div className="flex flex-col min-h-screen-safe">
                    {/* Main Content */}
                    <div className="flex-grow overflow-hidden relative">
                        {/* Floating Background Elements */}
                        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"></div>
                        
                        <div className="relative z-10">
                            <Outlet />
                        </div>
                    </div>

                    {/* Bottom Navigation */}
                    <div className="fixed bottom-0 left-0 right-0 z-40">
                        <HomeBottomNav />
                    </div>
                </div>
            </div>
        </>
    );
};

export default HomeLayout;