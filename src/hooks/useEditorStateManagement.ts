import { useState, useRef, useCallback } from "react";
import { EditorState, RichUtils, convertFromRaw, convertToRaw } from "draft-js";

type UseEditorStateManagementProps = {
  postContent?: string; // Initial content (for editing)
};

type UseEditorStateManagementReturn = {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  editorState: EditorState;
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>;
  category: string | undefined;
  setCategory: React.Dispatch<React.SetStateAction<string | undefined>>;
  titleRef: React.RefObject<HTMLInputElement>;
  categoryRef: React.RefObject<HTMLSelectElement>;
  handleKeyCommand: (
    command: string,
    editorState: EditorState
  ) => "handled" | "not-handled";
  validateAndSerializeContent: () => string | string;
};

export const useEditorStateManagement = ({
  postContent = "",
}: UseEditorStateManagementProps = {}): UseEditorStateManagementReturn => {
  const [title, setTitle] = useState("");
  const [editorState, setEditorState] = useState(() =>
    postContent
      ? EditorState.createWithContent(convertFromRaw(JSON.parse(postContent)))
      : EditorState.createEmpty()
  );
  const [category, setCategory] = useState<string | undefined>("");
  const titleRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLSelectElement>(null);

  const handleKeyCommand = (command: string, editorState: EditorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return "handled";
    }
    return "not-handled";
  };

  const validateAndSerializeContent = useCallback(() => {
    const contentRaw = editorState.getCurrentContent();
    const contentString = contentRaw.getPlainText();
    const serializedContent = JSON.stringify(convertToRaw(contentRaw));
    const TITLE_MIN_LENGTH = 30;
    const CONTENT_MIN_LENGTH = 1000;

    if (title.length < TITLE_MIN_LENGTH) {
      return `Title should be at least ${TITLE_MIN_LENGTH} symbols! You have ${
        title.length
      } symbols. Please add ${TITLE_MIN_LENGTH - title.length} more.`;
    }
    if (!category) {
      return "Please choose a category!";
    }
    if (contentString.length < CONTENT_MIN_LENGTH) {
      return `Content should be at least ${CONTENT_MIN_LENGTH} symbols! You have ${
        contentString.length
      } symbols. You need ${
        CONTENT_MIN_LENGTH - contentString.length
      } more symbols.`;
    }
    return serializedContent;
  }, [title, category, editorState]);

  return {
    title,
    setTitle,
    editorState,
    setEditorState,
    category,
    setCategory,
    titleRef,
    categoryRef,
    handleKeyCommand,
    validateAndSerializeContent,
  };
};
