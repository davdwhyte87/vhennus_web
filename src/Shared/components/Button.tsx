import {Loader2} from "lucide-react";

interface ButtonProps {
    className?:string;
    children:React.ReactNode;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    disabled?:boolean;
    onClick?:()=>void;
    loading?:boolean;
}
const SIZE_STYLES = {
    sm: 'px-2 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-15 py-3 text-lg',
};
const VARIANT_STYLES = {
    primary: 'bg-primary text-white hover:bg-purple-600 focus:bg-primary',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400',
    outline: 'border border-gray-300 text-gray-800 hover:bg-gray-50 focus:ring-gray-400',
    ghost: 'bg-transparent text-gray-800 hover:bg-gray-100 focus:ring-gray-400',
};
const AppButton:React.FC<ButtonProps> = (
    {
        className='',
        children,
        variant = 'primary',
        size = "lg",
        disabled = false,
        onClick,
        loading=false
    }
) => {
    const variantClasses = VARIANT_STYLES[variant];
    const sizeClasses = SIZE_STYLES[size];
    return (
        <button
            className={`
            inline-flex items-center justify-center
            rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 gap-2
            ${variantClasses} ${sizeClasses}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${className}
          `} disabled={disabled}
            onClick={onClick}
        >
            {loading && (
                <Loader2 className="animate-spin h-5 w-5" />
            )}

            {loading?  <div></div> :children}
            </button>

    )
}

export default AppButton