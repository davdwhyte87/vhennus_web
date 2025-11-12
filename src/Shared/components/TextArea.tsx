// src/components/PostTextArea.tsx (or wherever you keep your components)

import React, { type TextareaHTMLAttributes } from 'react';

// Extend TextareaHTMLAttributes to inherit all standard textarea props
// and add our custom ones.
interface PostTextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string; // Optional label for the textarea
  // `value` and `onChange` are already included from TextareaHTMLAttributes
  // but explicitly defining them helps with clarity and ensuring they are passed.
  // value: string;
  // onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextArea: React.FC<PostTextAreaProps> = ({
  label,
  id, // Destructure id to link with label
  name,
  value,
  onChange,
  placeholder = "What's on your mind?", // Default placeholder
  rows = 5, // Default number of rows
  className = '', // Default to an empty string to safely append Tailwind classes
  ...rest // Capture any other standard textarea props
}) => {
  const generatedId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="mb-4 w-full">
      {label && (
        <label htmlFor={generatedId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <textarea
        id={generatedId}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className={`
          mt-1 block w-full px-3 py-2
          bg-white border border-gray-300 rounded-md shadow-sm
          focus:outline-none focus:ring-indigo-500 focus:border-indigo-500
          sm:text-sm
          resize-y
          ${className}
        `}
        {...rest} // Spread any additional props like `readOnly`, `disabled`, etc.
      />
    </div>
  );
};

export default TextArea;