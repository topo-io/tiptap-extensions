import React from "react";
import { Node } from "@tiptap/core";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import { Toolbar } from "./Toolbar";
import { Popover } from "./Popover";
import { Column, ColumnBlock } from "../extensions";

import "./Tiptap.scss";

type TiptapProps = {
  content?: string;
  editable?: boolean;
};

const Document = Node.create({
  name: "doc",
  topNode: true,
  content: "(block|layout)+"
});

function Tiptap({ content = "", editable = true }: TiptapProps) {
  const editor = useEditor({
    content,
    extensions: [
      Document,
      StarterKit.configure({ document: false }),
      Column,
      ColumnBlock
    ],
    editable
  });

  if (!editor) {
    return null;
  }

  return (
    <>
      <div className="WhiteCard">
        <Toolbar editor={editor} />
        <Popover editor={editor} />
        <EditorContent editor={editor} />
      </div>
      <h2>Text (tiptap)</h2>
      <div className="WhiteCard">
        <pre>{editor.getText()}</pre>
      </div>
      <h2>JSON (tiptap)</h2>
      <div className="WhiteCard">
        <pre>{JSON.stringify(editor.getJSON())}</pre>
      </div>
    </>
  );
}

export { Tiptap };
