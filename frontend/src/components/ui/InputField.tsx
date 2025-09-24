import type React from "react";

interface InputFieldProps {
  label: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InputField = ({
  label,
  type = "text",
  placeholder = "",
  value,
  onChange,
}: InputFieldProps) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label
        htmlFor={label.replace(/\s+/g, "-").toLowerCase()}
        className="text-sm font-medium text-gray-800"
      >
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-600 text-gray-800 text-sm sm:text-base"
      />
    </div>
  );
};
