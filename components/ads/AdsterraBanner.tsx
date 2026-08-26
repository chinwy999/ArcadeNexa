'use client';

import Script from 'next/script';

export default function AdsterraBanner() {
  return (
    <div className="my-6 flex w-full justify-center overflow-hidden">
      <div style={{ width: 320, height: 50, maxWidth: '100%' }}>
        <Script id="adsterra-320x50-options" strategy="afterInteractive">
          {`
            atOptions = {
              'key': '7dd2d4ae43c11143d5552ffbeea9e58e',
              'format': 'iframe',
              'height': 50,
              'width': 320,
              'params': {}
            };
          `}
        </Script>

        <Script
          src="https://www.highrevenueformat.com/7dd2d4ae43c11143d5552ffbeea9e58e/invoke.js"
          strategy="afterInteractive"
        />
      </div>
    </div>
  );
}
