import { Extension } from '@tiptap/core';

import { Column } from './Column';
import { ColumnBlock } from './ColumnBlock';
import { Document } from './Document';

interface ColumnExtensionOptions {
  document?: boolean;
  column?: boolean;
  columnBlock?: boolean;
}

export const ColumnExtension = Extension.create<ColumnExtensionOptions>({
  name: 'columnExtension',

  addExtensions() {
    const extensions = [];

    // if (this.options.document !== false) {
    //   extensions.push(Document);
    // }

    if (this.options.column !== false) {
      extensions.push(Column);
    }

    if (this.options.columnBlock !== false) {
      extensions.push(ColumnBlock);
    }

    return extensions;
  },
});

export { Column, ColumnBlock, Document };

export default ColumnExtension;
