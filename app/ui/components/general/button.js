import React from 'react';
import clsx from 'clsx';

export default function Button({ children, type, disabled, onclick, variant = 'default', className = '', ...props }) {
    const base = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors cursor-pointer';
    const variants = {
        default: 'bg-black text-white hover:bg-gray-900',
        outline: 'border border-gray-300 text-gray-700 hover:bg-gray-100'
    };
    const padding = 'px-6 py-3 text-base';

    return (
        <button
            onClick={onclick}
            type={type}
            disabled={disabled}
            className={clsx(base, variants[variant], padding, className)}
            {...props}
        >
            {children}
        </button>
    );
}
