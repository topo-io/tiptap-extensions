import { Node, mergeAttributes } from "@tiptap/core";
import { NodeSelection } from "prosemirror-state";
import { Node as NodeModel } from "prosemirror-model";
import { buildColumn, buildFilledColumnBlock, firstAncestorPos } from "./utils";

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
    return {
      insertColumns: (n: number) => ({ state, tr, dispatch }) => {
        if (!dispatch) {
            return;
        }
        
        const { schema, selection } = state;
        const columnBlock = buildFilledColumnBlock({n});
        const newNode = NodeModel.fromJSON(schema, columnBlock);

        return dispatch(
          tr.setSelection(selection).replaceSelectionWith(newNode)
        );
      },
      setColumns: (n: number) => ({ state, tr, dispatch }) => {
        if (!dispatch) {
            return;
        }
        
        const { schema, doc } = state;
        const { node, pos, index } = firstAncestorPos(state);

        const type = schema.nodes[this.name];
        if (!doc.canReplaceWith(index, index, type)) {
          return false;
        }

        const resolvedPos = tr.doc.resolve(pos);
        const sel = new NodeSelection(resolvedPos);

        const firstColumn = buildColumn({content: [node.toJSON()]});
        const columnBlock = buildFilledColumnBlock({n, firstColumn});
        const newNode = NodeModel.fromJSON(schema, columnBlock);

        return dispatch(tr.setSelection(sel).replaceSelectionWith(newNode));
      },
      unsetColumns: () => ({ state, tr, dispatch }) => {
        if (!dispatch) {
            return;
        }
        
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
