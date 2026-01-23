import React from 'react';

export const CrucifixIcon = ({ className, size = 24, strokeWidth = 2, color = 'currentColor' }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M12 2v20" />
            <path d="M7 8h10" />
        </svg>
    );
};

export default CrucifixIcon;
