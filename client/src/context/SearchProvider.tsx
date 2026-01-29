import { useEffect, useRef } from "react";
import { SearchContext } from "./SearchContext";

export function SearchProvider({ children }: { children: React.ReactNode }) {
    const activeInputRef = useRef<HTMLInputElement | null>(null);

    const register = (el: HTMLInputElement | null) => {
        activeInputRef.current = el;
    };

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            const isMac = navigator.platform.toUpperCase().includes("MAC");

            if (
                (isMac && e.metaKey && e.key.toLowerCase() === "k") ||
                (!isMac && e.ctrlKey && e.key.toLowerCase() === "k")
            ) {
                e.preventDefault();
                activeInputRef.current?.focus();
                activeInputRef.current?.select();
            }
            if (e.key === "Escape") {
                if (document.activeElement === activeInputRef.current) {
                    activeInputRef.current?.blur();
                }
            }
        }

        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, []);

    return (
        <SearchContext.Provider value={{ register }}>
            {children}
        </SearchContext.Provider>
    );
}

