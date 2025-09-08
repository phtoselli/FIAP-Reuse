"use client";

import { useEffect } from "react";
import Script from "next/script";

export default function Vlibras() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const check = () => {
        if ((window as any).VLibras) {
          new (window as any).VLibras.Widget("https://vlibras.gov.br/app");
        } else {
          setTimeout(check, 300);
        }
      };
      check();
    }
  }, []);

  return (
    <>
      <div vw className="enabled">
        <div vw-access-button className="active"></div>
        <div vw-plugin-wrapper>
          <div className="vw-plugin-top-wrapper"></div>
        </div>
      </div>

      <Script
        src="https://vlibras.gov.br/app/vlibras-plugin.js"
        strategy="afterInteractive"
      />
    </>
  );
}
