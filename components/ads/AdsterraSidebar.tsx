'use client';

import Script from 'next/script';

export default function AdsterraSidebar() {
  return (
    <div className="glass rounded-2xl border border-[color:var(--white-05)] overflow-hidden">
      <div className="px-4 pt-3 text-center">
        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[color:var(--text-secondary)]">
          Advertisement
        </p>
      </div>

      <div className="flex justify-center px-4 pb-4 pt-2">
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
    </div>
  );
}
