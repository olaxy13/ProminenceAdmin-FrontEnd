import React from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { $getRoot } from "lexical";
import "./lexical-editor.css";

const initialConfig = {
  namespace: "AddItemEditor",
  theme: {},
  onError(error) {
    throw error;
  },
};

export default function LexicalDescriptionEditor({ value, onChange }) {
  return (
    <LexicalComposer initialConfig={initialConfig}>
      <RichTextPlugin
        contentEditable={
          <ContentEditable className="lexical-editor-container" />
        }
        placeholder={
          <div className="lexical-editor-placeholder">
            Enter a detailed description...
          </div>
        }
      />
      <HistoryPlugin />
      <OnChangePlugin
        onChange={(editorState) => {
          editorState.read(() => {
            const htmlString = $getRoot().getTextContent();
            onChange(htmlString);
          });
        }}
      />
    </LexicalComposer>
  );
}
