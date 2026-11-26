import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement> & { size?: number }

const base = (size = 24, rest: P) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  ...rest,
})

export const ArrowRight = ({ size = 18, ...p }: P) => (
  <svg {...base(size, p)} strokeWidth={2}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)
export const Check = ({ size = 20, ...p }: P) => (
  <svg {...base(size, p)} strokeWidth={2.2}>
    <path d="M4 12l5 5L20 6" />
  </svg>
)
export const Magnifier = ({ size = 28, ...p }: P) => (
  <svg {...base(size, p)} strokeWidth={1.6}>
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-4-4" />
  </svg>
)
export const Mask = ({ size = 30, ...p }: P) => (
  <svg {...base(size, p)} strokeWidth={1.6}>
    <path d="M2 9c0-2 2-3 4-3s3 1 6 1 4-1 6-1 4 1 4 3c0 5-3 8-6 8-2 0-3-2-4-2s-2 2-4 2c-3 0-6-3-6-8z" />
    <circle cx="8" cy="11" r="1.5" />
    <circle cx="16" cy="11" r="1.5" />
  </svg>
)
export const Glass = ({ size = 28, ...p }: P) => (
  <svg {...base(size, p)} strokeWidth={1.6}>
    <path d="M8 3h8l-.5 5a3.5 3.5 0 0 1-7 0z" />
    <path d="M12 12v8M8 21h8" />
  </svg>
)
export const Sparkle = ({ size = 28, ...p }: P) => (
  <svg {...base(size, p)} strokeWidth={1.6}>
    <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />
    <path d="M19 17l.7 1.8 1.8.7-1.8.7L19 22l-.7-1.8-1.8-.7 1.8-.7z" />
  </svg>
)
export const Mail = ({ size = 22, ...p }: P) => (
  <svg {...base(size, p)} strokeWidth={1.6}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 7l9 6 9-6" />
  </svg>
)
export const Pin = ({ size = 22, ...p }: P) => (
  <svg {...base(size, p)} strokeWidth={1.6}>
    <path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z" />
    <circle cx="12" cy="9" r="2.5" />
  </svg>
)
export const Clock = ({ size = 22, ...p }: P) => (
  <svg {...base(size, p)} strokeWidth={1.6}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
)
export const Instagram = ({ size = 22, ...p }: P) => (
  <svg {...base(size, p)} strokeWidth={1.6}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
  </svg>
)
export const Plus = ({ size = 16, ...p }: P) => (
  <svg {...base(size, p)} strokeWidth={2}>
    <path d="M12 5v14M5 12h14" />
  </svg>
)
export const Menu = ({ size = 22, ...p }: P) => (
  <svg {...base(size, p)} strokeWidth={2}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
)
export const Close = ({ size = 22, ...p }: P) => (
  <svg {...base(size, p)} strokeWidth={2}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
)
export const Diamond = ({ color = 'currentColor' }: { color?: string }) => (
  <svg width="14" height="14" viewBox="0 0 10 10" aria-hidden>
    <path d="M5 0l5 5-5 5-5-5z" fill={color} />
  </svg>
)
