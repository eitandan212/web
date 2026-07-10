import React from 'react';

type P = React.SVGProps<SVGSVGElement>;

const base = (props: P): P => ({
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  width: 24,
  height: 24,
  ...props,
});

export const HomeIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M3 9.5 12 3l9 6.5" />
    <path d="M5 10v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V10" />
  </svg>
);

export const CameraIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 8a2 2 0 0 1 2-2h1.5l1-2h7l1 2H18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
    <circle cx="12" cy="13" r="3.5" />
  </svg>
);

export const GalleryIcon = (p: P) => (
  <svg {...base(p)}>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <circle cx="8.5" cy="9.5" r="1.75" fill="currentColor" stroke="none" />
    <path d="m4 17 5-5 3.5 3.5L16 12l4 5" />
  </svg>
);

export const SparkleIcon = (p: P) => (
  <svg {...base(p)} fill="currentColor" stroke="none">
    <path d="M12 2.5c.4 3.3 1 5.4 2.1 6.6 1.2 1.2 3.3 1.8 6.6 2.1-3.3.4-5.4 1-6.6 2.1-1.2 1.2-1.8 3.3-2.1 6.6-.4-3.3-1-5.4-2.1-6.6-1.2-1.2-3.3-1.8-6.6-2.1 3.3-.4 5.4-1 6.6-2.1 1.2-1.2 1.8-3.3 2.1-6.6Z" />
  </svg>
);

export const FlameIcon = (p: P) => (
  <svg {...base(p)} fill="currentColor" stroke="none">
    <path d="M12 2c1 3-2.5 3.8-2.5 7 0 1.5 1 2.5 2 2.5.5 0 1-.3 1-1 0-.6-.4-.7-.4-1.5 0-1 1.4-1.6 1.9-3 1.6 1.6 3 4 3 6.5 0 3.6-3 6.5-6.5 6.5S4 17.6 4 14c0-4 3-7 4.5-9 .5 1 .8 2 .8 3 0 1-.3 1.5-.3 2 0-1.5.6-3 1-4.5C10.5 4 11 3 12 2Z" />
  </svg>
);

export const UserIcon = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="8" r="3.5" />
    <path d="M4.5 20c1.4-3.4 4.3-5.5 7.5-5.5s6.1 2.1 7.5 5.5" />
  </svg>
);

export const ClockIcon = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);

export const ChevronLeftIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="m15 6-6 6 6 6" />
  </svg>
);

export const CheckIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="m5 13 4.5 4.5L19 8" />
  </svg>
);

export const StarIcon = ({ filled, ...p }: P & { filled?: boolean }) => (
  <svg {...base(p)} fill={filled ? 'currentColor' : 'none'}>
    <path d="m12 3 2.7 5.9 6.3.7-4.7 4.4 1.2 6.3-5.5-3.1-5.5 3.1 1.2-6.3-4.7-4.4 6.3-.7Z" />
  </svg>
);

export const XIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);
