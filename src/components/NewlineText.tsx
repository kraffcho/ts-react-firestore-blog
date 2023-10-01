import React from "react";

interface NewlineTextProps {
  text: string;
}

const NewlineText: React.FC<NewlineTextProps> = ({ text }) => {
  return (
    <>
      {text.split("\n").map((str, index) => (
        <React.Fragment key={index}>
          {str}
          {index !== text.split("\n").length - 1 && <br />}
        </React.Fragment>
      ))}
    </>
  );
};

export default NewlineText;
