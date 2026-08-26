'use client';

import Script from 'next/script';

export default function AdsterraBanner() {
  return (
    <div className="w-full px-3 sm:px-4">
      <div className="mx-auto my-6 flex min-h-[70px] w-full max-w-4xl items-center justify-center overflow-hidden rounded-lg">
        <div
          className="flex h-[50px] w-[320px] max-w-full items-center justify-center"
        >
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
    </div>
  );
}
