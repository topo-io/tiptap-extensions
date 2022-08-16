import { EditorState } from "prosemirror-state";
import { Node } from "prosemirror-model";
import { JSONContent } from "@tiptap/core";

export const buildNode = ({type, content}: JSONContent): JSONContent => {
  if (content) {
    return { type, content };
  }
  return { type };
};

export const buildParagraph = ({content}: Partial<JSONContent>) => buildNode({type: "paragraph", content});

export const buildColumn = ({content}: Partial<JSONContent>) => buildNode({type: "column", content});

export const buildColumnBlock = ({content}: Partial<JSONContent>) => buildNode({type: "columnBlock", content});

interface buildFilledColumnBlockProps {
    n: number;
    firstColumn?: JSONContent;
}

export const buildFilledColumnBlock = ({ n ,firstColumn }: buildFilledColumnBlockProps) => {
  let k = 0;
  let columns: Array<JSONContent> = [];
  if (firstColumn !== undefined) {
    k = 1;
    columns = [firstColumn];
  }
  for (let i = 0; i < n - k; i++) {
    const column = buildColumn({content: [buildParagraph({})]});
    columns.push(column);
  }
  const columnBlock = buildColumnBlock({ content: columns });
  return columnBlock;
};

interface firstAncestorPosReturnType {
    pos: number;
    node: Node;
    index: number;
}

export const firstAncestorPos = (state: EditorState) => {
  const { selection, doc } = state;
  const { $from } = selection;
  
  let firstAncestorPos: firstAncestorPosReturnType = { node: new Node(), pos: -1, index: -1 };
  doc.forEach((node, pos, index) => {
    if (pos === $from.pos) {
      firstAncestorPos = { node, pos, index };
      return false;
    }

    if (node.childCount === 0) {
      return false;
    }

    if ($from.sharedDepth(pos + 1) > 0) {
      firstAncestorPos = { node, pos, index };
    }
    return false;
  });
  
  if (firstAncestorPos.pos === -1) {
      throw Error()
  }
  
  return firstAncestorPos;
};
