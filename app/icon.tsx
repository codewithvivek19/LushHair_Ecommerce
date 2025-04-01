import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // Icon with the letter "L" for Lush Hair
      <div
        style={{
          fontSize: 24,
          background: '#9333ea', // Purple color
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          borderRadius: '50%',
          fontWeight: 600,
        }}
      >
        L
      </div>
    ),
    {
      ...size,
    }
  )
} 