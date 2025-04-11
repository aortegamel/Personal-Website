import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'solid' | 'ghost';
  inputSize?: 'default' | 'sm' | 'lg';
}

const inputVariants = (props: { 
  variant?: 'default' | 'solid' | 'ghost', 
  inputSize?: 'default' | 'sm' | 'lg' 
}) => {
  const { variant = 'default', inputSize = 'default' } = props;

  const variantClasses = {
    default: 'border border-gray-300 focus:ring-2 focus:ring-blue-500',
    solid: 'bg-gray-100 border-transparent',
    ghost: 'border-none bg-transparent'
  };

  const sizeClasses = {
    default: 'px-4 py-2 text-base',
    sm: 'px-3 py-1 text-sm',
    lg: 'px-5 py-3 text-lg'
  };

  return cn(
    'w-full rounded-md focus:outline-none',
    variantClasses[variant],
    sizeClasses[inputSize]
  );
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, inputSize, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(inputVariants({ variant, inputSize }), className)}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export default Input;
