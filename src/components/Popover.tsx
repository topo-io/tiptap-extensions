import React from "react";
import { BubbleMenu, Editor } from "@tiptap/react";
import {
  RiBold,
  RiItalic,
  RiStrikethrough,
  RiH1,
  RiH2,
  RiCodeSSlashLine,
} from "react-icons/ri";
import {
  TbLayoutOff
} from "react-icons/tb";
import {
  BsLayoutThreeColumns
} from "react-icons/bs";

import "./Popover.scss";

type PopoverProps = {
  editor: Editor;
};

function Popover({ editor }: PopoverProps) {
  return (
    <BubbleMenu className="Popover" editor={editor}>
      <div
        className="icon"
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <RiBold />
      </div>
      <div
        className="icon"
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <RiItalic />
      </div>
      <div
        className="icon"
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <RiStrikethrough />
      </div>
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
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        <RiCodeSSlashLine />
      </div>
    <div
        className="icon"
        onClick={() => editor.chain().focus().unsetColumns().run()}
    >
        <TbLayoutOff />
    </div>
    <div
        className="icon"
        onClick={() => editor.chain().focus().setColumns(3).run()}
    >
        <BsLayoutThreeColumns />
    </div>
    </BubbleMenu>
  );
}

export { Popover };
