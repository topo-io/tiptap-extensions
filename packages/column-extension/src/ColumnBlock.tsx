import { Node, mergeAttributes, CommandProps } from '@tiptap/core';
import { NodeSelection, Selection, TextSelection } from 'prosemirror-state';
import { Node as ProseMirrorNode, NodeType } from 'prosemirror-model';
import {
  buildColumn,
  buildNColumns,
  buildColumnBlock,
  Predicate,
  findParentNodeClosestToPos,
} from './utils';
import { Column } from './Column';
import { ColumnSelection } from './ColumnSelection';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    columnBlock: {
      setColumns: (columns: number) => ReturnType;
      insertColumns: (columns: number) => ReturnType;
      unsetColumns: () => ReturnType;
    };
  }
}


export interface ColumnBlockOptions {
  nestedColumns: boolean;
  columnType: Node;
}

export const ColumnBlock = Node.create<ColumnBlockOptions>({
  name: 'columnBlock',
  group: 'block',
  content: 'column{2,}',
  isolating: true,
  selectable: true,

  addOptions() {
    return {
      nestedColumns: true,
      columnType: Column,
    };
  },

  renderHTML({ HTMLAttributes }) {
    const attrs = mergeAttributes(HTMLAttributes, { class: 'column-block' });
    return ['div', attrs, 0];
  },

  addCommands() {
    const unsetColumns =
      () =>
      ({ state, tr, dispatch }: CommandProps) => {
        try {
          if (!dispatch) {
            return;
          }

          // // find the first ancestor
          // const pos = state.selection.$from;
          // const where: Predicate = ({ node, start }) => {
          //   // if (!this.options.nestedColumns && node.type == this.type) {
          //   //   console.log("found column block", node);
          //   //   return true;
          //   // }
          //   return node.type == this.type;
          // };
          // const firstAncestor = findParentNodeClosestToPos(pos, where);
          // if (firstAncestor === undefined) {
          //   return;
          // }

          // // find the content inside of all the columns
          // let nodes: Array<ProseMirrorNode> = [];
          // firstAncestor.node().descendants((node, _, parent) => {
          //   if (parent?.type.name === Column.name) {
          //     nodes.push(node);
          //   }
          // });
          // nodes = nodes.reverse().filter((node) => node.content.size > 0);

          // // resolve the position of the first ancestor
          // const resolvedPos = tr.doc.resolve(firstAncestor.pos);
          // const sel = new NodeSelection(resolvedPos);

          // // insert the content inside of all the columns and remove the column layout
          // tr = tr.setSelection(sel);
          // nodes.forEach((node) => (tr = tr.insert(firstAncestor.pos, node)));
          // tr = tr.deleteSelection();
          return dispatch(tr);
        } catch (error) {
          console.error(error);
        }
      };

    const setColumns =
      (n: number, keepContent = true) =>
      ({ state, tr, dispatch }: CommandProps) => {
        try {
          const { schema, doc } = state;
          if (!dispatch) {
            return;
          }

          const sel = new ColumnSelection(state.selection);
          console.log(state.selection);
          sel.expandSelection(doc);
          tr = tr.setSelection(sel);
          console.log(sel);
          return dispatch(tr);

          // const firstNode = getFirstNode(sel)
          // if (firstNode?.type === this.type) {
          //   const offset = 2
          //   sel = buildSelection(doc, sel.from + offset, sel.to - offset);
          //   console.log(tr.doc)
          //   console.log(firstNode)
          //   console.log(sel);
          //   console.log(sel.content())
          //   tr = tr.setSelection(sel);
          //   // return;
          // }

          const { openStart, openEnd } = sel.content();
          if (openStart !== openEnd) {
            console.warn('failed depth check');
            return;
          }

          // create columns and put old content in the first column
          let columnBlock;
          if (keepContent) {
            const content = sel.content().toJSON();
            console.log(content);
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
          if (newNode === null) {
            return;
          }

          const parent = sel.$anchor.parent.type;
          // console.log(sel)
          // console.log(sel.content())
          // console.log(tr.doc)
          // console.log(newNode);
          // console.log(newNode.type);
          // console.log(sel);
          // console.log(parent);
          // console.log(firstAncestorEnd);
          const canAcceptColumnBlockChild = (parent: NodeType) => {
            // console.log(this.type)
            // console.log(parent.contentMatch.matchType(this.type));
            // if (!parent.contentMatch.matchType(this.type)) {
            //   return false;
            // }

            if (!this.options.nestedColumns && parent.name === Column.name) {
              return false;
            }

            return true;
          };
          if (!canAcceptColumnBlockChild(parent)) {
            console.warn('content not allowed');
            return;
          }

          // replace the first ancestor
          tr = tr.setSelection(sel);
          // tr = tr.insert(resolvedBeginPos.after(), newNode);
          // tr = tr.deleteSelection();
          tr = tr.replaceSelectionWith(newNode);
          // return dispatch(tr);
        } catch (error) {
          console.error(error);
        }
      };

    return {
      unsetColumns,
      setColumns,
    };
  },
});
