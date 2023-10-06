import React from "react";
import { EditorState, RichUtils } from "draft-js";

interface Props {
  editorState: EditorState;
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>;
}

const RichTextToolbar: React.FC<Props> = ({ editorState, setEditorState }) => {
  return (
    <div className="toolbar">
      <button
        type="button"
        onClick={() =>
          setEditorState(RichUtils.toggleInlineStyle(editorState, "BOLD"))
        }
      >
        Bold
      </button>
      <button
        type="button"
        onClick={() =>
          setEditorState(RichUtils.toggleInlineStyle(editorState, "ITALIC"))
        }
      >
        Italic
      </button>
    </div>
  );
};

export default RichTextToolbar;
