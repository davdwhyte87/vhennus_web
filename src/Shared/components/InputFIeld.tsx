import { useState } from "react";
import { Eye, EyeOff, AlertCircle, CheckCircle, Loader2, type LucideIcon } from "lucide-react";

interface InputFieldProps {
    id?: string;
    name: string;
    type?: string;
    label?: string;
    value: string;
    placeholder?: string;
    error?: string;
    success?: string;
    disabled?: boolean;
    activeIcon?: React.ReactElement<LucideIcon>;
    inactiveIcon?: React.ReactElement<LucideIcon>;
    showIcon?: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    className?: string;
    isPassword?: boolean;
    icon?: React.ReactElement<LucideIcon>;
    iconClick?: () => void;
    loading?: boolean;
    showSuccess?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
    id,
    name,
    type = 'text',
    value,
    placeholder,
    error,
    success,
    disabled = false,
    activeIcon,
    inactiveIcon,
    showIcon,
    onChange,
    onBlur,
    className = '',
    isPassword = false,
    icon,
    iconClick,
    loading = false,
    showSuccess = false
}) => {
    const inputId = id || name;
    const baseStyle = 'block w-full h-14 rounded-lg border px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 ease-in-out';
    const errorStyles = error
        ? 'border-red-500 focus:ring-red-500 bg-red-50'
        : success
            ? 'border-green-500 focus:ring-green-500'
            : 'border-gray-300 focus:ring-primary focus:border-primary hover:border-gray-400';
    const [toggled, setToggled] = useState(false);
    const [fieldType, setFieldType] = useState<string>(type);

    const handleIconClick = () => {
        const next = !toggled;
        setToggled(next);
        if (isPassword) {
            if (next) {
                setFieldType("text");
            } else {
                setFieldType("password");
            }
        }
        iconClick?.();
    };

    return (
        <div className={`flex flex-col ${className}`}>
            <div className="relative w-full group">
                <input
                    id={inputId}
                    name={name}
                    type={fieldType}
                    value={value}
                    placeholder={placeholder}
                    disabled={disabled}
                    onChange={onChange}
                    onBlur={onBlur}
                    className={`${baseStyle} ${errorStyles} ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-70' : ''} 
                    ${!error && !disabled ? 'hover:shadow-sm' : ''}`}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${inputId}-error` : success ? `${inputId}-success` : undefined}
                />

                {isPassword && (
                    <button
                        type="button"
                        onClick={handleIconClick}
                        disabled={disabled}
                        className="absolute inset-y-0 right-3 flex items-center p-1 text-gray-500 hover:text-gray-700 transition-colors"
                        aria-label={toggled ? "Hide password" : "Show password"}
                    >
                        {toggled ? (activeIcon || <Eye className="h-5 w-5" />) : (inactiveIcon || <EyeOff className="h-5 w-5" />)}
                    </button>
                )}

                {showIcon && (
                    <button
                        type="button"
                        onClick={iconClick}
                        disabled={disabled || loading}
                        className="absolute inset-y-0 right-0 flex items-center p-3 bg-primary text-white rounded-r-lg hover:bg-primary/90 active:bg-primary/80 transition-colors"
                        aria-label="Action button"
                    >
                        {loading ? <Loader2 className="animate-spin h-5 w-5" /> : icon}
                    </button>
                )}

                {showSuccess && success && !error && (
                    <div className="absolute inset-y-0 right-10 flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                )}
            </div>

            {error && (
                <div id={`${inputId}-error`} className="mt-2 flex items-center gap-1 text-sm text-red-600" role="alert">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {success && !error && (
                <div id={`${inputId}-success`} className="mt-2 flex items-center gap-1 text-sm text-green-600">
                    <CheckCircle className="h-4 w-4 flex-shrink-0" />
                    <span>{success}</span>
                </div>
            )}
        </div>
    );
};

export default InputField;