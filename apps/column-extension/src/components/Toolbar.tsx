import React from 'react';
import { Editor } from '@tiptap/react';
import {
  RiBold,
  RiItalic,
  RiStrikethrough,
  RiCodeSSlashLine,
  RiH1,
  RiH2,
  RiH3,
  RiParagraph,
  RiListOrdered,
  RiListUnordered,
  RiCodeBoxLine,
  RiDoubleQuotesL,
  RiSeparator,
} from 'react-icons/ri';
import { BsLayoutThreeColumns } from 'react-icons/bs';
import { TbLayoutOff } from 'react-icons/tb';

import './Toolbar.scss';

type ToolbarProps = {
  editor: Editor;
};

function Toolbar({ editor }: ToolbarProps) {
  return (
    <div className={'ToolbarContainer'}>
      <div className="Toolbar">
        <div className="icon" onClick={() => editor.chain().focus().toggleBold().run()}>
          <RiBold />
        </div>
        <div className="icon" onClick={() => editor.chain().focus().toggleItalic().run()}>
          <RiItalic />
        </div>
        <div className="icon" onClick={() => editor.chain().focus().toggleStrike().run()}>
          <RiStrikethrough />
        </div>
        <div className="icon" onClick={() => editor.chain().focus().toggleCode().run()}>
          <RiCodeSSlashLine />
        </div>
        <div className="divider"></div>
        <div
          className="icon"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          <RiH1 />
        </div>
        <div
          className="icon"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <RiH2 />
        </div>
        <div
          className="icon"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <RiH3 />
        </div>
        <div className="icon" onClick={() => editor.chain().focus().setParagraph().run()}>
          <RiParagraph />
        </div>
        <div className="icon" onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <RiListOrdered />
        </div>
        <div className="icon" onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <RiListUnordered />
        </div>
        <div className="icon" onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
          <RiCodeBoxLine />
        </div>
        <div className="divider"></div>
        <div className="icon" onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <RiDoubleQuotesL />
        </div>
        <div className="icon" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          <RiSeparator />
        </div>
        <div className="icon" onClick={() => editor.chain().focus().unsetColumns().run()}>
          <TbLayoutOff />
        </div>
        <div className="icon" onClick={() => editor.chain().focus().setColumns(3).run()}>
          <BsLayoutThreeColumns />
        </div>
      </div>
    </div>
  );
}

export { Toolbar };
