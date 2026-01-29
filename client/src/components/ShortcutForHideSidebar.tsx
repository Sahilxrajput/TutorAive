import { Kbd, KbdGroup } from "@/components/ui/kbd"

export function ShortcutForHideSidebar() {
    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center justify-center px-4 text-center">
            <p className="text-muted-foreground text-xs sm:text-sm flex items-center gap-2">
                Toggle sidebar
                <KbdGroup>
                    <Kbd>Ctrl</Kbd>
                    <Kbd>B</Kbd>
                </KbdGroup>
                <span className="hidden sm:inline">or</span>
                <KbdGroup className="hidden sm:flex">
                    <Kbd>⌘</Kbd>
                    <Kbd>B</Kbd>
                </KbdGroup>
            </p>
        </div>
    )
}
