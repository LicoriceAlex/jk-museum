import React from 'react';

interface IconProps {
  size?: number;
  color?: string;
  strokeColor?: string;
  className?: string;
}

export const StylesIcon: React.FC<IconProps> = ({ size = 24, color = "#000000", strokeColor, className }) => {
  const actualStrokeColor = strokeColor || color;
  
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg" className={className}>
      <g clipPath="url(#clip0_4418_9584)">
        <g clipPath="url(#clip1_4418_9584)">
          <path d="M21.81 3.93988C20.27 7.77988 16.41 12.9999 13.18 15.5899L11.21 17.1699C10.96 17.3499 10.71 17.5099 10.43 17.6199C10.43 17.4399 10.42 17.2399 10.39 17.0499C10.28 16.2099 9.90002 15.4299 9.23002 14.7599C8.55002 14.0799 7.72002 13.6799 6.87002 13.5699C6.67002 13.5599 6.47002 13.5399 6.27002 13.5599C6.38002 13.2499 6.55002 12.9599 6.76002 12.7199L8.32002 10.7499C10.9 7.51988 16.14 3.63988 19.97 2.10988C20.56 1.88988 21.13 2.04988 21.49 2.41988C21.87 2.78988 22.05 3.35988 21.81 3.93988Z"
                stroke={actualStrokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10.43 17.6208C10.43 18.7208 10.01 19.7708 9.22003 20.5708C8.61003 21.1808 7.78003 21.6008 6.79003 21.7308L4.33003 22.0008C2.99003 22.1508 1.84003 21.0108 2.00003 19.6508L2.27003 17.1908C2.51003 15.0008 4.34003 13.6008 6.28003 13.5608C6.48003 13.5508 6.69003 13.5608 6.88003 13.5708C7.73003 13.6808 8.56003 14.0708 9.24003 14.7608C9.91003 15.4308 10.29 16.2108 10.4 17.0508C10.41 17.2408 10.43 17.4308 10.43 17.6208Z"
                stroke={actualStrokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14.24 14.4702C14.24 11.8602 12.12 9.74023 9.51001 9.74023"
                stroke={actualStrokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M20.12 12.7305L20.86 13.4605C22.35 14.9505 22.35 16.4205 20.86 17.9105L17.9 20.8705C16.43 22.3405 14.94 22.3405 13.47 20.8705"
                stroke={actualStrokeColor} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M3.10995 10.5105C1.63995 9.02055 1.63995 7.55055 3.10995 6.06055L6.06995 3.10055C7.53995 1.63055 9.02995 1.63055 10.4999 3.10055L11.2399 3.84055"
                stroke={actualStrokeColor} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M11.25 3.84961L7.55005 7.54961"
                stroke={actualStrokeColor} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M20.12 12.7305L17.16 15.6805"
                stroke={actualStrokeColor} strokeWidth="1.5" strokeLinecap="round" />
        </g>
      </g>
      <defs>
        <clipPath id="clip0_4418_9584">
          <rect width="24" height="24" fill="white"/>
        </clipPath>
        <clipPath id="clip1_4418_9584">
          <rect width="24" height="24" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
};
