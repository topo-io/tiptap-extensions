import { Node, mergeAttributes } from '@tiptap/core';
import type { CommandProps } from '@tiptap/core';
import type { Node as ProseMirrorNode, NodeType } from 'prosemirror-model';
import { NodeSelection } from 'prosemirror-state';

import { Column } from './Column';
import { ColumnSelection } from './ColumnSelection';
import { buildColumn, buildNColumns, buildColumnBlock, findParentNodeClosestToPos } from './utils';
import type { Predicate } from './utils';

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
      nestedColumns: false,
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
      ({ tr, dispatch }: CommandProps) => {
        try {
          if (!dispatch) {
            return;
          }

          // find the first ancestor
          const pos = tr.selection.$from;
          const where: Predicate = ({ node }) => {
            if (!this.options.nestedColumns && node.type == this.type) {
              return true;
            }
            return node.type == this.type;
          };
          const firstAncestor = findParentNodeClosestToPos(pos, where);
          if (firstAncestor === undefined) {
            return;
          }

          // find the content inside of all the columns
          let nodes: Array<ProseMirrorNode> = [];
          firstAncestor.node.descendants((node, _, parent) => {
            if (parent?.type.name === Column.name) {
              nodes.push(node);
            }
          });
          nodes = nodes.reverse().filter((node) => node.content.size > 0);

          // resolve the position of the first ancestor
          const resolvedPos = tr.doc.resolve(firstAncestor.pos);
          const sel = new NodeSelection(resolvedPos);

          // insert the content inside of all the columns and remove the column layout
          tr = tr.setSelection(sel);
          nodes.forEach((node) => (tr = tr.insert(firstAncestor.pos, node)));
          tr = tr.deleteSelection();
          return dispatch(tr);
        } catch (error) {
          console.error(error);
        }
      };

    const setColumns =
      (n: number, keepContent = false) =>
      ({ tr, dispatch }: CommandProps) => {
        try {
          const { doc, selection } = tr;
          if (!dispatch) {
            console.log('no dispatch');
            return;
          }

          const sel = new ColumnSelection(selection);
          sel.expandSelection(doc);

          const { openStart, openEnd } = sel.content();
          if (openStart !== openEnd) {
            console.warn('failed depth check');
            return;
          }

          // create columns and put old content in the first column
          let columnBlock;
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
          const newNode = doc.type.schema.nodeFromJSON(columnBlock);
          if (newNode === null) {
            return;
          }

          const parent = sel.$anchor.parent.type;
          const canAcceptColumnBlockChild = (par: NodeType) => {
            if (!par.contentMatch.matchType(this.type)) {
              return false;
            }

            if (!this.options.nestedColumns && par.name === Column.name) {
              return false;
            }

            return true;
          };
          if (!canAcceptColumnBlockChild(parent)) {
            console.warn('content not allowed');
            return;
          }

          tr = tr.setSelection(sel);
          tr = tr.replaceSelectionWith(newNode, false);
          return dispatch(tr);
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
