import { ImageResponse } from 'next/og';

export const size = {
  height: 630,
  width: 1200,
};

export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: 'stretch',
          background: '#f2f2f2',
          color: '#111111',
          display: 'flex',
          height: '100%',
          padding: '56px',
          width: '100%',
        }}
      >
        <div
          style={{
            border: '1px solid #d5d0c8',
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '48px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div
              style={{
                display: 'flex',
                fontSize: 22,
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
              }}
            >
              Vyarah AI BuildDesk
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: 88,
                fontWeight: 700,
                letterSpacing: '-0.06em',
                lineHeight: 0.92,
                maxWidth: 820,
              }}
            >
              Structured AI help for Indian professional questions.
            </div>
          </div>

          <div
            style={{
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <div
              style={{
                display: 'flex',
                fontSize: 28,
                gap: '20px',
              }}
            >
              <span>Tax</span>
              <span>Legal</span>
              <span>Medical</span>
              <span>Real Estate</span>
              <span>Business</span>
              <span>Finance</span>
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: 26,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
              }}
            >
              vyarah.com
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
