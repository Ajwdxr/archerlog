'use client';

import { QRCodeSVG } from 'qrcode.react';

interface Props {
  value: string;
  joinCode: string;
}

export default function QRDisplay({ value, joinCode }: Props) {
  return (
    <div className="flex flex-col items-center">
      <div className="p-6 bg-white rounded-3xl shadow-2xl shadow-black/40">
        <QRCodeSVG
          value={value}
          size={240}
          bgColor="#ffffff"
          fgColor="#1a1a1a"
          level="M"
          marginSize={0}
        />
      </div>

      {/* Join Code */}
      <div className="mt-5 px-5 py-2.5 rounded-xl bg-charcoal-800 border border-charcoal-700">
        <p className="text-xs text-sand-300/40 text-center mb-1">Session Code</p>
        <p className="text-2xl font-mono font-bold text-sand-400 tracking-[0.3em] text-center">
          {joinCode}
        </p>
      </div>
    </div>
  );
}
