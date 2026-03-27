import { ImageResponse } from 'next/og';

export const size = {
  width: 180,
  height: 180,
};

export const contentType = 'image/png';

function AppleBrandIcon() {
  return (
    <svg
      width="140"
      height="140"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="apple-bg" x1="8" y1="8" x2="92" y2="92" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#2C2B28" />
          <stop offset="0.55" stopColor="#171614" />
          <stop offset="1" stopColor="#090909" />
        </linearGradient>
        <linearGradient id="apple-gold" x1="24" y1="18" x2="78" y2="82" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#F7E3A1" />
          <stop offset="0.48" stopColor="#D9AE44" />
          <stop offset="1" stopColor="#8F6420" />
        </linearGradient>
      </defs>

      <rect x="4" y="4" width="92" height="92" rx="24" fill="url(#apple-bg)" />
      <rect x="4.5" y="4.5" width="91" height="91" rx="23.5" stroke="#443D31" />
      <circle cx="50" cy="50" r="10" fill="#111111" stroke="url(#apple-gold)" strokeWidth="3.5" />
      <circle cx="50" cy="50" r="4" fill="#F7E3A1" />
      <path d="M24 22L34 22L46 52L40 58L24 22Z" fill="url(#apple-gold)" />
      <path d="M74 18L82 26L61 47H71V54L48 76L55 57H45L74 18Z" fill="url(#apple-gold)" />
      <path d="M50 77L42 66H58L50 77Z" fill="url(#apple-gold)" />
      <path
        d="M29 63C35 72 45 77 50 77C55 77 65 72 71 63"
        stroke="url(#apple-gold)"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M36 31C40 27 45 24 50 24C55 24 60 27 64 31"
        stroke="url(#apple-gold)"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: 'center',
          background: '#0d0d0c',
          display: 'flex',
          height: '100%',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <AppleBrandIcon />
      </div>
    ),
    size
  );
}
