import React from 'react';

interface ProgressProps {
  value: number;
  max?: number;
  label?: string;
  showPercent?: boolean;
  variant?: 'primary' | 'success' | 'warning' | 'danger';
}

const variantStyles = {
  primary: 'bg-blue-500',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  danger: 'bg-red-500',
};

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  label,
  showPercent = true,
  variant = 'primary',
}) => {
  const percent = (value / max) * 100;

  return (
    <div className="mb-4">
      {(label || showPercent) && (
        <div className="flex items-center justify-between mb-2">
          {label && (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {label}
            </span>
          )}
          {showPercent && (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {Math.round(percent)}%
            </span>
          )}
        </div>
      )}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${variantStyles[variant]}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};
