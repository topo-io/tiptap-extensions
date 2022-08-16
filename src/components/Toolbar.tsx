import React from "react";
import classNames from "classnames";
import { Editor } from "@tiptap/react";
import useInView from "react-cool-inview";
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
  RiLayoutColumnFill,
  RiLayoutColumnLine
} from "react-icons/ri";

import "./Toolbar.scss";

type ToolbarProps = {
  editor: Editor;
};

function Toolbar({ editor }: ToolbarProps) {
  const { observe, inView } = useInView({
    rootMargin: "-1px 0px 0px 0px",
    threshold: [1]
  });

  return (
    <div
      className={classNames("ToolbarContainer", { sticky: !inView })}
      ref={observe}
    >
      <div className="Toolbar">
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
          onClick={() => editor.chain().focus().toggleCode().run()}
        >
          <RiCodeSSlashLine />
        </div>
        <div className="divider"></div>
        <div
          className="icon"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          <RiH1 />
        </div>
        <div
          className="icon"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <RiH2 />
        </div>
        <div
          className="icon"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          <RiH3 />
        </div>
        <div
          className="icon"
          onClick={() => editor.chain().focus().setParagraph().run()}
        >
          <RiParagraph />
        </div>
        <div
          className="icon"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <RiListOrdered />
        </div>
        <div
          className="icon"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <RiListUnordered />
        </div>
        <div
          className="icon"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          <RiCodeBoxLine />
        </div>
        <div className="divider"></div>
        <div
          className="icon"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <RiDoubleQuotesL />
        </div>
        <div
          className="icon"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <RiSeparator />
        </div>
        <div
          className="icon"
          onClick={() => editor.chain().focus().unsetColumns().run()}
        >
          <RiLayoutColumnFill />
        </div>
        <div
          className="icon"
          onClick={() => editor.chain().focus().insertColumns(3).run()}
        >
          <RiLayoutColumnLine />
        </div>
      </div>
    </div>
  );
}

export { Toolbar };
