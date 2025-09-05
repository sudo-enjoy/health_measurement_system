import React from 'react';

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  required?: boolean;
  description?: string;
}

export default function FormField({ label, children, required = false, description }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {description && (
        <p className="text-sm text-gray-500">{description}</p>
      )}
    </div>
  );
}