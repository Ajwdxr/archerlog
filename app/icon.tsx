import { ImageResponse } from 'next/og';

export const size = {
  width: 48,
  height: 48,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1f3f1b 0%, #0d0d0d 100%)',
          borderRadius: 12,
          border: '1.5px solid rgba(196, 167, 125, 0.4)',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: 32,
            height: 32,
            borderRadius: '50%',
            border: '1px solid rgba(196, 167, 125, 0.25)',
          }}
        />
        <div
          style={{
            fontSize: 26,
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
