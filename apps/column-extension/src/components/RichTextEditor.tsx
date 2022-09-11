import React, { FC } from 'react';
import { Content } from '@tiptap/core';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Toolbar } from './Toolbar';
import { Popover } from './Popover';
import ColumnExtension from '@gocapsule/column-extension';
import '@gocapsule/column-extension/src/index.css';
import './RichTextEditor.scss';

type RichTextEditorProps = {
  content?: Content;
  editable?: boolean;
};

const RichTextEditor: FC<RichTextEditorProps> = ({ content = '', editable = true }) => {
  const editor = useEditor({
    content,
    extensions: [StarterKit, ColumnExtension],
    editable,
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
};

export { RichTextEditor };
