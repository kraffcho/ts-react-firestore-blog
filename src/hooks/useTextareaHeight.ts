import { useState } from "react";

const MIN_HEIGHT = 150;
const HEIGHT_INCREMENT = 150;

const useTextareaHeight = (initialHeight = MIN_HEIGHT) => {
  const [textareaHeight, setTextareaHeight] = useState(initialHeight);

  const increaseHeight = () => {
    setTextareaHeight((prevHeight) => prevHeight + HEIGHT_INCREMENT);
  };

  const decreaseHeight = () => {
    setTextareaHeight((prevHeight) =>
      Math.max(prevHeight - HEIGHT_INCREMENT, MIN_HEIGHT)
    );
  };

  return {
    textareaHeight,
    increaseHeight,
    decreaseHeight,
  };
};

export default useTextareaHeight;
