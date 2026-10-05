import { Eye, EyeOff } from 'lucide-react'
import { useState, type ChangeEvent, type FocusEvent, type ReactNode } from 'react'

interface AppInputProps {
  label?: string
  value: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  type?: string
  autoComplete?: string
  name?: string
  id?: string
  disabled?: boolean
  error?: string
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void
  className?: string
  required?: boolean
  rightElement?: ReactNode
}

export default function AppInput({
  label,
  value,
  onChange,
  placeholder = '',
  type = 'text',
  autoComplete,
  name,
  id,
  disabled = false,
  error,
  onBlur,
  className = '',
  required = false,
  rightElement,
}: AppInputProps) {
  const [visible, setVisible] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword && visible ? 'text' : type
  const inputId = id || name || undefined
  const hasRightSlot = isPassword || !!rightElement

  return (
    <div className={`block text-left ${className}`}>
      {label && (
        <label htmlFor={inputId} className="mb-2 block text-left text-sm font-medium text-[#0A1931]">
          {label}
        </label>
      )}
      <span className="relative block">
        <input
          id={inputId}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          required={required}
          aria-invalid={!!error}
          className={`h-14 w-full rounded-none border bg-white px-4 text-base text-[#0A1931] outline-none transition-colors placeholder:text-[#6b7180] focus:border-[#CC5A2A] focus:ring-1 focus:ring-[#CC5A2A] disabled:cursor-not-allowed disabled:opacity-60 ${hasRightSlot ? 'pr-12' : ''} ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-[#0A1931]/25'}`}
        />
        {isPassword ? (
          <button
            type="button"
            onClick={() => setVisible(!visible)}
            disabled={disabled}
            className="absolute inset-y-0 right-0 grid w-12 place-items-center text-[#4d5666] hover:text-[#CC5A2A] disabled:opacity-50"
            aria-label={visible ? 'Hide password' : 'Show password'}
          >
            {visible ? <EyeOff size={19} /> : <Eye size={19} />}
          </button>
        ) : (
          rightElement && <span className="absolute inset-y-0 right-0 flex items-center">{rightElement}</span>
        )}
      </span>
      {error && <p className="mt-2 text-left text-sm text-red-600">{error}</p>}
    </div>
  )
}
