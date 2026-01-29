import { createContext } from "react";

type SearchContextType = {
    register: (el: HTMLInputElement | null) => void;
};

export const SearchContext = createContext<SearchContextType | null>(null);

