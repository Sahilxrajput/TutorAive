import { Spacer } from "@/components/tiptap-ui-primitive/spacer"
import { ToolbarGroup, ToolbarSeparator } from "@/components/tiptap-ui-primitive/toolbar"
import { BlockquoteButton } from "@/components/tiptap-ui/blockquote-button"
import { CodeBlockButton } from "@/components/tiptap-ui/code-block-button"
import { ColorHighlightPopover, ColorHighlightPopoverButton } from "@/components/tiptap-ui/color-highlight-popover"
import { HeadingDropdownMenu } from "@/components/tiptap-ui/heading-dropdown-menu"
import { ImageUploadButton } from "@/components/tiptap-ui/image-upload-button"
import { LinkButton, LinkPopover } from "@/components/tiptap-ui/link-popover"
import { ListDropdownMenu } from "@/components/tiptap-ui/list-dropdown-menu"
import { MarkButton } from "@/components/tiptap-ui/mark-button"
import { TextAlignButton } from "@/components/tiptap-ui/text-align-button"
import { UndoRedoButton } from "@/components/tiptap-ui/undo-redo-button"
import { Input } from "@/components/ui/input"
import { Save } from "lucide-react"
import type { Dispatch, SetStateAction } from "react"


interface Props {
    onHighlighterClick: () => void
    onLinkClick: () => void
    isMobile: boolean,
    noteTitle: string,
    onComplete?: () => void
    setNoteTitle: Dispatch<SetStateAction<string>>,
}

export default function MainToolbarContent({
    onHighlighterClick,
    onLinkClick,
    isMobile,
    setNoteTitle,
    noteTitle,
    onComplete
}: Props) {
    return (
        <div className={"fixed flex items-center bg-background w-full top-0"}>
            <Input
                className="w-2xs font-semibold "
                placeholder="Enter Note Title"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
            />
            <Spacer size={"25px"} />

            <ToolbarGroup>
                <UndoRedoButton action="undo" />
                <UndoRedoButton action="redo" />
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup>
                <HeadingDropdownMenu levels={[1, 2, 3, 4]} portal={isMobile} />
                <ListDropdownMenu
                    types={["bulletList", "orderedList", "taskList"]}
                    portal={isMobile}
                />
                <BlockquoteButton />
                <CodeBlockButton />
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup>
                <MarkButton type="bold" />
                <MarkButton type="italic" />
                <MarkButton type="strike" />
                <MarkButton type="code" />
                <MarkButton type="underline" />
                {!isMobile ? (
                    <ColorHighlightPopover />
                ) : (
                    <ColorHighlightPopoverButton onClick={onHighlighterClick} />
                )}
                {!isMobile ? <LinkPopover /> : <LinkButton onClick={onLinkClick} />}
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup>
                <MarkButton type="superscript" />
                <MarkButton type="subscript" />
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup>
                <TextAlignButton align="left" />
                <TextAlignButton align="center" />
                <TextAlignButton align="right" />
                <TextAlignButton align="justify" />
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup>
                <ImageUploadButton text="Add" />
            </ToolbarGroup>
            <ToolbarSeparator />

            <button
                onClick={() => onComplete?.()}
                className="rounded-full aspect-square w-16 flex items-center justify-center text-blue-500">

                <Save />
            </button>

            <Spacer />

            {isMobile && <ToolbarSeparator />}



            {/* <ToolbarGroup>
        <ThemeToggle />
      </ToolbarGroup> */}
        </div>
    )
}
