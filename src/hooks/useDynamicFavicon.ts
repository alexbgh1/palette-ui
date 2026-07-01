import { useEffect } from "react";
import { stripHash } from "../lib/color";

/**
 *
 * Dynamic favicon hook that updates the favicon color based on the provided hex color.
 *
 */
export function useDynamicFavicon(hexColor: string) {
  useEffect(() => {
    if (!hexColor) return;

    const cleanHex = stripHash(hexColor);

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
        <rect width="32" height="32" rx="8" fill="%23${cleanHex}" />
      </svg>
    `.trim();

    const faviconUrl = `data:image/svg+xml;utf8,${svg}`;

    let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }

    link.href = faviconUrl;
  }, [hexColor]);
}
