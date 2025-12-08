import {useState} from "react";
import {Loader2, type LucideIcon} from "lucide-react";

interface InputProps {
    id?: string;
    name: string;
    type?: string;
    label?: string;
    value: string;
    placeholder?: string;
    error?: string;
    disabled?: boolean;
    activeIcon?: React.ReactElement<LucideIcon>;
    inactiveIcon?: React.ReactElement<LucideIcon>;
    showIcon?:boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    className?: string;
    isPassword?:boolean;
    icon?:React.ReactElement<LucideIcon>;
    iconClick?:()=>void;
    loading?:boolean;
}

const InputFIeld:React.FC<InputProps> = (
    {
        id,
        name,
        type='text',
        value,
        placeholder,
        error,
        disabled = false,
        activeIcon,
        inactiveIcon,
        showIcon,
        onChange,
        onBlur,
        className='',
        isPassword=false,
        icon,
        iconClick,
        loading=false

    }
) => {
    const inputId = id || name;
    const baseStyle = 'block w-full h-14 rounded-md border px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary'
    const errorStyles = error
        ? 'border-red-500 focus:ring-red-500'
        : 'border-gray-300 focus:ring-primary';
    const [toggled, setToggled] = useState(false);
    const [fieldType, setFieldType] = useState<string>(type);

    const handleIconClick = () => {
        const next = !toggled;
        setToggled(next);
        if (isPassword){
            if(toggled){
                setFieldType("password")
            }else {
                setFieldType("text")
            }
        }
    };
    return (
        <div className={`flex flex-col ${className}`}>
            <div className="relative w-full">
                <input
                    id={inputId}
                    name={name}
                    type={fieldType}
                    value={value}
                    placeholder={placeholder}
                    disabled={disabled}
                    onChange={onChange}
                    onBlur={onBlur}
                    className={`${baseStyle} ${errorStyles} ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                />

                {
                isPassword
                 && (
                    <button
                        type="button"
                        onClick={handleIconClick}
                        disabled={disabled}
                        className="absolute inset-y-0 right-3 flex items-center p-1"
                    >
                        {toggled && activeIcon}
                        {!toggled && inactiveIcon}
                    </button>
                )}

                {showIcon?  
                
                <button
                        type="button"
                        onClick={iconClick}
                        disabled={disabled}
                        className="absolute inset-y-0 right-0 text-white flex items-center p-3 bg-primary   hover:bg-gray-200 active:bg-gray-200"
                    >
                        {loading?   <Loader2 className="animate-spin h-5 w-5" />: icon}
                    </button>: null }
                
            </div>
            {error && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                    {error}
                </p>
            )}
        </div>

    )
}

export default InputFIeld;