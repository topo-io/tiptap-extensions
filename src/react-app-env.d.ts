/// <reference types="react-scripts" />

import { Commands } from '@tiptap/core'

declare module "@tiptap/core" {

  interface Commands<ReturnType> {
    columnBlock: {
      setColumns: (columns: number) => ReturnType;
      unsetColumns: () => ReturnType;
    };
  }
}
