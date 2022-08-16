import React from "react";
import { Node, Content } from "@tiptap/core";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import { Toolbar } from "./Toolbar";
import { Popover } from "./Popover";
import { Column, ColumnBlock } from "../extensions";

import "./RichTextEditor.scss";

type RichTextEditorProps = {
  content?: Content;
  editable?: boolean;
};

const Document = Node.create({
  name: "doc",
  topNode: true,
  content: "(block|layout)+"
});

function RichTextEditor({ content = "", editable = true }: RichTextEditorProps) {
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
      <h2>Text</h2>
      <div className="WhiteCard">
        <pre>{editor.getText()}</pre>
      </div>
      <h2>JSON</h2>
      <div className="WhiteCard">
        <pre>{JSON.stringify(editor.getJSON())}</pre>
      </div>
    </>
  );
}

export { RichTextEditor };
