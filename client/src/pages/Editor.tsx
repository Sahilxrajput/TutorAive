import React, { useEffect, useState, useRef } from "react";

import { EditorState, Compartment } from "@codemirror/state";
import { html } from "@codemirror/lang-html";
import { javascript } from "@codemirror/lang-javascript";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { python } from "@codemirror/lang-python";
import {
  EditorView,
  keymap,
  highlightSpecialChars,
  drawSelection,
  highlightActiveLine,
  dropCursor,
  rectangularSelection,
  crosshairCursor,
  lineNumbers,
  highlightActiveLineGutter,
  WidgetType,
  Decoration,
} from "@codemirror/view";
import {
  defaultHighlightStyle,
  syntaxHighlighting,
  indentOnInput,
  bracketMatching,
  foldGutter,
  foldKeymap,
} from "@codemirror/language";
import {
  defaultKeymap,
  history,
  historyKeymap,
  redo,
} from "@codemirror/commands";
import { searchKeymap, highlightSelectionMatches } from "@codemirror/search";
import {
  autocompletion,
  completionKeymap,
  closeBrackets,
  closeBracketsKeymap,
} from "@codemirror/autocomplete";
import { lintKeymap } from "@codemirror/lint";
import {
  collab,
  getSyncedVersion,
  sendableUpdates,
  receiveUpdates,
} from "@codemirror/collab";

import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_SOCKET_URL as string); // Replace with your server URL
const userId = crypto.randomUUID();

class RemoteCursorWidget extends WidgetType {
  constructor(readonly userId: string) {
    super();
  }

  toDOM() {
    const cursor = document.createElement("span");
    cursor.className = "remote-cursor";
    cursor.style.borderLeft = "2px solid red";
    cursor.style.marginLeft = "-1px";
    cursor.style.height = "1em";
    cursor.title = `User: ${this.userId}`;
    return cursor;
  }
}

const Editor = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  const updateListener = EditorView.updateListener.of((update) => {
    if (update.docChanged) {
      const doc = update.state.doc.toString();
      socket.emit("code-change", { code: doc, userId });
    }

    if (update.selectionSet) {
      const cursorPos = update.state.selection.main.head;
      socket.emit("cursor-move", { userId, cursorPos });
    }
  });

  useEffect(() => {
    if (!editorRef.current) return;

    const starterCode = "Welcome to online code editor...";

    const state = EditorState.create({
      doc: starterCode,
      extensions: [
        // A line number gutter
        lineNumbers(),
        // A gutter with code folding markers
        foldGutter(),
        // Replace non-printable characters with placeholders
        highlightSpecialChars(),
        // The undo history
        history(),
        // Replace native cursor/selection with our own
        drawSelection(),
        // Show a drop cursor when dragging over the editor
        dropCursor(),
        // Allow multiple cursors/selections
        EditorState.allowMultipleSelections.of(true),
        // Re-indent lines when typing specific input
        indentOnInput(),
        // Highlight syntax with a default style
        syntaxHighlighting(defaultHighlightStyle),
        // Highlight matching brackets near cursor
        bracketMatching(),
        // Automatically close brackets
        closeBrackets(),
        // Load the autocompletion system
        autocompletion(),
        javascript(),
        // Allow alt-drag to select rectangular regions
        rectangularSelection(),
        // Change the cursor to a crosshair when holding alt
        crosshairCursor(),
        // Style the current line specially
        highlightActiveLine(),
        // Style the gutter for current line specially
        highlightActiveLineGutter(),
        // Highlight text that matches the selected text
        highlightSelectionMatches(),
        // updateListener,
        collab(),
        javascript(),
        history(),
        keymap.of([
          // override redo shortcut default(ctrl-y)
          { key: "Mod-Shift-z", run: redo },
          // Closed-brackets aware backspace
          ...closeBracketsKeymap,
          // A large set of basic bindings
          ...defaultKeymap,
          // Search-related keys
          ...searchKeymap,
          // Redo/undo keys
          ...historyKeymap,
          // Code folding bindings
          ...foldKeymap,
          // Autocompletion keys
          ...completionKeymap,
          // Keys related to the linter system
          ...lintKeymap,
        ]),
        updateListener,
      ],
    });

    const view = new EditorView({
      state,
      parent: editorRef.current,
    });

    viewRef.current = view;

    socket.on("code-init", (code: string) => {
      const transaction = view.state.update({
        changes: { from: 0, to: view.state.doc.length, insert: code },
      });
      view.dispatch(transaction);
    });

    socket.on("code-change", ({ code, userId: senderId }) => {
      if (senderId === userId) return;
      
      const currentDoc = view.state.doc.toString();
      if (code === currentDoc) return;

      const transaction = view.state.update({
        changes: { from: 0, to: view.state.doc.length, insert: code },
      });
      console.log("transaction:" + transaction);
      view.dispatch(transaction);
    });

    socket.on("cursor-move", ({ userId: senderId, cursorPos }) => {
      if (senderId === userId || !viewRef.current) return;

      const deco = Decoration.set([
        Decoration.widget({
          widget: new RemoteCursorWidget(senderId),
          side: 1,
        }).range(cursorPos),
      ]);

      viewRef.current.dispatch({
        effects: EditorView.decorations.of(deco)
      });
    });

    return () => {
      view.destroy();
      socket.off("code-init");
      socket.off("code-change");
      socket.off("cursor-move");
    };
  }, []);

  return (
    <div className="cm-editor-wrapper h-screen w-screen ">
      <div
        ref={editorRef}
        className="h-full bg-[#282A36] p-2 text-xl text-[#F8F8F2] "
      />
    </div>
  );
};

export default Editor;
