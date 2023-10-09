import React from "react";

interface ReadingTimeProps {
  content: string;
}

const ReadingTime: React.FC<ReadingTimeProps> = ({ content }) => {
  const calculateReadingTime = (text: string): number => {
    const words = text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;

    return words / 200;
  };

  const wordsCount = content
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;

  const readingTime = calculateReadingTime(content);

  let message: string;

  if (wordsCount === 0) {
    message = "No content added yet";
  } else if (readingTime < 1) {
    message = "Quick read";
  } else {
    message = `${Math.round(readingTime)} min read`;
  }

  return (
    <span className="reading-time">
      {message} <span className="material-symbols-outlined">schedule</span>
    </span>
  );
};

export default ReadingTime;
