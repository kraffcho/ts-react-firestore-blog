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
            ? "1px solid #ef91f3"
            : "1px solid #ccc",
          backgroundColor: isActiveBlock("header-one")
            ? "#fdffdc"
            : "#ffffff",
        }}
      >
        H2
      </button>
      <button
        type="button"
        onClick={() => handleBlockType("header-two")}
        style={{
          border: isActiveBlock("header-two")
            ? "1px solid #ef91f3"
            : "1px solid #ccc",
          backgroundColor: isActiveBlock("header-two")
            ? "#fdffdc"
            : "#ffffff",
        }}
      >
        H3
      </button>
      <button
        type="button"
        onClick={() => handleBlockType("header-three")}
        style={{
          border: isActiveBlock("header-three")
            ? "1px solid #ef91f3"
            : "1px solid #ccc",
          backgroundColor: isActiveBlock("header-three")
            ? "#fdffdc"
            : "#ffffff",
        }}
      >
        H4
      </button>
      <button
        type="button"
        style={{
          fontWeight: "bold",
          border: isActiveStyle("BOLD") ? "1px solid #ef91f3" : "1px solid #ccc",
          backgroundColor: isActiveStyle("BOLD")
            ? "#fdffdc"
            : "#ffffff",
        }}
        onClick={() => handleInlineStyle("BOLD")}
      >
        Bold
      </button>
      <button
        type="button"
        style={{
          fontStyle: "italic",
          border: isActiveStyle("ITALIC") ? "1px solid #ef91f3" : "1px solid #ccc",
          backgroundColor: isActiveStyle("ITALIC")
            ? "#fdffdc"
            : "#ffffff",
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
            ? "1px solid #ef91f3"
            : "1px solid #ccc",
          backgroundColor: isActiveStyle("UNDERLINE")
            ? "#fdffdc"
            : "#ffffff",
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
            ? "1px solid #ef91f3"
            : "1px solid #ccc",
          backgroundColor: isActiveStyle("STRIKETHROUGH")
            ? "#fdffdc"
            : "#ffffff",
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
            ? "1px solid #ef91f3"
            : "1px solid #ccc",
          backgroundColor: isActiveBlock("unordered-list-item")
            ? "#fdffdc"
            : "#ffffff",
        }}
      >
        UL
      </button>
      <button
        type="button"
        onClick={() => handleBlockType("ordered-list-item")}
        style={{
          border: isActiveBlock("ordered-list-item")
            ? "1px solid #ef91f3"
            : "1px solid #ccc",
          backgroundColor: isActiveBlock("ordered-list-item")
            ? "#fdffdc"
            : "#ffffff",
        }}
      >
        OL
      </button>
      <button
        type="button"
        onClick={() => handleBlockType("blockquote")}
        style={{
          border: isActiveBlock("blockquote")
            ? "1px solid #ef91f3"
            : "1px solid #ccc",
          borderLeft: isActiveBlock("blockquote")
            ? "5px solid #ef91f3"
            : "5px solid #ccc",
          backgroundColor: isActiveBlock("blockquote")
            ? "#fdffdc"
            : "#ffffff",
        }}
      >
        Quote
      </button>
    </div>
  );
};

export default RichTextToolbar;
