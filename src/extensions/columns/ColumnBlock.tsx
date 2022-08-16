import { Node, mergeAttributes, CommandProps } from "@tiptap/core";
import { NodeSelection } from "prosemirror-state";
import { Node as ProseMirrorNode } from "prosemirror-model";
import { buildColumn, buildNColumns, buildColumnBlock, Predicate, findParentNodeClosestToPos } from "./utils";
import _ from 'lodash'

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

      // find the content inside of all the columns
      let nodes: Array<ProseMirrorNode> = []
      firstAncestor.node.descendants((node, pos, parent) => {
        if (parent?.type.name === 'column') {
          nodes.push(node)
        }
      })
      nodes = _.reverse(nodes)

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

      // find the first ancestor
      const pos = state.selection.$from
      const where: Predicate = ({pos}) => doc.resolve(pos).depth <= 0;
      const firstAncestor = findParentNodeClosestToPos(pos, where);

      // create columns and put old content in the first column
      let columnBlock
      if (keepContent) {
        const content = [firstAncestor.node.toJSON()]
        const firstColumn = buildColumn({ content });
        const otherColumns = buildNColumns(n-1);
        columnBlock = buildColumnBlock({ content: [firstColumn, ...otherColumns] })
      } else {
        const columns = buildNColumns(n);
        columnBlock = buildColumnBlock({ content: columns })
      }
      const newNode = ProseMirrorNode.fromJSON(schema, columnBlock);

      // resolve the position of the first ancestor
      const resolvedPos = tr.doc.resolve(firstAncestor.pos);
      const sel = new NodeSelection(resolvedPos);

      // replace the first ancestor
      return dispatch(tr.setSelection(sel).replaceSelectionWith(newNode));
    }

    return {
      unsetColumns,
      setColumns,
      insertColumns: (n: number) => setColumns(n, false),
    };
  }
});
