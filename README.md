# Extensions for Tiptap

## Column extension

### Features

The extension introduce 2 new commands:

- setColumns(n) to add n new columns on an existing node
- unsetColumns() to remove columns

Here is a quick preview of the features:
[Column extension for Tiptap - Watch Video](https://www.loom.com/share/019ec6d12dc74334aae7e41fb57eb0a0)

You can try it here:
<https://codesandbox.io/p/github/leonard-henriquez/column-extension/main>

### Install

Install the package

```bash
npm install @gocapsule/column-extension
```

Add the extension to your editor

```javascript
import { Node, Editor } from "@tiptap/core";
import StarterKit from '@tiptap/starter-kit';
import { ColumnExtension } from "@gocapsule/column-extension";
// don't forget to add style to see the columns
import "@gocapsule/column-extension/src/index.css";

new Editor({
  element: document.querySelector('.element'),
  extensions: [
    // override Document to allow columns
    StarterKit.configure({ document: false }),
    ColumnExtension,
  ],
  content: '<p>Hello World!</p>',
});
```

You then need this following stylesheet @gocapsule/column-extension/src/index.css OR add the CSS of the next section.

### Customization

You can customize the style of the columns with css.

The DOM created by the extension looks like this:

![DOM](https://user-images.githubusercontent.com/30215564/184996462-b9476b4f-8a99-473d-a0e0-2351fc3d39af.png)

The CSS is this one:

```css
.ProseMirror .column-block {
  width: 100%;
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
  gap: 24px;
  padding: 8px 0;
}

.ProseMirror .column {
  overflow: auto;
  border: 1px gray dashed;
  border-radius: 8px;
  padding: 8px;
  margin: -8px;
}
```

## Contributing

You can start an example of the editor and the extension(s) with the command:

```bash
yarn start
```

Don't hesitate to open a pull request if you want new features.
