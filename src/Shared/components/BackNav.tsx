import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface BackNavProp {
    title?: string;
    className?: string;
}

const BackNav: React.FC<BackNavProp> = ({ title, className = "" }) => {
    const navigate = useNavigate();
    
    return (
        <nav className={`sticky top-0 z-50 flex items-center w-full h-14 px-4 bg-white border-b border-gray-100 ${className}`}>
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-50 transition-colors"
                aria-label="Go back"
            >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            
            {/* Title */}
            {title && (
                <div className="ml-3">
                    <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
                </div>
            )}
        </nav>
    );
};

export default BackNav;