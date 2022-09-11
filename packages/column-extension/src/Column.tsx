import { Node, mergeAttributes } from '@tiptap/core';

export const Column = Node.create({
  name: 'column',
  group: 'column',
  content: '(paragraph|block)*',
  isolating: true,
  selectable: false,

  renderHTML({ HTMLAttributes }) {
    const attrs = mergeAttributes(HTMLAttributes, { class: 'column' });
    return ['div', attrs, 0];
  },
});
