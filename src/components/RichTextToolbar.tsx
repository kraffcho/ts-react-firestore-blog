import React from "react";
import { EditorState, RichUtils } from "draft-js";

interface Props {
  editorState: EditorState;
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>;
}

const RichTextToolbar: React.FC<Props> = ({ editorState, setEditorState }) => {
  const handleInlineStyle = (style: string) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, style));
  };

  const handleBlockType = (blockType: string) => {
    setEditorState(RichUtils.toggleBlockType(editorState, blockType));
  };

  const currentInlineStyle = editorState.getCurrentInlineStyle();
  const isActiveStyle = (style: string) => {
    return currentInlineStyle.has(style);
  };

  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(editorState.getSelection().getStartKey())
    .getType();

  const isActiveBlock = (type: string) => {
    return blockType === type;
  };

  return (
    <div className="toolbar">
      <button
        type="button"
        onClick={() => handleBlockType("header-one")}
        style={{
          border: isActiveBlock("header-one")
            ? "1px solid #555"
            : "1px solid #ccc",
        }}
      >
        H2
      </button>
      <button
        type="button"
        onClick={() => handleBlockType("header-two")}
        style={{
          border: isActiveBlock("header-two")
            ? "1px solid #555"
            : "1px solid #ccc",
        }}
      >
        H3
      </button>
      <button
        type="button"
        onClick={() => handleBlockType("header-three")}
        style={{
          border: isActiveBlock("header-three")
            ? "1px solid #555"
            : "1px solid #ccc",
        }}
      >
        H4
      </button>
      <button
        type="button"
        style={{
          fontWeight: "bold",
          border: isActiveStyle("BOLD") ? "1px solid #555" : "1px solid #ccc",
        }}
        onClick={() => handleInlineStyle("BOLD")}
      >
        Bold
      </button>
      <button
        type="button"
        style={{
          fontStyle: "italic",
          border: isActiveStyle("ITALIC") ? "1px solid #555" : "1px solid #ccc",
        }}
        onClick={() => handleInlineStyle("ITALIC")}
      >
        Italic
      </button>
      <button
        type="button"
        style={{
          textDecoration: "underline",
          border: isActiveStyle("UNDERLINE")
            ? "1px solid #555"
            : "1px solid #ccc",
        }}
        onClick={() => handleInlineStyle("UNDERLINE")}
      >
        Underline
      </button>
      <button
        type="button"
        style={{
          textDecoration: "line-through",
          border: isActiveStyle("STRIKETHROUGH")
            ? "1px solid #555"
            : "1px solid #ccc",
        }}
        onClick={() => handleInlineStyle("STRIKETHROUGH")}
      >
        Strikethrough
      </button>
      <button
        type="button"
        onClick={() => handleBlockType("unordered-list-item")}
        style={{
          border: isActiveBlock("unordered-list-item")
            ? "1px solid #555"
            : "1px solid #ccc",
        }}
      >
        UL
      </button>
      <button
        type="button"
        onClick={() => handleBlockType("ordered-list-item")}
        style={{
          border: isActiveBlock("ordered-list-item")
            ? "1px solid #555"
            : "1px solid #ccc",
        }}
      >
        OL
      </button>
      <button
        type="button"
        onClick={() => handleBlockType("blockquote")}
        style={{
          border: isActiveBlock("blockquote")
            ? "1px solid #555"
            : "1px solid #ccc",
            borderLeft: isActiveBlock("blockquote")
            ? "5px solid #555"
            : "5px solid #ccc",
        }}
      >
        Quote
      </button>
    </div>
  );
};

export default RichTextToolbar;
