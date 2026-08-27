'use client';

import Script from 'next/script';

export default function AdsterraSidebar() {
  return (
    <div className="glass rounded-2xl p-4 border border-[color:var(--white-05)] flex justify-center overflow-hidden">
      <div className="relative h-[250px] w-[300px] max-w-full overflow-hidden">
        <Script id="adsterra-300x250-options" strategy="afterInteractive">
          {`
            atOptions = {
              'key': '0824952e84c7701d04e8ecdce1a0c4ee',
              'format': 'iframe',
              'height': 250,
              'width': 300,
              'params': {}
            };
          `}
        </Script>

        <Script
          src="https://www.highrevenueformat.com/0824952e84c7701d04e8ecdce1a0c4ee/invoke.js"
          strategy="afterInteractive"
        />
      </div>
    </div>
  );
}
