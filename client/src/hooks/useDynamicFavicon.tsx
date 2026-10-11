// src/hooks/useDynamicFavicon.js
import { useEffect } from 'react';

export function useDynamicFavicon(theme: string) {
    useEffect(() => {
        let faviconTag = document.querySelector("link[rel='icon']");

        if (!faviconTag) {
            faviconTag = document.createElement('link');
            faviconTag.rel = 'icon';
            document.head.appendChild(faviconTag);
        }

        faviconTag.href = theme === 'dark' ? '/logo-dark.png' : '/logo-light.png';
    }, [theme]);
}