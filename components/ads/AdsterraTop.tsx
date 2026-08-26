'use client';

import Script from 'next/script';

export default function AdsterraTop() {
  return (
    <div className="w-full px-3 sm:px-4">
      <div className="mx-auto my-5 flex min-h-[90px] w-full items-center justify-center overflow-hidden">
        <div className="flex h-[90px] w-full max-w-[728px] items-center justify-center">
          <Script
            id="adsterra-desktop-728x90-options"
            strategy="afterInteractive"
          >
            {`
              atOptions = {
                'key': 'f13d3677e8c7d620f4f19e175fdc9782',
                'format': 'iframe',
                'height': 90,
                'width': 728,
                'params': {}
              };
            `}
          </Script>

          <Script
            src="https://www.highrevenueformat.com/f13d3677e8c7d620f4f19e175fdc9782/invoke.js"
            strategy="afterInteractive"
          />
        </div>
      </div>
    </div>
  );
}
