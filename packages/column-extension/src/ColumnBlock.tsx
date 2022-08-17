import { Node, mergeAttributes, CommandProps } from '@tiptap/core';
import { NodeSelection, TextSelection } from "prosemirror-state";
import { Node as ProseMirrorNode } from "prosemirror-model";
import { buildColumn, buildNColumns, buildColumnBlock, Predicate, findParentNodeClosestToPos } from "./utils";

import { Commands } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    columnBlock: {
      setColumns: (columns: number) => ReturnType;
      unsetColumns: () => ReturnType;
    };
  }
}

export const ColumnBlock = Node.create({
  name: "columnBlock",
  group: "layout",
  content: "column{2,}",
  isolating: true,
  selectable: true,

  renderHTML({ HTMLAttributes }) {
    const attrs = mergeAttributes(HTMLAttributes, { class: "column-block" });
    return ["div", attrs, 0];
  },

  addCommands() {
    const unsetColumns = () => ({ state, tr, dispatch }: CommandProps) => {
      if (!dispatch) {
        return;
      }

      // find the first ancestor
      const pos = state.selection.$from
      const where: Predicate = ({ node }) => node.type === state.schema.nodes.columnBlock;
      const firstAncestor = findParentNodeClosestToPos(pos, where);
      if (firstAncestor === undefined) {
        return;
      }

      // find the content inside of all the columns
      let nodes: Array<ProseMirrorNode> = []
      firstAncestor.node.descendants((node, _, parent) => {
        if (parent?.type.name === 'column') {
          nodes.push(node)
        }
      })
      nodes = nodes.reverse().filter((node) => node.content.size > 0)

      // resolve the position of the first ancestor
      const resolvedPos = tr.doc.resolve(firstAncestor.pos);
      const sel = new NodeSelection(resolvedPos);

      // insert the content inside of all the columns and remove the column layout
      tr = tr.setSelection(sel)
      nodes.forEach((node) => tr = tr.insert(firstAncestor.pos, node))
      tr = tr.deleteSelection()
      return dispatch(tr);
    }

    const setColumns = (n: number, keepContent = true) => ({ state, tr, dispatch }: CommandProps) => {
      const { schema, doc } = state;
      if (!dispatch) {
        return;
      }

      // find the first ancestor of the beginning of the selection
      const where: Predicate = ({pos}) => doc.resolve(pos).depth <= 0;
      const firstAncestorBegin = findParentNodeClosestToPos(state.selection.$from, where);
      if (firstAncestorBegin === undefined) {
        return;
      }

      // find the first ancestor of the end of the selection
      const firstAncestorEnd = findParentNodeClosestToPos(state.selection.$to, where);
      if (firstAncestorEnd === undefined) {
        return;
      }

      // create a new selection that take all the nodes
      const resolvedBeginPos = tr.doc.resolve(firstAncestorBegin.pos);
      const resolvedEndPos = tr.doc.resolve(firstAncestorEnd.pos + firstAncestorEnd.node.nodeSize);
      const sel = new TextSelection(resolvedBeginPos, resolvedEndPos);

      // create columns and put old content in the first column
      let columnBlock
      if (keepContent) {
        const content = sel.content().toJSON();
        const firstColumn = buildColumn(content);
        const otherColumns = buildNColumns(n - 1);
        columnBlock = buildColumnBlock({
          content: [firstColumn, ...otherColumns],
        });
      } else {
        const columns = buildNColumns(n);
        columnBlock = buildColumnBlock({ content: columns });
      }
      const newNode = schema.nodeFromJSON(columnBlock);

      // replace the first ancestor
      return dispatch(tr.setSelection(sel).replaceSelectionWith(newNode));
    }

    return {
      unsetColumns,
      setColumns,
    };
  }
});
