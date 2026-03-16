import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'DataPM — AI-powered PMO document generation';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0B0514 0%, #1A0B2E 50%, #0B0514 100%)',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Accent glow - lime */}
        <div
          style={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600,
            height: 300,
            background: 'radial-gradient(ellipse, rgba(198, 241, 53, 0.12) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />
        {/* Rose glow */}
        <div
          style={{
            position: 'absolute',
            bottom: '20%',
            right: '20%',
            width: 300,
            height: 200,
            background: 'radial-gradient(ellipse, rgba(255, 77, 141, 0.1) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />
        {/* Logo text */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              border: '2px solid #C6F135',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              color: '#C6F135',
              fontWeight: 800,
            }}
          >
            D
          </div>
          <span style={{ fontSize: 48, fontWeight: 800, letterSpacing: -1 }}>
            <span style={{ color: '#C6F135' }}>Data</span>
            <span style={{ color: '#F5F0FF' }}>PM</span>
          </span>
        </div>
        {/* Headline */}
        <div
          style={{
            fontSize: 52,
            fontWeight: 800,
            color: '#F5F0FF',
            textAlign: 'center',
            lineHeight: 1.1,
            maxWidth: 800,
            marginBottom: 20,
          }}
        >
          Stop writing project docs from scratch
        </div>
        {/* Sub */}
        <div
          style={{
            fontSize: 22,
            color: '#B8A5D4',
            textAlign: 'center',
            maxWidth: 600,
          }}
        >
          Generate professional PMO artifacts in seconds
        </div>
      </div>
    ),
    { ...size }
  );
}
