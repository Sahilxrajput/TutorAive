import { useEffect, useRef, useState } from "react"
import { EditorContent, EditorContext, useEditor } from "@tiptap/react"

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit"
import { Image } from "@tiptap/extension-image"
import { TaskItem, TaskList } from "@tiptap/extension-list"
import { TextAlign } from "@tiptap/extension-text-align"
import { Typography } from "@tiptap/extension-typography"
import { Highlight } from "@tiptap/extension-highlight"
import { Subscript } from "@tiptap/extension-subscript"
import { Superscript } from "@tiptap/extension-superscript"
import { Selection } from "@tiptap/extensions"

// --- UI Primitives ---
import { Toolbar } from "@/components/tiptap-ui-primitive/toolbar"

// --- Tiptap Node ---
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension"
import { HorizontalRule } from "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension"
import "@/components/tiptap-node/blockquote-node/blockquote-node.scss"
import "@/components/tiptap-node/code-block-node/code-block-node.scss"
import "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss"
import "@/components/tiptap-node/list-node/list-node.scss"
import "@/components/tiptap-node/image-node/image-node.scss"
import "@/components/tiptap-node/heading-node/heading-node.scss"
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss"

// --- Hooks ---
import { useIsBreakpoint } from "@/hooks/use-is-breakpoint"
import { useWindowSize } from "@/hooks/use-window-size"
import { useCursorVisibility } from "@/hooks/use-cursor-visibility"

// --- Components ---
import { ThemeToggle } from "@/components/tiptap-templates/simple/theme-toggle"

// --- Lib ---
import { handleImageUpload, MAX_FILE_SIZE } from "@/lib/tiptap-utils"

// --- Styles ---
import "@/components/tiptap-templates/simple/simple-editor.scss"

import API from "@/lib/api"
import { toast } from "sonner"
import { Save } from "lucide-react"
import { AlertConfirmDialog } from "@/components/AlertConfirmDialog"
import MobileToolbarContent from "./main-toolbar"
import MainToolbarContent from "./main-toolbar-content"
import { useSaveNote } from "@/tanStack/hooks/useNotes"



export function SimpleEditor() {
  const isMobile = useIsBreakpoint()
  const { height } = useWindowSize()
  const [alertOpen, setAlertOpen] = useState<boolean>(false)
  const [mobileView, setMobileView] = useState<"main" | "highlighter" | "link">("main")
  const toolbarRef = useRef<HTMLDivElement>(null)


  const editor = useEditor({
    immediatelyRender: false,
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Main content area, start typing to enter text.",
        class: "simple-editor",
      },
    },
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        link: {
          openOnClick: false,
          enableClickSelection: true,
        },
      }),
      HorizontalRule,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image,
      Typography,
      Superscript,
      Subscript,
      Selection,
      ImageUploadNode.configure({
        accept: "image/*",
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: handleImageUpload,
        onError: (error) => console.error("Upload failed:", error),
      }),
    ],
    // content,
  })

  const rect = useCursorVisibility({
    editor,
    overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0,
  })
  const saveNote = useSaveNote();

  //@issue
  const saveNotesHandler = async () => {
    const content = editor?.getJSON()
    const formData = new FormData()
    formData.append("content", JSON.stringify(content ?? {}))
    formData.append("title", title)
    saveNote.mutate(formData)
  }

  useEffect(() => {
    if (!isMobile && mobileView !== "main") {
      setMobileView("main")
    }
  }, [isMobile, mobileView])

  const [title, setTitle] = useState("New Document")

  return (
    // <div className="simple-editor-wrapper">
    <div>
      <EditorContext.Provider value={{ editor }}>
        <Toolbar
          ref={toolbarRef}
          style={{
            ...(isMobile
              ? {
                bottom: `calc(100% - ${height - rect.y}px)`,
              }
              : {}),
          }}
        >
          {mobileView === "main" ? (
            <MainToolbarContent
              setNoteTitle={setTitle}
              noteTitle={title}
              onHighlighterClick={() => setMobileView("highlighter")}
              onLinkClick={() => setMobileView("link")}
              isMobile={isMobile}
              openAlert={() => setAlertOpen(true)}
            />
          ) : (
            <MobileToolbarContent
              type={mobileView === "highlighter" ? "highlighter" : "link"}
              onBack={() => setMobileView("main")}
            />
          )}
        </Toolbar>



        <EditorContent
          editor={editor}
          role="presentation"
          className="simple-editor-content"
        />
      </EditorContext.Provider>
      <AlertConfirmDialog
        Icon={Save}
        open={alertOpen}
        onOpenChange={setAlertOpen}
        confirmText="save"
        cancelText="cancel"
        description=" &#9888; only save once, as many times you save this note as many copies will be created"
        onConfirm={saveNotesHandler}
        cn="text-red-600"
      />

    </div>
  )
}
