import { Content } from "@tiptap/core";
import "@gocapsule/column-extension/src/index.css";
import "./RichTextEditor.scss";
declare type RichTextEditorProps = {
    content?: Content;
    editable?: boolean;
};
declare function RichTextEditor({ content, editable }: RichTextEditorProps): JSX.Element | null;
export { RichTextEditor };
