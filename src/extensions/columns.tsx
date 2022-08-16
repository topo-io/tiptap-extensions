import { Node, mergeAttributes } from "@tiptap/core";
import { EditorState, NodeSelection } from "prosemirror-state";
import { Node as NodeModel } from "prosemirror-model";

interface ColumnBlockOptions {
  columnsAllowed: number[];
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    columnBlock: {
      setColumns: (columns: number) => ReturnType;
      insertColumns: (columns: number) => ReturnType;
      unsetColumns: () => ReturnType;
    };
  }
}

const buildNode = (type, content = null) => {
  if (content) {
    return { type, content };
  }
  return { type };
};

const buildParagraph = (content = null) => buildNode("paragraph", content);
const buildColumn = (content = null) => buildNode("column", content);
const buildColumnBlock = (content = null) => buildNode("columnBlock", content);
const buildFilledColumnBlock = (n, firstColumn = null) => {
  let k;
  let columns;
  if (firstColumn !== null) {
    k = 1;
    columns = [firstColumn];
  } else {
    k = 0;
    columns = [];
  }
  for (let i = 0; i < n - k; i++) {
    const column = buildColumn([buildParagraph()]);
    columns.push(column);
  }
  const columnBlock = buildColumnBlock(columns);
  return columnBlock;
};

export const Column = Node.create({
  name: "column",
  group: "column",
  content: "(paragraph|block)*",
  isolating: true,
  selectable: false,

  renderHTML({ HTMLAttributes }) {
    const attrs = mergeAttributes(HTMLAttributes, { class: "column" });
    return ["div", attrs, 0];
  }
});

const firstAncestorPos = (state: EditorState) => {
  const { selection, doc } = state;
  const { $from } = selection;
  let firstAncestorPos = { pos: null, node: null, index: null };
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
  return firstAncestorPos;
};

export const ColumnBlock = Node.create<ColumnBlockOptions>({
  name: "columnBlock",
  group: "layout",
  content: "column{2,}",
  isolating: true,
  selectable: true,

  renderHTML({ HTMLAttributes }) {
    const attrs = mergeAttributes(HTMLAttributes, { class: "column-block" });
    return ["div", attrs, 0];
  },

  addOptions() {
    return {
      columnsAllowed: [2, 3]
    };
  },

  addCommands() {
    return {
      insertColumns: (n: number) => ({ state, tr, dispatch }) => {
        const { schema, selection } = state;
        const { columnsAllowed } = this.options;
        if (!columnsAllowed.includes(n)) {
          throw new Error("Invalid number of columns");
        }

        const columnBlock = buildFilledColumnBlock(n);
        const newNode = NodeModel.fromJSON(schema, columnBlock);

        return dispatch(
          tr.setSelection(selection).replaceSelectionWith(newNode)
        );
      },
      setColumns: (n: number) => ({ state, tr, dispatch }) => {
        const { schema, doc } = state;
        const { node, pos, index } = firstAncestorPos(state);

        const type = schema.nodes[this.name];
        if (!doc.canReplaceWith(index, index, type)) {
          return false;
        }

        const { columnsAllowed } = this.options;
        if (!columnsAllowed.includes(n)) {
          throw new Error("Invalid number of columns");
        }

        const resolvedPos = tr.doc.resolve(pos);
        const sel = new NodeSelection(resolvedPos);

        const firstColumn = buildColumn([node.toJSON()]);
        const columnBlock = buildFilledColumnBlock(n, firstColumn);
        const newNode = NodeModel.fromJSON(schema, columnBlock);

        return dispatch(tr.setSelection(sel).replaceSelectionWith(newNode));
      },
      unsetColumns: () => ({ state, tr, dispatch }) => {
        const { node, pos } = firstAncestorPos(state);
        if (node.type.name !== this.name) {
          return;
        }

        const resolvedPos = tr.doc.resolve(pos);
        const sel = new NodeSelection(resolvedPos);
        return dispatch(tr.setSelection(sel).deleteSelection());
      }
    };
  }
});
