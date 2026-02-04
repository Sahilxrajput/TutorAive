import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import { useEffect, useState } from 'react'

export const ThemeToggle = () => {
    const [isDark, setIsDark] = useState(
        () => document.documentElement.classList.contains('dark')
    )

    useEffect(() => {
        const root = window.document.documentElement
        if (isDark) {
            root.classList.add('dark')
            localStorage.setItem('theme', 'dark')
        } else {
            root.classList.remove('dark')
            localStorage.setItem('theme', 'light')
        }
    }, [isDark])

    return (
        <button
            onClick={() => setIsDark(!isDark)}
            className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-primary/10 hover:bg-primary/20 transition-colors group overflow-hidden"
            aria-label="Toggle Theme"
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={isDark ? 'dark' : 'light'}
                    initial={{ y: 20, opacity: 0, rotate: 45 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    exit={{ y: -20, opacity: 0, rotate: -45 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                    {isDark ? (
                        <Moon size={20} className="text-primary" />
                    ) : (
                        <Sun size={20} className="text-primary" />
                    )}
                </motion.div>
            </AnimatePresence>
        </button>
    )
}