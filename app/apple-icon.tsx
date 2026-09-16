import { ImageResponse } from 'next/og';

export const size = {
  width: 180,
  height: 180,
};
export const contentType = 'image/png';

export default function AppleIcon() {
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
          background: 'linear-gradient(135deg, #161616 0%, #0d0d0d 100%)',
          borderRadius: 42,
          border: '3px solid rgba(196, 167, 125, 0.4)',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: 130,
            height: 130,
            borderRadius: '50%',
            border: '2px solid rgba(196, 167, 125, 0.2)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: 80,
            height: 80,
            borderRadius: '50%',
            border: '2px solid rgba(255, 215, 0, 0.35)',
          }}
        />
        <div
          style={{
            fontSize: 76,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: 'rotate(-45deg)',
          }}
        >
          🏹
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
