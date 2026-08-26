'use client';

import Script from 'next/script';

export default function AdsterraBanner() {
  return (
    <div className="my-6 flex w-full justify-center overflow-hidden">
      <div
        style={{
          width: '320px',
          height: '50px',
          maxWidth: '100%',
        }}
      >
        <Script
          src="https://pl31045270.profitableratecpmnetwork.com/a1/dd/b8/a1ddb888e0b6ea30ae8110f682aa63d0.js"
          strategy="afterInteractive"
        />

        <Script
          src="https://pl31045271.profitableratecpmnetwork.com/a7/fa/9c/a7fa9c78b482be0b1d03715f54273f58.js"
          strategy="afterInteractive"
        />

        <Script
          id="adsterra-options"
          strategy="afterInteractive"
        >{`
          atOptions = {
            'key' : '7dd2d4ae43c11143d5552ffbeea9e58e',
            'format' : 'iframe',
            'height' : 50,
            'width' : 320,
            'params' : {}
          };
        `}</Script>

        <Script
          src="https://www.highrevenueformat.com/7dd2d4ae43c11143d5552ffbeea9e58e/invoke.js"
          strategy="afterInteractive"
        />
      </div>
    </div>
  );
}
