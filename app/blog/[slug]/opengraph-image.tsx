import { ImageResponse } from 'next/og';
import { getBlogPost } from '@/lib/blog';

export const size = {
  height: 630,
  width: 1200,
};

export const contentType = 'image/png';

type BlogOgImageProps = {
  params: Promise<{ slug: string }>;
};

export default async function BlogOgImage({ params }: BlogOgImageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  return new ImageResponse(
    (
      <div
        style={{
          alignItems: 'stretch',
          background: '#f2f2f2',
          color: '#111111',
          display: 'flex',
          height: '100%',
          padding: '52px',
          width: '100%',
        }}
      >
        <div
          style={{
            border: '1px solid rgba(17, 17, 17, 0.16)',
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '44px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div
              style={{
                display: 'flex',
                fontSize: 22,
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
              }}
            >
              Vyarah AI BuildDesk
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: 24,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#6f6f6f',
              }}
            >
              {post?.category ?? 'BuildDesk Blog'}
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: 72,
                fontWeight: 700,
                letterSpacing: '-0.06em',
                lineHeight: 0.94,
                maxWidth: 920,
              }}
            >
              {post?.title ?? 'BuildDesk Blog'}
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
                fontSize: 24,
                color: '#6f6f6f',
              }}
            >
              Structured answers for Indian professional questions
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: 24,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
              }}
            >
              upayiq.tech
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
