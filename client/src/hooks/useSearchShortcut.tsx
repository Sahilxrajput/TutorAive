import { SearchContext } from "@/context/SearchContext";
import { useContext } from "react";

export function useSearchShortcut() {
    const ctx = useContext(SearchContext);
    if (!ctx) {
        throw new Error("useSearchShortcut must be used inside SearchProvider");
    }
    return ctx;
}
