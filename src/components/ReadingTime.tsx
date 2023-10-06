import React from "react";

interface ReadingTimeProps {
  content: string;
}

const ClockIcon: React.FC = () => {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="6" cy="6" r="5.5" stroke="currentColor" />
      <line x1="6" y1="3" x2="6" y2="6" stroke="currentColor" />
      <line x1="6" y1="6" x2="9" y2="6" stroke="currentColor" />
    </svg>
  );
};

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
    <span className="reading-time">{message} <ClockIcon /></span>
  );
};

export default ReadingTime;
