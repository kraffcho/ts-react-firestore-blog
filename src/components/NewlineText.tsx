import React from "react";

interface NewlineTextProps {
  text: string;
}

const NewlineText: React.FC<NewlineTextProps> = ({ text }) => {
  return (
    <>
      {text.split("\n").map((str, index) => (
        // Wrap each string in a fragment with a unique key
        <React.Fragment key={index}>
          {str}
          {index !== text.split("\n").length - 1 && <br />}
        </React.Fragment>
      ))}
    </>
  );
};

export default NewlineText;
