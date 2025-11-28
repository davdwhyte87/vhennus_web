import { AppWindow, ChartBar, ChartLine, Globe, Users } from "lucide-react"
import type React from "react"
import { useEffect, useState } from "react"

const profileImage = (await import("../../../assets/bg.png")).default
const innovImage = (await import("../../../assets/innov 2.png")).default

const tokenizationIcon = (await import("../../../assets/token.png")).default
const dappsIcon = (await import("../../../assets/dapps.png")).default
const daoIcon = (await import("../../../assets/dao.png")).default
const citizenshipIcon = (await import("../../../assets/citizen.png")).default
const jobsImage = (await import("../../../assets/jobs.png")).default
const logo =  (await import("../../../assets/vlogosm.png")).default

const HomePageI:React.FC = ()=>{

    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
    const handleScroll = () => {
        // Get the height of your hero section.
        // You might need to adjust this value or get it dynamically
        // based on your hero section's actual height.
        const heroSectionHeight = window.innerHeight * 0.8; // Example: 80% of viewport height
        if (window.scrollY > heroSectionHeight) {
        setIsScrolled(true);
        } else {
        setIsScrolled(false);
        }
    };

    window.addEventListener('scroll', handleScroll);

    // Clean up the event listener when the component unmounts
    return () => {
        window.removeEventListener('scroll', handleScroll);
    };
    }, []);
    return (
        <div className="w-full min-h-screen-safe overflow-x-hidden">
            <nav className={`fixed w-full z-50 top-0 ${isScrolled? 'bg-white shadow-md text-primary'
          : 'bg-white text-white'}`}>
                <div className="flex flex-row items-start justify-between px-2 py-1">
                    <div className="flex justify-center items-center flex-row p-3">
                        <div><img className="w-10 h-5 object-contain" src={logo}/></div>
                        <div><text className="font-inter text-2xl font-bold text-primary">Vhennus</text></div>
                        
                    </div>
                </div>
            </nav>
            <main>
                <section className="relative h-screen max-h-[700px] w-full">

                
                <img
                src={profileImage}
                alt="Hero Background"
                // Classes to make the image cover the container
                className="absolute inset-0 h-full w-full object-cover"
                />

               
                <div className="absolute inset-0 bg-black opacity-40"></div>
                
               
                <div className="relative w-full z-10 flex h-full items-center  p-4">
                <div className="text-center text-white max-w-3xl">
                    
                    
                    <h1 className="font-inter text-4xl text-start sm:text-6xl md:text-7xl font-extrabold leading-tight tracking-tight mb-4">
                    Vhennus Digital Nation
                    </h1>
                
                    <p className="font-inter text-xl text-start sm:text-2xl mb-8 font-light">
                    Bringing like minded people to create a new civilization
                    </p>
                    
                   
                    {/* <button className="px-8 py-3 bg-indigo-600 text-white text-lg font-semibold rounded-full 
                                        hover:bg-indigo-700 transition duration-300 shadow-xl">
                    Download
                    </button> */}
                </div>
                </div>
                </section>
                <section>
                    <div className="flex flex-col px-10 lg:px-60 md:px-30 items-start space-y-5
                    lg:py-30 md:py-20 sm:py-10 py-10
                    ">
                        <text className="text-lg font-inter">Vhennus Mission</text>
                        <text className="font-inter lg:text-5xl md:text-3xl text-2xl lg:leading-15 font-bold text-primary text-start">To build a new civilization first digitally, and then physically.
                            A place where our citizens are enabled to be creative, healthy and happy. 
                        </text>
                        <text className="font-inter lg:text-2xl text-lg font-normal text-start">We will provide our citizens with jobs, business financing, research financing, healthcare and other critical infrastructure. </text>
                    </div>
                </section>
                <section>
                    <div className="w-full md:h-150 lg:h-200 lg:p-30 md:p-20 sm:p-10 p-10">
                        <img src={innovImage} className="object-cover w-full h-full"/>
                    </div>
                </section>

              
                <section>
                     <div className="flex flex-col items-center justify-center  space-y-10">
                        <div className="p-5"><text className="font-inter lg:text-5xl md:text-4xl text-3xl font-bold">The Vhennus Blockchain</text></div>
                        <div className="w-full items-center grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-8 lg:px-60 md:px-20 sm:px-10 px-10
                        ">
                            <div className="flex flex-col items-start space-y-5 ">
                                {/* <img src={tokenizationIcon} className="object-cover "/> */}
                                <ChartLine className="w-20 h-20"/>
                                <text className="font-inter text-2xl font-bold">Tokenization</text>
                                <text className="font-inter text-lg text-start font-normal ">Our blockchain helps people and organizations tokenize their real world assets and trade these assets on our decentralized exchange.</text>
                            </div>
                            <div className="flex flex-col items-start space-y-5">
                                {/* <img src={citizenshipIcon} className="object-cover w-full h-full"/> */}
                                <Users className="w-20 h-20"/>
                                <text className="font-inter text-2xl font-bold">Citizenship</text>
                                <text className="font-inter text-lg text-start font-normal">
                                    Any one from all over the world can become citizens of our ecosystem and enjoy the benefits of beign a loyal member of our new civilization
                                </text>
                            </div>
                            <div className="flex flex-col items-start space-y-5">
                                {/* <img src={daoIcon} className="object-cover w-full h-full"/> */}
                                <Globe className="w-20 h-20"/>
                                <text className="font-inter text-2xl font-bold">DAOs</text>
                                <text className="font-inter text-lg text-start font-normal">
                                    We are giving teams and organizations to create decentralized autonomous organizations on
                                    the vhennus blockchain
                                </text>
                            </div>
                            <div className="flex flex-col items-start space-y-5">
                                {/* <img src={dappsIcon} className="object-cover w-full h-full"/> */}
                                <AppWindow className="w-20 h-20"/>
                                <text className="font-inter text-2xl font-bold">dApps</text>
                                <text className="font-inter text-lg text-start font-normal">
                                    Developers can build visual applications that runs in our software ecosystem
                                </text>
                            </div>
                            <div className="flex flex-col items-start space-y-5">
                                {/* <img src={capitalMarketsIcon} className="object-cover w-full h-full"/> */}
                                <ChartBar className="w-20 h-20" />
                                <text className="font-inter text-2xl font-bold">Capital Markets</text>
                                <text className="font-inter text-lg text-start font-normal">
                                    Companies can sell tokenized shares on our exchange
                                </text>
                            </div>
                        </div>
                    </div>
                </section>


                <section className="px-10 lg:px-30 md:px-30 items-start space-y-5
                    lg:py-30 md:py-20 sm:py-10 py-10">
                    <div className="flex flex-col items-start w-full space-y-10">
                        <div className="p-20" ><text className="font-inter text-4xl font-bold">Our Responsibility To Our Citizens</text></div>
                        <div className="flex flex-row space-x-40">
                            <img src={jobsImage} className="w-150 h-100 object-cover"/>
                            <div className="flex flex-col space-y-5 items-start">
                                <div><text className="font-inter text-3xl font-bold text-start">Job Creation</text></div>
                                <div className="text-start">
                                    <text className="font-inter text-lg font-normal">
                                        We will provide jobs to our citizens through our various projects and initiatives.
                                        We will also provide training and education to help our citizens develop the skills they need to succeed in the new economy.
                                    </text>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>


            </main>
        </div>
    )
}

export default HomePageI